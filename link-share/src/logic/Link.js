import { LinkRenderer } from './LinkRenderer.js'

export class Link {
    
    #id
    #platformData
    #iconPath
    #url
    #userId
    #profile
    linkInputData
    static #validId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

    constructor(linkInputData) {

        this.linkInputData = linkInputData

        this.#userId = linkInputData.userId ?? "anon"

        this.#id = Link.#validId.shift()

        this.#platformData = linkInputData.platformData[0]

        this.#profile = linkInputData.profile

        if (this.#id < 15) LinkRenderer.render(this, linkInputData)

    }

    getId() { return this.#id }

    getPlatformData() { return this.#platformData }

    setPlatformData(title, icon) { this.#platformData = { title: title, icon: icon } }
    
    getUrl() {  }
    
    setUrl(inputUrl) { 
        
        this.linkInputData.forEach(platform => {

            if (platform.urlPattern.test(inputUrl)) {

                this.#url = inputUrl

                this.store()

            }
            
            else {  } // Error handling required

        })
    
    }

    store() {

        

    }

    destroy() { 

        Link.#validId.unshift(this.#id) // Recycles the valid id
        
        this.#profile.removeLink(this) // Removes the link from the profile linkArray

     }

}