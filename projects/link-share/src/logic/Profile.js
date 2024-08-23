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

    getLink(index) { return this.linkArray[index] }

    addLink(link) { 

        this.linkArray.push(link)

        this.saveProfile()

    } 

    removeLink(link) { 

        Link.validId.unshift(link.linkId) // Recycles the valid id
        
        this.linkArray = this.linkArray.filter(obj => obj.linkId !== link.linkId)
        
        this.saveProfile()
    
    }
    saveProfile() { 
        
        const localStorage = new LocalStorage('link-app')

        localStorage.setItem('profile', this) 
    
    }
    // Reconstructs a profile and links from JSON strings
    loadProfileFromStorage(data) {

        let loadedProfile = new Profile(data) // Reconstructs the profile

        data.linkArray.forEach(link => loadedProfile.addLink(new Link(link)) ) // Reconstructs link objects and adds them to the profile
        return loadedProfile

    }

}