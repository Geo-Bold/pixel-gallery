import { Session } from "./Session.js"

export class Database {

    #client

    constructor() { this.#client = Session.getClient() }
  
    async deleteImage(profileId) {

        const { data, error } = await this.#client.from('profiles').update({ image_string: null }).eq('id', profileId)
    
        if (error) {

            console.error('Error deleting image:', error)

            return

        }
    
        return data

    }

    async getImageUrl(profileId) {

        const { data, error } = await this.#client.storage
            .from('profile-images')
            .getPublicUrl(`${profileId}`)

        if (error) console.log('Error getting image url: ', error)

        return data.publicUrl

    }

    async getLinkData(profileId) {

        const { data, error } = await this.#client
            .from('links')
            .select('*')
            .eq('profile_id', profileId)
    
        if (error) {

            console.error('Unable to fetch link data:', error)

            return null

        } else {

            return data.map(link => ({

                id: link.profile_id,
                linkId: link.id,
                linkUrl: link.url,
                platformData: link.platform_data,
                last_updated: link.last_updated

            }))

        }
    
    }

    async deleteLinkData(linkArray, profileId) {

        const { data, error } = await this.#client
            .from('links')
            .delete()
            .in('id', linkArray)
            .eq('profile_id', profileId)

        if (error) {

            console.error('Unable to delete link:', error)

            return null

        }

        console.log('Link deleted successfully:', data)

        return data  // Return the deleted data, if needed

        

    }

    async getProfileData(profileId) {

        try {
            
            const { data, error } = await this.#client.from('profiles').select('*').eq('id', profileId).single()
    
            if (error) throw new Error('Unable to fetch profile data:', error.message) 

            return {

                id: data.id,
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
                last_updated: data.last_updated,

            }

        } catch (error) {
            
            console.error('Error in getProfileData: ', error.message) 
        
            return null

        }

    }

    async setProfileData(profile) {

        try {

            const { data, error } = await this.#client
                .from('profiles')
                .upsert({
                    
                    id: Session.getUser().id,
                    first_name: profile.firstName,
                    last_name: profile.lastName,
                    email: profile.email,
                    last_updated: profile.last_updated
                
                })
        
            if (error) throw new Error('Unable to set profile data: ', error.message)
        
            return data

        } catch (err) {

            console.error('Error in setProfileData: ', err.message)

            return null

        }

      }

    async setLinkData(links) {

        const { data, error } = await this.#client
            .from('links')
            .upsert(links)

    
        if (error) {

            console.error('Error setting link data:', error)

            return

        }
    
        return data

    }

    async setProfileImage(filePath, blob) {

        const { data, error } = await this.#client.storage
            .from('profile-images')
            .upload(filePath, blob, { upsert: true, contentType: blob.type })
    
        if (error) {

            console.error('Error in setImage: ', error)

            return

        }
    
        return data

    }
    
}
