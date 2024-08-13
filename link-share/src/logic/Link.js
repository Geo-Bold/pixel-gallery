import { LinkRenderer } from './LinkRenderer.js'

export class Link {
    
    #id
    #platform
    #iconPath
    #url
    #userId
    #profile
    static #validId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    constructor(userId, profile, linkBody, previewBody) {

        this.#userId = userId ?? "anon"

        this.#id = Link.#validId.shift()

        this.#platform = LinkRenderer.platformOptions[0]

        this.#iconPath = LinkRenderer.platformData[0]

        this.#profile = profile

        if (this.#id < 15) LinkRenderer.render(this, linkBody, previewBody)

    }

    getId() { return this.#id }

    getPlatform() { return this.#platform }

    getIconPath() { return this.#iconPath }

    setIconPath(path) { this.#iconPath = path } 

    setPlatform(platform) { this.#platform = platform }
    
    setUrl() {  }

    destroy() { 

        Link.#validId.unshift(this.#id)
        
        this.#profile.removeLink(this) // Method to delete the calling link object

     }

}