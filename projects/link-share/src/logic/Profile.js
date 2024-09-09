import { VersionControl } from "./VersionControl.js"
import { Renderer } from "./Renderer.js"
import { Link } from './Link.js'
import { Session } from "./Session.js"

/**
 * The `Profile` class manages user profile data, including links, personal details, and event listeners for profile actions.
 * It interacts with the `Session`, `Renderer`, `VersionControl`, and `Link` classes to handle profile creation, updates, and storage.
 */
export class Profile {

    id
    firstName
    lastName
    email
    imageString
    last_updated
    linkArray = []

    /**
     * Constructs a new `Profile` instance with the provided data or an empty object by default.
     * If data is provided, it initializes the profile and reconstructs the link array.
     * Adds event listeners for creating, deleting, saving, and updating the profile.
     * 
     * @param {Object} [data={}] - The data used to initialize the profile.
     * @param {string} [data.firstName] - The user's first name.
     * @param {string} [data.lastName] - The user's last name.
     * @param {string} [data.email] - The user's email address.
     * @param {string} [data.url] - The user's profile URL.
     * @param {string} [data.imageString] - The string representing the user's profile image.
     * @param {string} [data.last_updated] - The timestamp when the profile was last updated.
     * @param {Array<Object>} [data.linkArray] - An array of link objects associated with the profile.
     */
    constructor(data = {}) {

        if (Session.isLoggedIn()) this.id = Session.getUser().id 
        
        else this.id = null

        this.firstName = data.firstName ?? null

        this.lastName = data.lastName ?? null

        this.email = data.email ?? null

        this.url = data.url ?? null

        this.imageString = data.imageString ?? null

        this.last_updated = data.last_updated ?? new Date().toISOString()

        // Reconstruct the link array if data is provided
        if (Object.keys(data).length > 0) {

            const reconstructedLinkArray = data.linkArray.reduce((accumulator, link) => {

                accumulator.push(new Link(link))
        
                return accumulator

            }, [])

            this.linkArray = [...reconstructedLinkArray]
        
        }

        // Event listeners for profile actions
        Renderer.render(this, 'profile')

        document.addEventListener('linkCreated', e => this.addLink(e.detail))
        
        document.addEventListener('linkDeleted', e => this.removeLink(e.detail))

        document.addEventListener('profilePageSaved', e => this.updateFields(e.detail))

        document.addEventListener('updateStorage', e => this.saveProfile())

    } 

    /**
     * Adds a link or multiple links to the profile's link array, ensuring no duplicate links.
     * 
     * @param {Object|Array<Object>} links - The link object or array of link objects to add.
     */
    addLink(links) { 

        if (Array.isArray(links)) links.forEach( link => { if (this.#linkIsUnique(link)) this.linkArray.push(link) })

        if (this.#linkIsUnique(links)) this.linkArray.push(links)

    } 

    /**
     * Retrieves a link from the profile's link array based on the index.
     * 
     * @param {number} index - The index of the link to retrieve.
     * @returns {Object} - The link object at the specified index.
     */
    getLink(index) { return this.linkArray[index] }

    /**
     * Checks if a link is unique by ensuring no other link in the array shares the same `linkId`.
     * 
     * @param {Object} link - The link object to check for uniqueness.
     * @returns {boolean} - Returns `true` if the link is unique, `false` otherwise.
     * @private
     */
    #linkIsUnique(link) {

        if (this.linkArray.some(existingLink => existingLink.linkId === link.linkId)) return false

        else return true
    
    }

    /**
     * Removes a link from the profile's link array based on its `linkId`.
     * 
     * @param {Object} link - The link object to remove from the array.
     */
    removeLink(link) { 

        this.linkArray = this.linkArray.filter(obj => obj.linkId !== link.linkId)

    }

    /**
     * Saves the current profile data and updates the last updated timestamp.
     * Uses `VersionControl` to save the profile.
     */
    saveProfile() { 

        this.last_updated = new Date().toISOString()

        VersionControl.save(this) 
    
    }

    /**
     * Updates the profile fields with new data and saves the profile.
     * 
     * @param {Object} data - The updated profile data.
     * @param {string} data.firstName - The updated first name.
     * @param {string} data.lastName - The updated last name.
     * @param {string} data.email - The updated email address.
     * @param {string} [data.imageString] - The updated profile image string.
     */
    updateFields(data) {

        this.firstName = data.firstName

        this.lastName = data.lastName

        this.email = data.email

        this.imageString = data.imageString ?? null

        this.saveProfile()

    }

}