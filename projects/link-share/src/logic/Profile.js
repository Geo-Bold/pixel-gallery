import { LocalStorage } from "./LocalStorage.js"
import { Link } from './Link.js'

export class Profile {

    firstName
    lastName
    email
    url
    linkArray

    constructor(data) {

        this.firstName = data.firstName ?? null

        this.lastName = data.lastName ?? null

        this.email = data.email ?? null

        this.url = data.url ?? null
        
        this.linkArray = []

        document.addEventListener('linkDeleted', (e) => { this.removeLink(e.detail.link) })

        document.addEventListener('linkCreated', (e) => { this.addLink(e.detail.link) })

    } 

    getLink() { return this.linkArray }

    addLink(link) { 

        this.linkArray.push(link)

        const localStorage = new LocalStorage('link-app')

        localStorage.setItem('profile', this)

    } 

    removeLink(link) { 

        Link.validId.unshift(link.linkId) // Recycles the valid id
        
        this.linkArray = this.linkArray.filter(obj => obj.linkId !== link.linkId) 
    
    }

    loadProfileFromStorage(data) {

        // console.log(data)

        let loadedProfile = new Profile(data)

        data.linkArray.forEach(link => {

            const loadedLink = new Link(link)

        })

        return loadedProfile

    }

}