import { LocalStorage } from "./LocalStorage.js"

document.addEventListener('DOMContentLoaded', (e) => {

    const storedData = new LocalStorage('link-app').returnAllValues()

    if (Object.keys(storedData).length > 0) {

        // Render profile data

        const profile = storedData.profile

        const profileImageEl = document.getElementById('profile-image')

        const name = document.querySelector('.title')

        const email = document.querySelector('.text')

        if (profile.imageString) {

            profileImageEl.src = profile.imageString

            removeClass(profileImageEl, 'circle')

        }

        else {}

        if (profile.firstName || profile.lastName) {

            name.innerText = profile.firstName + ' ' + profile.lastName

            removeClass(name, 'title')

        }

        if (profile.email) {

            email.innerText = profile.email

            removeClass(email, 'text')

        }

        // Render links

        const linkContainer = document.querySelector('.link-div')

        if (profile.linkArray.length > 0) {

            linkContainer.innerHTML = ''

            profile.linkArray.forEach(link => {

                const linkHtml = `
            
                    <div class="mobile-link" id="preview-${link.linkId}">
                        <p>${link.platformData.title}</p>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#fff" d="M2.667 7.333v1.334h8L7 12.333l.947.947L13.227 8l-5.28-5.28L7 3.667l3.667 3.666h-8Z"/></svg>
                        </div>
                    </div>

                `

                const parser = new DOMParser()

                const document = parser.parseFromString(linkHtml, 'text/html')

                const linkEl = document.body.firstChild

                const icon = createIcon(link.platformData.icon)

                linkEl.insertBefore(icon, linkEl.firstChild)

                linkContainer.append(linkEl)

            })

        }

    }

    function removeClass(element, className) { element.classList.remove(className) }

    function addClass(element, className) { element.classList.add(className) }

    function createIcon(icon) {

        const iconContainer = document.createElement('div')

        fetch(`../src/assets/images/icon-${icon}.svg`)

            .then(response => response.text())

            .then(svgContent => { iconContainer.innerHTML = svgContent })

            .catch(error => console.error('Error loading SVG:'))

        return iconContainer

    }


})