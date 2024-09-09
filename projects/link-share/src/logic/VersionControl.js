import { Session } from "./Session.js"

/**
 * The `VersionControl` class manages synchronization between local storage and the cloud database.
 * It handles data retrieval, synchronization, and updates for user profiles and links.
 */
export class VersionControl {

    static #database
    static #localStorage

    /**
     * Converts a Base64 string to a Blob object.
     * 
     * @param {string} base64String - The Base64 encoded string representing the image.
     * @returns {Blob} - The Blob object created from the Base64 string.
     * @private
     */
    static #convertBase64ToBlob(base64String) {

        const mimeType = base64String.slice(base64String.indexOf(':') + 1, base64String.indexOf(';'))

        const base64Data = base64String.slice(base64String.indexOf(',') + 1)

        const byteCharacters = atob(base64Data)

        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteNumbers.length; i++) {

            byteNumbers[i] = byteCharacters.charCodeAt(i)

        }

        const byteArray = new Uint8Array(byteNumbers)

        const blob = new Blob([byteArray], { type: mimeType })

        return blob

    }

    /**
     * Clears all data from local storage.
     */
    static deleteLocalStorageData() { this.#localStorage.clearStorage() }

    /**
     * Initializes the VersionControl class by pulling data from either local storage or the cloud.
     * 
     * @param {Object} localStorage - The local storage instance used for saving data locally.
     * @param {Object} database - The database instance used for saving and retrieving data from the cloud.
     * @returns {Promise<Object>} - Returns the profile and link data.
     */
    static async intialize(localStorage, database) {

        this.#localStorage = localStorage

        this.#database = database

        try {

            const naiveUser = Session.getIdFromUrlHash()

            const localData = this.pullFromLocal()

            const cloudData = naiveUser ? await this.#pullFromCloud(naiveUser) : await this.#pullFromCloud()

            if (!Session.isLoggedIn() && naiveUser.length > 0) {

                return cloudData

            } else if (Session.isLoggedIn() && localData) {

                console.log('User logged in. Fetching from local storage.')

                this.#syncWithCloud(localData) // DEV: dont wait for the sync to fetch from local. if local needs to updated, reload the page from inside syncWithCloud

                return localData

            } else if (Session.isLoggedIn() && cloudData) {

                console.log('User logged in. Fetching from cloud and pushing to local.')
                
                this.#pushToLocal(cloudData)

                return cloudData

            } else if (localData) {

                console.log('User logged out. Fetching from local storage.')

                return localData

            } else {

                console.log('New user. Creating new instance')

                return {}

            }

        } catch (error) { console.error("Error in Initialize: ", error.message) }

    }

    /**
     * Retrieves profile and link data from the cloud database for the given user.
     * 
     * @param {string|null} id - The user ID to pull data for, defaults to the current user's ID.
     * @returns {Promise<Object|null>} - Returns the profile and link data for the user.
     * @private
     */
    static async #pullFromCloud(id = null) {

        try {

            const userId = id ?? Session.getUser().id 
            
            if (!userId) throw new Error('Failed to fetch user id.') 

            let data = { profile: await this.#database.getProfileData(userId) } // Fetch profile data for the user (object)

            if (!data) throw new Error('Failure to fetch profile data.')
            
            const profileImageUrl = await this.#database.getImageUrl(userId)

            if (profileImageUrl) data.profile.imageString = profileImageUrl
            
            data.profile.linkArray = []
            
            const links = await this.#database.getLinkData(userId) // Fetch all links associated with the user (array)
        
            if (!Array.isArray(links)) throw new Error('Failure to fetch links.')
        
            links.forEach(link => data.profile.linkArray.push(link))

            data.profile.linkArray.sort((a, b) => a.order - b.order)

            return data

        } catch (error) { 
            
            console.error('Error in pullFromCloud: ', error.message) 
        
            return null

        }

    }

    /**
     * Retrieves data from local storage.
     * 
     * @returns {Object|null} - Returns the local profile and link data if it exists, otherwise `null`.
     */
    static pullFromLocal() { 

        const local = this.#localStorage.retrieveStorageData()

        if (Object.keys(local).length > 0) {
        
            local["link-share"].profile.linkArray.sort((a, b) => a.order - b.order)

            return local["link-share"]
        
        } else if (Object.keys(local).length > 0) {

            console.log('Invalid data. Clearing local storage.') // DEV: tidy console log

            this.#localStorage.clearStorage()

        } else return null
    
    }

    /**
     * Pushes an image to the cloud by converting it from Base64 to Blob format.
     * 
     * @param {string} image - The Base64 encoded image string.
     * @returns {Promise<void>}
     */
    static async pushImageToCloud(image) {

        const blob = this.#convertBase64ToBlob(image)

        const filePath = `${Session.getUser().id}`

        this.#database.setProfileImage(filePath, blob)

    }

    /**
     * Pushes profile and link data to the cloud database.
     * 
     * @param {Object} data - The profile and link data to push to the cloud.
     * @returns {Promise<void>}
     * @private
     */
    static async #pushToCloud(data) {

        try {

            this.#database.setProfileData(data.profile)

            let linkArray = data.profile.linkArray.map(link => {

                return {

                    profile_id: Session.getUser().id,
                    id: link.linkId,
                    url: link.linkUrl,
                    last_updated: link.last_updated,
                    platform_data: link.platformData,
                    order: link.order

                }

            })

            this.#database.setLinkData(linkArray)

        } catch (error) { console.error("Error in pushToCloud: ", error.message) }

    }

    /**
     * Saves profile and link data to local storage.
     * 
     * @param {Object} data - The profile and link data to save locally.
     * @private
     */
    static #pushToLocal(data) { this.#localStorage.setItem('link-share', data) }

    /**
     * Saves the profile and link data, ensuring that local and cloud data are synchronized.
     * Deletes any links from the cloud that are no longer present locally.
     * 
     * @param {Object} data - The profile and link data to save.
     * @returns {Promise<void>}
     */
    static async save(data) {

        try {
            
            this.#pushToLocal({profile: data})

            const cloud = await this.#pullFromCloud()

            const cloudLinks = cloud.profile.linkArray

            let localLinks = data.linkArray

            const linksToDelete = cloudLinks
                .filter(cloudLink => !localLinks.some(localLink => localLink.linkId === cloudLink.linkId))

            localLinks = localLinks
                .filter(localLink => !linksToDelete.some(deleteLink => deleteLink.linkId === localLink.linkId))
                .map(link => {

                    return {

                        profile_id: Session.getUser().id,
                        id: link.linkId,
                        url: link.linkUrl,
                        last_updated: link.last_updated,
                        platform_data: link.platformData,
                        order: link.order

                    }

                })

            this.#database.setProfileData(data)

            this.#database.setLinkData(localLinks)

            this.#database.deleteLinkData(linksToDelete.map(e => e.linkId), Session.getUser().id)

        } catch (error) {
            
            console.error("Error in save: ", error.message)

        }

    }

    /**
     * Synchronizes local data with the cloud by comparing timestamps and updating accordingly.
     * 
     * @param {Object} local - The local profile and link data.
     * @returns {Promise<void>}
     * @private
     */
    static async #syncWithCloud(local) {

        const cloud = await this.#pullFromCloud().catch(error => console.error("Error in syncWithCloud: ", error.message))

        if (!cloud) this.#pushToCloud(local).catch(e => console.log('failed to push to cloud'))

        const localLastUpdateTime = new Date(local.profile.last_updated).getTime()

        const cloudLastUpdateTime = new Date(cloud.profile.last_updated).getTime()

        if (localLastUpdateTime > cloudLastUpdateTime) {

            console.log("Local contains most recent")

            this.#pushToCloud(local).catch(e => console.log('failed to push to cloud'))

        } else if (localLastUpdateTime < cloudLastUpdateTime) {

            console.log("Cloud contains most recent")

            this.#pushToLocal(cloud)

            document.location.reload()

        } else console.log("Local and cloud in sync")

    }

}