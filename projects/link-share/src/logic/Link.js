import { Renderer } from './Renderer.js'
import { Session } from './Session.js'
/**
 * The `Link` class represents a link object and handles the initialization of link data,
 * manages link order, and validates available link IDs.
 * It interacts with the `Session` and `Renderer` classes for user-specific data and rendering.
 */
export class Link {
    
    id
    order
    linkId
    linkUrl
    platformData
    last_updated
    static validId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

    /**
     * Constructs a new `Link` object.
     * If `linkId` is provided in the input data, it sets the `linkId` and removes it from the available `validId` pool.
     * Otherwise, it assigns the next available ID from the `validId` array.
     *
     * @param {Object} linkInputData - An object containing data to initialize the link.
     * @param {number} [linkInputData.linkId] - The ID of the link.
     * @param {number} [linkInputData.order] - The order of the link; if not provided, defaults to `linkId - 1`.
     * @param {string} [linkInputData.linkUrl] - The URL of the link.
     * @param {Object} [linkInputData.platformData] - The platform-specific data associated with the link.
     * @param {string} [linkInputData.last_updated] - The timestamp when the link was last updated; defaults to the current date/time.
     * 
     * @throws {Error} - If a link with an invalid or unavailable `linkId` is created.
     */
    constructor(linkInputData) {

        if (linkInputData.linkId) {

            this.linkId = linkInputData.linkId

            this.order = linkInputData.order ? linkInputData.order : linkInputData.linkId - 1
            
            Link.validId.splice(Link.validId.indexOf(linkInputData.linkId), 1) // Removes the existing id from the validId pool

        } else this.linkId = Link.validId.shift()

        this.id = Session.isLoggedIn() ? Session.getUser().id : null

        this.last_updated = linkInputData.last_updated ?? new Date().toISOString()

        this.linkUrl = linkInputData.linkUrl ?? null

        this.platformData = linkInputData.platformData ?? Renderer.context.platformData[0]

        if (this.linkId < 15) Renderer.render(this, 'link')

        Renderer.linkArray.push(this)

    }
    /**
    * Sets the platform-specific data for the link, including title, icon, and URL pattern.
    *
    * @param {string} title - The title of the platform.
    * @param {string} icon - The icon representing the platform.
    * @param {string} pattern - The URL pattern associated with the platform.
    */
    setPlatformData(title, icon, pattern) { this.platformData = { title: title, icon: icon, urlPattern: pattern } }

}