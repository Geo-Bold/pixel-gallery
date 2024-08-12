import { Link } from './Link.js'
import { LinkRenderer } from './LinkRenderer.js'
import { Profile } from './Profile.js'

document.addEventListener('DOMContentLoaded', (event) => {

    /* Create a new link element */

    let profile = new Profile()

    const createLinkButton = document.querySelector('.link-container > button').addEventListener('click', () => {

        const linkBodyContainer = document.querySelector('.link-body')
        
        profile.addLink(new Link(null, linkBodyContainer, profile)) 

        LinkRenderer.updateIntroductionNode()

    })

})