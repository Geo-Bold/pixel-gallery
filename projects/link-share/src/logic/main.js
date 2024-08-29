import { Link } from './Link.js'
import { Renderer } from './Renderer.js'
import { Profile } from './Profile.js'
import { LocalStorage } from './LocalStorage.js'

document.addEventListener('DOMContentLoaded', (event) => {

    // Preloads the Renderer with the link parent and mobile preview parent elements as well as the menu options for each link.

    Renderer.renderInfo = { 

        linkParent: document.querySelector('.link-body'), // Container in which the link objects will be rendered

        previewParent: document.querySelector('.link-preview'), // Container where the mobile previews will be rendered

        profileForm: document.querySelector('.profile-form'),

        platformData: [

            { title: 'GitHub', icon: 'github', urlPattern: /github\.com/ },
            { title: 'YouTube', icon: 'youtube', urlPattern: /youtube\.com/ },
            { title: 'Frontend Mentor', icon: 'frontend-mentor', urlPattern: /frontendmentor\.io/ },
            { title: 'Twitter', icon: 'twitter', urlPattern: /twitter\.com/ },
            { title: 'LinkedIn', icon: 'linkedin', urlPattern: /linkedin\.com/ },
            { title: 'Facebook', icon: 'facebook', urlPattern: /facebook\.com/ },
            { title: 'Twitch', icon: 'twitch', urlPattern: /twitch\.tv/ },
            { title: 'Dev.to', icon: 'devto', urlPattern: /dev\.to/ },
            { title: 'Codewars', icon: 'codewars', urlPattern: /codewars\.com/ },
            { title: 'Codepen', icon: 'codepen', urlPattern: /codepen\.io/ },
            { title: 'freeCodeCamp', icon: 'freecodecamp', urlPattern: /freecodecamp\.org/ },
            { title: 'GitLab', icon: 'gitlab', urlPattern: /gitlab\.com/ },
            { title: 'Hashnode', icon: 'hashnode', urlPattern: /hashnode\.com/ },
            { title: 'Stack Overflow', icon: 'stack-overflow', urlPattern: /stackoverflow\.com/ }

        ]

    }

    const storedData = new LocalStorage('link-app').returnAllValues()

    let profile = new Profile(storedData.profile) // Loads existing profile from storage or creates a new profile.

    // Creates and renders a generic link

    const createLinkButton = document.querySelector('.link-container > button')
    
    if (createLinkButton) createLinkButton.addEventListener('click', e => new Link({}) )    
        
    // Profile page states

    if (Renderer.renderInfo.profileForm) {

        const profileImageContainer = document.querySelector('.add-profile-input')

        const inputFile = profileImageContainer.querySelector('input')

        profileImageContainer.addEventListener('click', e => inputFile.click())

    }

})