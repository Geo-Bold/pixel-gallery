import { Link } from './Link.js'
import { LinkRenderer } from './LinkRenderer.js'
import { Profile } from './Profile.js'

document.addEventListener('DOMContentLoaded', (event) => {

    const linkInputData = {

        userId: null, // Id used to determine the user's authentication status. Anonymous users are 'anon'

        profile: new Profile(), // Profile object contains all user link objects

        linkParent: document.querySelector('.link-body'), // Container in which the link objects will be rendered

        previewParent: document.querySelector('.link-preview'), // Container where the mobile previews will be rendered

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

    /* Create a new link element */

    const createLinkButton = document.querySelector('.link-container > button').addEventListener('click', () => {

        linkInputData.profile.addLink(new Link(linkInputData)) 

        LinkRenderer.updateIntroductionNode()

    })

})