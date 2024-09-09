import { Session } from "./Session.js"
/**
 * The `Database` class provides methods for interacting with a Supabase database.
 * It includes methods for CRUD operations on profile data, link data, and profile images.
 * This class relies on the `Session` class to obtain a client connection.
 */
export class Database {

    #client
    /**
    * Constructs a new `Database` instance and initializes the Supabase client.
    */
    constructor() { this.#client = Session.getClient() }
    
    /**
    * Deletes the image associated with the specified profile by setting the `image_string` field to `null`.
    *
    * @async
    * @param {string|number} profileId - The unique identifier of the profile whose image will be deleted.
    * @returns {Promise<Object|null>} - The updated profile data if successful, or `null` if an error occurs.
    * @throws {Error} - If an error occurs while deleting the image, it is logged to the console.
    */ 
    async deleteImage(profileId) {

        try {
            
            const { data, error } = await this.#client.from('profiles').update({ image_string: null }).eq('id', profileId)

            if (error) throw new Error(error.message)
    
            return data

        } catch (error) { console.error('Error in deleteImage: ', error.message) }

    }
    /**
    * Deletes multiple links associated with the specified profile ID.
    *
    * @async
    * @param {Array<string|number>} linkArray - An array of link IDs to be deleted.
    * @param {string|number} profileId - The profile ID to which the links are associated.
    * @returns {Promise<Object|null>} - The deleted links data if successful, or `null` if an error occurs.
    * @throws {Error} - If an error occurs while deleting the links, it is logged to the console.
    */
    async deleteLinkData(linkArray, profileId) {

        try {
            
            const { data, error } = await this.#client
                .from('links')
                .delete()
                .in('id', linkArray)
                .eq('profile_id', profileId)

            if (error) throw new Error(error.message)

            return data

        } catch (error) { console.error('Error in deleteLinkData: ', error.message) }

    }
    /**
     * Retrieves the public URL of the profile image based on the profile ID.
     *
     * @async
     * @param {string|number} profileId - The unique identifier of the profile whose image URL is being retrieved.
     * @returns {Promise<string|null>} - The public URL of the profile image if successful, or `null` if an error occurs.
     * @throws {Error} - If an error occurs while retrieving the image URL, it is logged to the console.
     */
    async getImageUrl(profileId) {

        try {
            
            const { data, error } = await this.#client.storage
                .from('profile-images')
                .getPublicUrl(`${profileId}`)

            if (error) throw new Error(error.message)

            return data.publicUrl

        } catch (error) { console.error('Error in getImageUrl: ', error.message) }

    }
    /**
     * Retrieves the link data associated with the specified profile ID.
     *
     * @async
     * @param {string|number} profileId - The profile ID to which the links are associated.
     * @returns {Promise<Array<Object>>|null} - An array of link objects containing link details, or `null` if an error occurs.
     * @throws {Error} - If an error occurs while retrieving link data, it is logged to the console.
     */
    async getLinkData(profileId) {

        try {
            
            const { data, error } = await this.#client
                .from('links')
                .select('*')
                .eq('profile_id', profileId)
        
            if (error) throw new Error(error.message)

            return data.map(link => ({

                id: link.profile_id,
                linkId: link.id,
                linkUrl: link.url,
                platformData: link.platform_data,
                last_updated: link.last_updated,
                order: link.order

            }))

        } catch (error) { console.error('Error in getLinkData: ', error.message) }

    }
    /**
     * Retrieves profile data for the specified profile ID.
     *
     * @async
     * @param {string|number} profileId - The unique identifier of the profile whose data is being retrieved.
     * @returns {Promise<Object|null>} - An object containing profile details, or `null` if an error occurs.
     * @throws {Error} - If an error occurs while retrieving profile data, it is logged to the console.
     */
    async getProfileData(profileId) {

        try {
            
            const { data, error } = await this.#client.from('profiles').select('*').eq('id', profileId).single()
    
            if (error) throw new Error(error.message)

            return {

                id: data.id,
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
                last_updated: data.last_updated,

            }

        } catch (error) { console.error('Error in getProfileData: ', error.message) }

    }
    /**
     * Inserts or updates link data in the database.
     *
     * @async
     * @param {Array<Object>} links - An array of link objects to be upserted.
     * @returns {Promise<Object|null>} - The upserted link data if successful, or `null` if an error occurs.
     * @throws {Error} - If an error occurs during the upsert, it is logged to the console.
     */
    async setLinkData(links) {

        try {
            
            const { data, error } = await this.#client
                .from('links')
                .upsert(links)

            if (error) throw new Error(error.message)

            return data

        } catch (error) { console.error('Error in setLinkData: ', error) }

    }
    /**
     * Inserts or updates profile data in the database.
     *
     * @async
     * @param {Object} profile - The profile data to be upserted, including first name, last name, email, and last updated fields.
     * @returns {Promise<Object|null>} - The upserted profile data if successful, or `null` if an error occurs.
     * @throws {Error} - If an error occurs during the upsert, it is logged to the console.
     */
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

            if (error) throw new Error(error.message)
        
            return data

        } catch (error) { console.error('Error in setProfileData: ', err.message) }

      }
    /**
     * Uploads a new profile image to the storage.
     *
     * @async
     * @param {string} filePath - The file path where the image should be uploaded.
     * @param {Blob} blob - The image data as a blob.
     * @returns {Promise<Object|null>} - The uploaded image data if successful, or `null` if an error occurs.
     * @throws {Error} - If an error occurs while uploading the image, it is logged to the console.
     */
    async setProfileImage(filePath, blob) {

        try {
            
            const { data, error } = await this.#client.storage
                .from('profile-images')
                .upload(filePath, blob, { upsert: true, contentType: blob.type })
        
                if (error) throw new Error(error.message)
        
            return data

        } catch (error) { console.error('Error in setLinkData: ', error) }

    }
    
}
