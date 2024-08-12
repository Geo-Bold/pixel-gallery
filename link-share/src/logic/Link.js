import { LinkRenderer } from './LinkRenderer.js'

export class Link {
    
    #id
    #platform
    #url
    #userId
    #profile
    static #validId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    constructor(userId, linkBody, profile) {

        this.#userId = userId ?? "anon"

        this.#id = Link.#validId.shift()

        this.#platform = LinkRenderer.platformData[0]

        this.#url = null

        this.#profile = profile

        if (this.#id < 15) LinkRenderer.render(this, linkBody, profile)

    }

    getId() { return this.#id }

    getPlatform() { return this.#platform }

    setPlatform(e) { this.#platform = e }
    
    setUrl() {  }

    destroy() { 

        Link.#validId.unshift(this.#id)
        
        this.#profile.removeLink(this) // Method to delete the calling link object

     }

}