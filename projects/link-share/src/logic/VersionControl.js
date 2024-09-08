import { Session } from "./Session.js"

export class VersionControl {

    static #database
    static #localStorage

    static async intialize(localStorage, database) {

        this.#localStorage = localStorage

        this.#database = database

        try {

            const localData = this.pullFromLocal()

            const cloudData = await this.#pullFromCloud()

            if (Session.isLoggedIn() && localData) {

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

    static async #pullFromCloud() {

        try {

            const userId = Session.getUser().id 
            
            if (!userId) throw new Error('Failed to fetch user id.') 

            let data = { profile: await this.#database.getProfileData(userId) } // Fetch profile data for the user (object)

            if (!data) throw new Error('Failure to fetch profile data.')
            
            const profileImageUrl = await this.#database.getImageUrl(userId)

            if (profileImageUrl) data.profile.imageString = profileImageUrl
            
            data.profile.linkArray = []
            
            const links = await this.#database.getLinkData(userId) // Fetch all links associated with the user (array)
        
            if (!Array.isArray(links)) throw new Error('Failure to fetch links.')
        
            links.forEach(link => data.profile.linkArray.push(link))

            return data

        } catch (error) { 
            
            console.error('Error in pullFromCloud: ', error.message) 
        
            return null

        }

    }

    static async #pushToCloud(data) {

        try {

            this.#database.setProfileData(data)

            let linkArray = data.linkArray.map(link => {

                return {

                    profile_id: Session.getUser().id,
                    id: link.linkId,
                    url: link.linkUrl,
                    last_updated: link.last_updated,
                    platform_data: link.platformData

                }

            })

            this.#database.setLinkData(linkArray)

        } catch (error) { console.error("Error in pushToCloud: ", error.message) }

    }

    static pullFromLocal() { 

        const local = this.#localStorage.retrieveStorageData()

        if (Object.keys(local).length > 0 && this.#validate(local)) return local["link-share"] // DEV: requires development of validation
        else if (Object.keys(local).length > 0) {

            console.log('Invalid data. Clearing local storage.') // DEV: tidy console log

            this.#localStorage.clearStorage()

        } else return null
    
    }

    static #pushToLocal(data) { this.#localStorage.setItem('link-share', data) }

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
                        platform_data: link.platformData

                    }

                })

            this.#database.setProfileData(data)

            this.#database.setLinkData(localLinks)

            this.#database.deleteLinkData(linksToDelete.map(e => e.linkId), Session.getUser().id)

        } catch (error) {
            
            console.error("Error in save: ", error.message)

        }

    }

    /* DEV: Returns true if the data is in a valid form.  */

    static #validate(data) { return true}

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

    static async pushImageToCloud(image) {

        const blob = this.#convertBase64ToBlob(image)

        const filePath = `${Session.getUser().id}`

        this.#database.setProfileImage(filePath, blob)

    }

    static deleteLocalStorageData() { this.#localStorage.clearStorage() }

}