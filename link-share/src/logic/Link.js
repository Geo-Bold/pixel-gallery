import { LinkRenderer } from './LinkRenderer.js'

export class Link {
    
    id
    url
    userId
    platformData
    static validId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

    constructor(linkInputData) {

        this.id = linkInputData.linkId ?? Link.validId.shift()

        this.url = linkInputData.linkUrl ?? undefined

        this.userId = linkInputData.profile.userId ?? 'anon'

        this.platformData = linkInputData.linkPlatformData ?? linkInputData.platformData[0]

        if (this.id < 15) LinkRenderer.render(this, linkInputData)

    }

    getId() { return this.id }

    getPlatformData() { return this.platformData }

    setPlatformData(title, icon) { this.platformData = { title: title, icon: icon } }
    
    getUrl() {  }
    
    validateUrl(userInputUrl, linkInputData, profile) { 
        
        linkInputData.forEach(platform => {

            if (platform.urlPattern.test(userInputUrl)) {

                this.url = userInputUrl

                profile.setLink(this.url)

                return true

            }
            
        })
    
    }

    destroy(profile) { 

        Link.validId.unshift(this.id) // Recycles the valid id
        
        profile.removeLink(this) // Removes the link from the profile linkArray

     }

}