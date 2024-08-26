import { LocalStorage } from "./LocalStorage.js"
import { Renderer } from "./Renderer.js"
import { Link } from './Link.js'

export class Profile {

    firstName
    lastName
    email
    url
    imageString
    linkArray = []

    constructor(data = {}) {

        this.firstName = data.firstName ?? null

        this.lastName = data.lastName ?? null

        this.email = data.email ?? null

        this.url = data.url ?? null

        this.imageString = data.imageString ?? null

        if (Object.keys(data).length > 0) data.linkArray.forEach(link => {

            link.platformData.urlPattern = new RegExp(link.platformData.urlPattern.slice(1, -1)) 

            this.addLink(new Link(link))

        })

        Renderer.render(this, 'profile')
        
        document.addEventListener('linkDeleted', (e) => { this.removeLink(e.detail.link) })

        document.addEventListener('linkCreated', (e) => { this.addLink(e.detail.link) })

        document.addEventListener('profilePageSaved', (e) => { this.updateFields(e) })

    } 

    getLink(index) { return this.linkArray[index] }

    addLink(link) { 

        this.linkArray.push(link)

        this.saveProfile()

    } 

    removeLink(link) { 

        Link.validId.unshift(link.linkId)

        this.linkArray = this.linkArray.filter(obj => obj.linkId !== link.linkId)
        
        this.saveProfile()
    
    }
    saveProfile() { 
        
        const localStorage = new LocalStorage('link-app')

        this.linkArray.forEach(link => link.platformData.urlPattern = link.platformData.urlPattern.toString())

        localStorage.setItem('profile', this) 
    
    }

    updateFields(event) {

        this.firstName = event.detail.firstName

        this.lastName = event.detail.lastName

        this.email = event.detail.email

        this.imageString = event.detail.imageString

        this.saveProfile()

    }

}