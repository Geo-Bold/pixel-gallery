import { Session } from "./Session.js"

export class Renderer {

    static context
    static parser = new DOMParser()
    static linkArray = []

    static render(renderable, type) {

        switch(type) {

            case 'link': this.#renderLink(renderable)

                break

            case 'profile': this.#renderProfile(renderable)

                break

            case 'auth' : this.#renderAuthView()

                break

        }

        Renderer.manageSaveButtonActions(renderable)
        
    }

    static #addInvalidState(container, message) {

        const existingError = container.querySelector('p')

        const invalidHtml = `<p class="invalid-text invalid">${message}</p>`

        container.querySelector('input').classList.add('invalid')

        if (existingError) existingError.innerText = message

        else {

            const parser = new DOMParser()

            const invalidEl = parser.parseFromString(invalidHtml, 'text/html').body.firstChild

            container.append(invalidEl)

        }

    }

    static #addLinkEventListeners(linkEl, link) {

        const deleteButton = linkEl.querySelector('.delete')

        const input = linkEl.querySelector('.input-field')

        deleteButton.addEventListener('click', () => {

            const event = new CustomEvent('linkDeleted', { detail: link }) 

            document.dispatchEvent(event) // Notifies profile to remove link

            Renderer.#removeLinkAndPreview(link) 

            Renderer.manageLinkPageState()

            Renderer.linkArray.pop(link)

        })

        if (link.linkUrl) input.value = link.linkUrl // Loads existing url from storage
        
    }

    static #comboboxCloseMenu(event, link) {

        const selected = document.getElementById(`selected-${link.linkId}`)

        const menu = document.getElementById(`select-items${link.linkId}`)

        if (selected && menu && !selected.contains(event.target) && selected.classList.contains('blue-border')) {

            selected.classList.remove('blue-border')

            menu.classList.add('select-hide')
    
        }

    }

    static #comboboxUpdatePlatform(title, url, pattern, link) {

        link.setPlatformData(title, url, new RegExp(pattern.slice(1, -1)))

        Renderer.#renderLinkPreview(link)

        const selected = document.getElementById(`selected-${link.linkId}`)

        const input = document.getElementById(`url-input-${link.linkId}`).querySelector('input')

        selected.innerHTML = ''

        selected.append(Renderer.#createIcon(url))

        selected.appendChild(document.createTextNode(title))

        input.placeholder = `https://${pattern.toString()}`

    }

    static #createCombobox(link) {

        const platformHtml = `

            <div class="link-input">
                <label>Platform</label>
                <div class="custom-select">
                    <div class="select-selected" data-url="${link.platformData.icon}" id="selected-${link.linkId}">
                        <p>${link.platformData.title}</p>
                    </div>
                    <div class="select-items select-hide" id="select-items${link.linkId}"></div>
                </div>
            </div>

        ` 

        const combobox = Renderer.parser.parseFromString(platformHtml, 'text/html').body.firstChild

        const selectedDiv = combobox.querySelector('.select-selected')

        const optionsDiv = combobox.querySelector('.select-items')

        selectedDiv.insertBefore(Renderer.#createIcon(link.platformData.icon), selectedDiv.firstChild)

        selectedDiv.addEventListener('click', e => { // Toggles the menu state

            selectedDiv.classList.add('blue-border')

            selectedDiv.classList.toggle('select-arrow-active')

            document.getElementById(`select-items${link.linkId}`).classList.toggle('select-hide')

        })

        for (let i = 0; i < Renderer.context.platformData.length; i++) { 

            const option = Renderer.#createComboboxOption(Renderer.context.platformData[i])

            option.addEventListener('click', (event) => {

                Renderer.#comboboxUpdatePlatform(option.innerText ,option.dataset.url, option.dataset.regex, link)

                Renderer.#comboboxCloseMenu(event, link)

            })

            optionsDiv.append(option)

        }

        return combobox
        
    }

    static #createComboboxOption(platformData) {

        const optionHtml = `

            <div data-url="${platformData.icon}" data-regex="${platformData.urlPattern.toString()}">
                <p>${platformData.title}</p>
            </div>
            
        `

        const container = Renderer.parser.parseFromString(optionHtml, 'text/html').body.firstChild

        container.insertBefore(Renderer.#createIcon(platformData.icon), container.firstChild)

        return container

    }

    static #createDragEventListeners(linkEl, link) {

        const linkBody = Renderer.context.linkParent

        linkEl.addEventListener('dragstart', (e) => {

            linkEl.classList.add('dragging')
        
            e.target.style.opacity = '0.5'

        })

        linkBody.addEventListener('dragover', (e) => {

            e.preventDefault() // Allow dropping

            const draggedElement = document.querySelector('.dragging')

            const afterElement = Renderer.getDragAfterElement(linkBody, e.clientY)
        
            if (afterElement === null) {

                linkBody.appendChild(draggedElement)

            } else {

                linkBody.insertBefore(draggedElement, afterElement)

            }

        })

        linkEl.addEventListener('dragend', (e) => {

            e.target.style.opacity = '1'

            linkEl.classList.remove('dragging')

        })

    }

    static #createIcon(icon) {

        const iconContainer = document.createElement('div')

        if (Renderer.context.linkParent) {

            fetch(`./src/assets/images/icon-${icon}.svg`)

            .then(response => response.text())

            .then(svgContent => { iconContainer.innerHTML = svgContent })

            .catch(error => console.error('Error loading SVG:'))

        } else {

            fetch(`../src/assets/images/icon-${icon}.svg`)

            .then(response => response.text())

            .then(svgContent => { iconContainer.innerHTML = svgContent })

            .catch(error => console.error('Error loading SVG:'))

        }
        
        return iconContainer

    }

    static #removeLinkAndPreview(link) {

        const node = document.getElementById(`link-${link.linkId}`)

        Renderer.context.linkParent.removeChild(node)
        
        const previewEl = document.getElementById(`preview-${link.linkId}`)

        if (Renderer.context.linkPreviewParent.contains(previewEl)) Renderer.context.linkPreviewParent.removeChild(previewEl)
    
    }

    static #removeInvalidState(container, state) {

        container.classList.remove(state)

        const existingError = container.querySelector('.invalid-text')

        if (existingError) existingError.innerText = ""

    }

    static #renderAuthView() {

        const authButton = document.getElementById('auth-button')

        const page = window.location.pathname

        const previewPage = page.slice(page.indexOf('preview'), page.indexOf('preview') + 7)
        
        if (previewPage === 'preview' && Session.isLoggedIn()) {

            authButton.innerText = 'Share Link'

            authButton.href = ''

            authButton.addEventListener('click', e => {

                e.preventDefault()

                console.log('link copied to clipboard')

            })

        } else if (authButton && Session.isLoggedIn()) {

            authButton.innerText = 'Log Out'

            authButton.href = ''

            authButton.addEventListener('click', e => {

                e.preventDefault()

                Session.signOutUser()

            })

        }
        
        if (authButton && !Session.isLoggedIn()) document.location.reload()

    }

    static #renderLink(link) {

        if (Renderer.context.linkParent) {

            const url = link.linkUrl ? link.linkUrl : ""

            const linkHtml = `

                <div class="link" id="link-${link.linkId}" draggable="true">
                    <header>
                        <object class="drag-and-drop" data="/src/assets/images/icon-drag-and-drop.svg" type="image/svg+xml"></object>
                        <h2 class="label">Link #${link.linkId}</h2>
                        <button class="delete">Remove</button>
                    </header>
                    <div class="link-input" id="url-input-${link.linkId}">
                        <label>Link</label>
                        <div class="url-div">
                            <input value="${url}" class="input-field" type="url" placeholder="https://${link.platformData.urlPattern}">
                        </div>
                    </div>
                </div>

            `

            const linkEl = Renderer.parser.parseFromString(linkHtml, 'text/html').body.firstChild

            linkEl.insertBefore(Renderer.#createCombobox(link), linkEl.querySelector('.link-input')) 

            Renderer.context.linkParent.append(linkEl)

            Renderer.#createDragEventListeners(linkEl, link)

            Renderer.manageLinkPageState()

            document.addEventListener('click', (e) => { Renderer.#comboboxCloseMenu(e, link) })

            Renderer.#addLinkEventListeners(linkEl, link)

        }

        if (Renderer.context.linkPreviewParent) {

            const mobilePreviewChildrenCount = Renderer.context.linkPreviewParent.childElementCount

            if (mobilePreviewChildrenCount < 5) {

                const mobilePreview = Renderer.#renderLinkPreview(link)

                Renderer.context.linkPreviewParent.append(mobilePreview)

            }

        }

    }

    static #renderLinkPreview(link) {

        const linkPreviewHtml = `

            <div class="mobile-link" id="preview-${link.linkId}">
                <p>${link.platformData.title}</p>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#fff" d="M2.667 7.333v1.334h8L7 12.333l.947.947L13.227 8l-5.28-5.28L7 3.667l3.667 3.666h-8Z"/></svg>
                </div>
            </div>

         `

        const existingPreview = document.getElementById(`preview-${link.linkId}`)

        if (existingPreview != null) {

            const icon = Renderer.#createIcon(link.platformData.icon)

            existingPreview.querySelector('div:nth-child(1)').replaceWith(icon)

            existingPreview.querySelector('p').innerText = `${link.platformData.title}`

        } else {

            const mobilePreview = Renderer.parser.parseFromString(linkPreviewHtml, 'text/html').body.firstChild

            const icon = Renderer.#createIcon(link.platformData.icon)

            mobilePreview.insertBefore(icon, mobilePreview.firstChild)

            return mobilePreview
            
        }

    }

    static #renderProfile(profile) {

        if (Renderer.context.profileForm) {

            const formInputEl = Array.from(Renderer.context.profileForm.querySelectorAll('input'))

            formInputEl[0].value = profile.firstName

            formInputEl[1].value = profile.lastName

            formInputEl[2].value = profile.email

            Renderer.manageProfilePageState()

            Renderer.manageProfilePictureState(profile)

        }

        if (Renderer.context.linkPreviewParent && profile.linkArray.length > 0) {

            Renderer.#renderProfilePreview(profile)

            Renderer.context.linkPreviewParent.innerHTML = ''

            profile.linkArray.forEach(link => {

                const linkEl = Renderer.#renderLinkPreview(link)

                Renderer.context.linkPreviewParent.append(linkEl)

            })

        }

    }

    static #renderProfilePreview(profile) {

        const profileImage = document.getElementById('mobile-profile-img')

        const name = document.getElementById('preview-name')

        const email = document.getElementById('preview-email')

        if (profile.imageString) {

            profileImage.src = profile.imageString

            profileImage.classList.remove('circle')

        }

        else {}

        if (name && profile.firstName && profile.lastName) {

            name.innerText = profile.firstName + ' ' + profile.lastName

            name.classList.remove('title')

        }

        if (email && profile.email) {

            email.innerText = profile.email

            email.classList.remove('text')

        }

    }

    static getDragAfterElement(linkContainer, y) {

        const draggableElements = [...linkContainer.querySelectorAll('.link[draggable="true"]:not(.dragging)')]
    
        return draggableElements.reduce((closest, child) => {

            const box = child.getBoundingClientRect()
            
            const offset = y - box.top - box.height / 2
            
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }

            else return closest

        }, { offset: Number.NEGATIVE_INFINITY }).element

    }

    static manageLinkPageState() {

        const linkBody = document.querySelector('.link-body')

        const linkBodyIntroduction = linkBody.querySelector('.info')

        const saveButton = document.getElementById('save')

        if (linkBody.querySelector('.link')) {

            linkBodyIntroduction.classList.add('inactive')

            saveButton.classList.remove('disabled')

        }
            
        else  {

            linkBodyIntroduction.classList.remove('inactive')

            saveButton.classList.add('disabled')

        }

    }

    static manageProfilePageState() {

        const profileForm = document.querySelector('.profile-form')

        const profileFormInputFields = Array.from(profileForm.querySelectorAll('input'))

        const saveButton = document.getElementById('save')

        const profileImage = document.querySelector('#profile-img')

        if (profileImage.src != null) changeSaveButtonState()

        profileFormInputFields.forEach(input => {

            if (input.value) changeSaveButtonState()

            input.addEventListener('keyup', changeSaveButtonState)
    
        })

        function changeSaveButtonState() {

            if (profileForm && (profileFormInputFields.some(input => input.value.length > 0)) || profileImage.src != null) saveButton.classList.remove('disabled')
                    
            else saveButton.classList.add('disabled')

        }

    }

    static manageProfilePictureState(profileObject) {

        const profileContainer = document.querySelector('.add-profile-input')

        const inputFile = profileContainer.querySelector('input')

        const profileImageContainer = document.querySelector('.add-profile-input')

        const profileImage = profileContainer.querySelector('img')

        // if (profileImage.src.length < 1) profileImageContainer.classList.add('hidden')

        // else profileImageContainer.classList.remove('hidden')

        if (profileObject.imageString) profileImage.src = profileObject.imageString // Load existing profile image

        inputFile.addEventListener('change', e => {

            const file = e.target.files[0]

            if (file) {

                const fileReader = new FileReader()

                fileReader.onload = e => profileImage.src = e.target.result

                fileReader.readAsDataURL(file)

            } else console.log('error no file')

        })

    }

    static manageSaveButtonActions(renderable) {

        const saveButton = document.getElementById('save')

        let customEvent
        
        if (!saveButton) return
    
        if (!saveButton.hasListener) {

            saveButton.addEventListener('click', (e) => {

                const containsLinkContainer = Renderer.context.linkParent

                const containsLink = containsLinkContainer ? containsLinkContainer.querySelector('.link') : null

                if (containsLinkContainer && containsLink && this.#validateLinkData()) {

                    const updateStorageEvent = new CustomEvent('updateStorage')

                    document.dispatchEvent(updateStorageEvent)

                }

                if (Renderer.context.profileForm) {

                    const isValid = this.#validateProfileData()

                    if (isValid) {

                        const profileFormInputs = Array.from(Renderer.context.profileForm.querySelectorAll('input'))

                        const profileImage = document.getElementById('profile-img')
        
                        customEvent = new CustomEvent('profilePageSaved', {

                            detail: {
                                
                                firstName: profileFormInputs[0].value,
                                lastName: profileFormInputs[1].value,
                                email: profileFormInputs[2].value,
                                imageString: profileImage.src

                            }

                        })

                        document.dispatchEvent(customEvent)

                        document.location.reload()

                    }
    
                }


    
            })
    
            saveButton.hasListener = true

        }

    }

    static #validateEmail (emailValue) {

        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ // RegEx for email validation
    
        const emailIsValid = emailRegex.test(emailValue)
    
        return emailIsValid ? true : false

    }

    static #validateLinkData() {

        let dataIsValid = true

        Renderer.linkArray.forEach(link => {

            const urlContainer = document.getElementById(`url-input-${link.linkId}`)

            const urlInputEl = urlContainer.querySelector('.url-div')

            const urlValue = urlInputEl.querySelector('input').value

            const regex = new RegExp(link.platformData.urlPattern)

            if (!urlValue) {

                this.#addInvalidState(urlInputEl, "Can't be empty")

                dataIsValid = false

            } else if (!regex.test(urlValue)) {

                this.#addInvalidState(urlInputEl, "Url doesn't match the platform")

                dataIsValid = false

            } else {

                link.linkUrl = urlValue

                const customEvent = new CustomEvent('linkCreated', { detail: link })

                document.dispatchEvent(customEvent)

                this.linkArray = this.linkArray.filter(tempLink => tempLink.linkId !== link.linkId)

            }

        })

        return dataIsValid

    }

    static #validateProfileData() {

        let dataIsValid = true

        const profileForm = document.querySelector('.profile-form')

        const formInputContainers = profileForm.querySelectorAll('div')

        formInputContainers.forEach(container => {

            const input = container.querySelector('input')

            if (!input.value) {

                this.#addInvalidState(container, "Can't be empty")

                dataIsValid = false

            } else if (input.type === 'email' && !this.#validateEmail(input.value)) {

                this.#addInvalidState(container, "Not a valid email")

                dataIsValid = false

            }

            if (dataIsValid) this.#removeInvalidState(container, 'invalid')

        })

        return dataIsValid

    }

}