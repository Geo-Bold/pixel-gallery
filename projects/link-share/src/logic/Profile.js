import { VersionControl } from "./VersionControl.js"
import { Renderer } from "./Renderer.js"
import { Link } from './Link.js'

export class Profile {

    id
    firstName
    lastName
    email
    imageString
    last_updated
    linkArray = []

    constructor(data = {}) {

        this.id = data.id

        this.firstName = data.firstName ?? null

        this.lastName = data.lastName ?? null

        this.email = data.email ?? null

        this.url = data.url ?? null

        this.imageString = data.imageString ?? null

        this.last_updated = data.last_updated ?? new Date().toISOString()

        if (Object.keys(data).length > 0) {

            const reconstructedLinkArray = data.linkArray.reduce((accumulator, link) => {

                accumulator.push(new Link(link))
        
                return accumulator

            }, [])

            this.linkArray = [...reconstructedLinkArray]
        
        }

        Renderer.render(this, 'profile')

        document.addEventListener('linkCreated', e => this.addLink(e.detail))
        
        document.addEventListener('linkDeleted', e => this.removeLink(e.detail))

        document.addEventListener('profilePageSaved', e => this.updateFields(e.detail))

        document.addEventListener('updateStorage', e => this.saveProfile())

    } 

    getLink(index) { return this.linkArray[index] }

    addLink(links) { 

        if (Array.isArray(links)) links.forEach( link => { if (this.#linkIsUnique(link)) this.linkArray.push(link) })

        if (this.#linkIsUnique(links)) this.linkArray.push(links)

        // this.saveProfile()

    } 

    removeLink(link) { 

        Link.validId.unshift(link.linkId)

        this.linkArray = this.linkArray.filter(obj => obj.linkId !== link.linkId)
        
        this.saveProfile()
    
    }
    saveProfile() { 

        this.linkArray.forEach(link => link.platformData.urlPattern = link.platformData.urlPattern.toString())

        this.last_updated = new Date().toISOString()

        VersionControl.save(this) 
    
    }

    updateFields(data) {

        this.firstName = data.firstName

        this.lastName = data.lastName

        this.email = data.email

        this.imageString = data.imageString ?? null

        this.saveProfile()

    }

    #linkIsUnique(link) {

        if (this.linkArray.some(existingLink => existingLink.linkId === link.linkId)) return false

        else return true
    
    }

}