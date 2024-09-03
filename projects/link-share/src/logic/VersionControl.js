import { Session } from "./Session.js"

export class VersionControl {

    static #database
    static #localStorage

    static async intialize(localStorage, database) {

        this.#localStorage = localStorage

        this.#database = database

        try {

            const localData = this.#pullFromLocal()

            if (Session.isLoggedIn() && localData) {

                console.log('User logged in. Fetching from local storage.')

                const data = await this.#syncWithCloud(localData)

                return data

            } else if (Session.isLoggedIn()) {

                console.log('User logged in. Fetching from cloud and pushing to local.')
                
                const cloudData = await this.#pullFromCloud()

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

            return local

        } else if (localLastUpdateTime < cloudLastUpdateTime) {

            console.log("Cloud contains most recent")

            this.#pushToLocal(cloud)

            return cloud

        } else {

            console.log("Local and cloud in sync")

            return local

        }

    }

    static getLocalData() {  }

    static getCloudData() {  }

    static async #pullFromCloud() {

        try {

            const userId = Session.getUser().id 
            
            if (!userId) throw new Error('Failed to fetch user id.') 

            let data = { profile: await this.#database.getProfileData(userId) } // Fetch profile data for the user (object)

            if (!data) throw new Error('Failure to fetch profile data.')
            
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

    static async #pushToCloud(profile) {

        try {

            await this.#database.setProfileData(profile)

            let linkArray = profile.linkArray.map(link => {

                return {

                    user_id: Session.getUser().id,
                    id: link.linkId,
                    url: link.linkUrl,
                    last_updated: link.last_updated,
                    platform_data: link.platformData

                }

            })

            await this.#database.setLinkData(linkArray)

        } catch (error) { console.error("Error in pushToCloud: ", error.message) }

    }

    static #pullFromLocal() { 

        const local = this.#localStorage.retrieveStorageData()

        if (Object.keys(local).length > 0 && this.#validate(local)) return local.profile // DEV: requires development of validation
        else if (Object.keys(local).length > 0) {

            console.log('Invalid data. Clearing local storage.') // DEV: tidy console log

            this.#localStorage.clearStorage()

        } else return null
    
    }

    static #pushToLocal(data) { this.#localStorage.setItem('link-share', data) }

    static save(data) {
console.log(data)
        this.#localStorage.setItem(data)

        this.#pushToCloud(data)
            .then(e => console.log('successfully pushed to cloud'))
            .catch(e => console.log('failed to push to cloud'))

    }

    /* Returns true if the data is in a valid form.  */

    static #validate(data) {
        // // Check if all required fields are present
        // localData.profile.id === Session.getUser().id // Check if id's match

        // if (!data || typeof data !== 'object') return false;
        // if (!data.id || typeof data.id !== 'string') return false;
        // if (!data.firstName || typeof data.firstName !== 'string') return false;
        // if (!data.lastName || typeof data.lastName !== 'string') return false;
        // if (!data.email || !this.isValidEmail(data.email)) return false; // Check if email is valid
        // if (!data.updatedAt || !this.isValidISODate(data.updatedAt)) return false; // Check if date is valid
    
        // // Additional integrity checks (example: version number must be positive integer)
        // if (data.version && (!Number.isInteger(data.version) || data.version <= 0)) return false;
    
        // // All checks passed, data is not corrupted
        return true;
      }

}