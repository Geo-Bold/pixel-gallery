import { Renderer } from './Renderer.js'

export class Link {
    
    linkId
    linkUrl
    userId
    platformData
    static validId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

    constructor(linkInputData) {

        if (linkInputData.linkId) {

            this.linkId = linkInputData.linkId
            
            const index = Link.validId.splice(Link.validId.indexOf(linkInputData.linkId), 1) // Removes the existing id from the validId pool

        } else this.linkId = Link.validId.shift()

        this.linkUrl = linkInputData.linkUrl ?? null

        this.userId = linkInputData.userId ?? null

        this.platformData = linkInputData.platformData ?? Renderer.renderInfo.platformData[0]

        if (this.linkId < 15) Renderer.render(this, 'link')

        document.addEventListener('linkPageSaved', (e) => { console.log('link saved') })

    }

    setPlatformData(title, icon) { this.platformData = { title: title, icon: icon } }

}