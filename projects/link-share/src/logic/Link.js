import { Renderer } from './Renderer.js'
import { Session } from './Session.js'

export class Link {
    
    id
    order
    linkId
    linkUrl
    platformData
    last_updated
    static validId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

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

    setPlatformData(title, icon, pattern) { this.platformData = { title: title, icon: icon, urlPattern: pattern } }

}