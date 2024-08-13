import { Link } from './Link.js'
import { LinkRenderer } from './LinkRenderer.js'
import { Profile } from './Profile.js'

document.addEventListener('DOMContentLoaded', (event) => {

    const linkBodyContainer = document.querySelector('.link-body')

    const mobilePreviewContainer = document.querySelector('.link-preview')

    /* Create a new link element */

    let profile = new Profile()

    const createLinkButton = document.querySelector('.link-container > button').addEventListener('click', () => {

        profile.addLink(new Link(null, profile,linkBodyContainer, mobilePreviewContainer)) 

        LinkRenderer.updateIntroductionNode()

    })

})