import { Session } from "./Session.js"

export class Database {

    static #client = Session.getClient()
  
    static async getProfileData(profileId) {

        const { data, error } = await this.#client.from('profiles').select('*').eq('id', profileId).single()
    
        if (error) {

            console.error('Error fetching profile data:', error)

            return null

        }
    
        return data

    }

    static async getLinkData(profileId) {

        const { data, error } = await this.#client.from('links').select('*').eq('user_id', profileId)
    
        if (error) {

            console.error('Error fetching link data:', error)

            return []

        }
    
        return data

    }
  
    static async setProfileData(profile) {

        const { data, error } = await this.#client.from('profiles').upsert(profile)

    
        if (error) {

            console.error('Error setting profile data:', error)

            return

        }
    
        return data

    }

    static async setLinkData(links) {

        const { data, error } = await this.#client.from('links').upsert(links)

    
        if (error) {

            console.error('Error setting link data:', error)

            return

        }
    
        return data

    }

    static async setImage(profileId, imageString) {
        
        const { data, error } = await this.#client.from('profiles').update({ image_string: imageString }).eq('id', profileId)
    
        if (error) {

            console.error('Error setting image:', error)

            return

        }
    
        return data

    }
 
    static async getImage(profileId) {

        const { data, error } = await this.#client.from('profiles').select('image_string').eq('id', profileId).single()
    
        if (error) {

            console.error('Error getting image:', error)

            return null

        }
    
        return data.image_string

    }

    static async deleteImage(profileId) {

        const { data, error } = await this.#client.from('profiles').update({ image_string: null }).eq('id', profileId)
    
        if (error) {

            console.error('Error deleting image:', error)

            return

        }
    
        return data

    }
    
}
