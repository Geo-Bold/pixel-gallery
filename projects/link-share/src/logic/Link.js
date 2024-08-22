import { LinkRenderer } from './LinkRenderer.js'

export class Link {
    
    linkId
    linkUrl
    userId
    platformData
    static validId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

    constructor(linkInputData) {

        this.linkId = linkInputData.linkId ?? Link.validId.shift()

        this.linkUrl = linkInputData.linkUrl ?? null

        this.userId = linkInputData.userId ?? null

        this.platformData = linkInputData.platformData ?? LinkRenderer.renderInfo.platformData[0]

        if (this.linkId < 15) LinkRenderer.render(this)

    }

    setPlatformData(title, icon) { this.platformData = { title: title, icon: icon } }
    
}