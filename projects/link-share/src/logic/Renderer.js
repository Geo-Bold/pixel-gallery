import { Session } from "./Session.js"
import { VersionControl } from "./VersionControl.js"
import { Link } from "./Link.js";
import {
    Draggable,
    Sortable,
    Droppable,
    Swappable,
    Plugins
  } from 'https://cdn.jsdelivr.net/npm/@shopify/draggable/build/esm/index.mjs';


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

        this.manageSaveButtonActions(renderable)
        
    }

    static #addInvalidState(container, message) {

        const existingError = container.querySelector('p')

        const invalidHtml = `<p class="invalid-text invalid">${message}</p>`

        container.querySelector('input').classList.add('invalid')

        if (existingError) existingError.innerText = message

        else {

            const invalidEl = this.parser.parseFromString(invalidHtml, 'text/html').body.firstChild

            container.append(invalidEl)

        }

    }

    static #addLinkEventListeners(linkEl, link) {

        const deleteButton = linkEl.querySelector('.delete')

        const input = linkEl.querySelector('.input-field')

        deleteButton.addEventListener('click', () => {

            const event = new CustomEvent('linkDeleted', { detail: link })

            document.dispatchEvent(event)

            Link.validId.unshift(link.linkId)

            this.#removeLinkAndPreview(link) 

            // this.manageLinkPageState()

            this.linkArray.pop(link)

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

        link.setPlatformData(title, url, pattern)

        this.#renderLinkPreview(link)

        const selected = document.getElementById(`selected-${link.linkId}`)

        const input = document.getElementById(`url-input-${link.linkId}`).querySelector('input')

        selected.innerHTML = ''

        selected.append(this.#createIcon(url))

        selected.appendChild(document.createTextNode(title))

        input.placeholder = `https://${pattern}`

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

        const combobox = this.parser.parseFromString(platformHtml, 'text/html').body.firstChild

        const selectedDiv = combobox.querySelector('.select-selected')

        const optionsDiv = combobox.querySelector('.select-items')

        selectedDiv.insertBefore(this.#createIcon(link.platformData.icon), selectedDiv.firstChild)

        selectedDiv.addEventListener('click', e => { // Toggles the menu state

            selectedDiv.classList.add('blue-border')

            selectedDiv.classList.toggle('select-arrow-active')

            document.getElementById(`select-items${link.linkId}`).classList.toggle('select-hide')

        })

        for (let i = 0; i < this.context.platformData.length; i++) { 

            const option = this.#createComboboxOption(this.context.platformData[i])

            option.addEventListener('click', (event) => {

                this.#comboboxUpdatePlatform(option.innerText ,option.dataset.url, option.dataset.regex, link)

                this.#comboboxCloseMenu(event, link)

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

        const container = this.parser.parseFromString(optionHtml, 'text/html').body.firstChild

        container.insertBefore(this.#createIcon(platformData.icon), container.firstChild)

        return container

    }

    static enableDragAndDrop() {

        const sortable = new Sortable(this.context.linkParent, {

            draggable: '.link',

            handle: '.drag-and-drop',

            mirror: {

                appendTo: '.link-body',

                constrainDimensions: true,

            },

          })
          
        sortable.on('sortable:start')

        sortable.on('sortable:sort')

        sortable.on('sortable:sorted')

        sortable.on('sortable:stop', this.#updateLinkOrder)

    }

    static #createIcon(icon) {

        const iconContainer = document.createElement('div')

        if (this.context.linkParent) {

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

        this.context.linkParent.removeChild(node)
        
        const previewEl = document.getElementById(`preview-${link.linkId}`)

        if (this.context.linkPreviewParent.contains(previewEl)) this.context.linkPreviewParent.removeChild(previewEl)
    
    }

    static #removeInvalidState(container, state) {

        container.classList.remove(state)

        const existingError = container.querySelector('.invalid-text')

        if (existingError) existingError.innerText = ""

    }

    static #renderAuthView() {

        const authButton = document.getElementById('auth-button')

        const previewPage = document.querySelector('main').classList.contains('preview')

        console.log(Session.isLoggedIn())

        if (previewPage && Session.isLoggedIn()) {

            this.#renderPreviewPageHeader()

            const shareLinkButton = document.getElementById('auth-button') 

            shareLinkButton.addEventListener('click', e => {

                e.preventDefault()

                console.log(Session.generateSessionUrl())

            })

        } else if (authButton && Session.isLoggedIn()) {

            authButton.innerText = 'Log Out'

            authButton.href = ''

            authButton.addEventListener('click', e => {

                e.preventDefault()

                Session.signOutUser()

                VersionControl.deleteLocalStorageData()

            })

        }
        
        if (authButton && !Session.isLoggedIn()) document.location.reload()

    }

    static #renderLink(link) {

        if (this.context.linkParent) {

            const url = link.linkUrl ? link.linkUrl : ""

            const linkHtml = `

                <div class="link" id="link-${link.linkId}" draggable="true">
                    <header>
                        <div class="drag-and-drop"></div>
                        <object data="/src/assets/images/icon-drag-and-drop.svg" type="image/svg+xml"></object>
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

            const linkEl = this.parser.parseFromString(linkHtml, 'text/html').body.firstChild

            linkEl.insertBefore(this.#createCombobox(link), linkEl.querySelector('.link-input')) 

            this.context.linkParent.append(linkEl)

            this.manageLinkPageState()

            document.addEventListener('click', (e) => { this.#comboboxCloseMenu(e, link) })

            this.#addLinkEventListeners(linkEl, link)

        }

        if (this.context.linkPreviewParent) {

            const mobilePreviewChildrenCount = this.context.linkPreviewParent.childElementCount

            if (mobilePreviewChildrenCount < 5) {

                const mobilePreview = this.#renderLinkPreview(link)

                this.context.linkPreviewParent.append(mobilePreview)

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

        if (existingPreview) {

            existingPreview.removeEventListener('click', addUrlLocation)

            const icon = this.#createIcon(link.platformData.icon)

            existingPreview.querySelector('div:nth-child(1)').replaceWith(icon)

            existingPreview.querySelector('p').innerText = `${link.platformData.title}`

            existingPreview.addEventListener('click', addUrlLocation)            

        } else {

            const mobilePreview = this.parser.parseFromString(linkPreviewHtml, 'text/html').body.firstChild

            const icon = this.#createIcon(link.platformData.icon)

            mobilePreview.insertBefore(icon, mobilePreview.firstChild)

            mobilePreview.addEventListener('click', e => window.open(link.linkUrl, '_blank'))

            return mobilePreview
            
        }

        function addUrlLocation() { window.location.href = link.linkUrl }

    }

    static #renderPreviewPageHeader() {

        const menuHtml = `
        
            <div>
                <a class="button tabs" href="../index.html">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#EBF8FF" d="M8.523 11.72a.749.749 0 0 1 0 1.063l-.371.371A3.751 3.751 0 1 1 2.847 7.85l1.507-1.506A3.75 3.75 0 0 1 9.5 6.188a.753.753 0 0 1-1 1.125 2.25 2.25 0 0 0-3.086.091L3.908 8.91a2.25 2.25 0 0 0 3.183 3.183l.37-.371a.748.748 0 0 1 1.062 0Zm4.63-8.874a3.756 3.756 0 0 0-5.305 0l-.371.37A.751.751 0 1 0 8.539 4.28l.372-.37a2.25 2.25 0 0 1 3.182 3.182l-1.507 1.507a2.25 2.25 0 0 1-3.086.09.753.753 0 0 0-1 1.125 3.75 3.75 0 0 0 5.144-.152l1.507-1.507a3.756 3.756 0 0 0 .002-5.307v-.001Z"/></svg>
                    <p>Links</p>
                </a>
                <a class="button tabs" href="../profile/">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><path fill="#EBF8FF" d="M10.5 1.563A8.437 8.437 0 1 0 18.938 10 8.447 8.447 0 0 0 10.5 1.562ZM6.716 15.357a4.688 4.688 0 0 1 7.568 0 6.54 6.54 0 0 1-7.568 0Zm1.596-5.982a2.188 2.188 0 1 1 4.376 0 2.188 2.188 0 0 1-4.376 0Zm7.344 4.683a6.523 6.523 0 0 0-2.265-1.83 4.062 4.062 0 1 0-5.782 0 6.522 6.522 0 0 0-2.265 1.83 6.562 6.562 0 1 1 10.304 0h.008Z"/></svg>
                    <p>Profile</p>
                </a>
                <a class="button tabs selected" href="./">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#EBF8FF" d="M19.61 9.62c-.03-.064-.714-1.583-2.225-3.095-2.023-2.02-4.572-3.088-7.385-3.088-2.812 0-5.362 1.068-7.382 3.088C1.106 8.037.422 9.556.391 9.62a.944.944 0 0 0 0 .761c.029.064.713 1.583 2.226 3.095 2.021 2.02 4.57 3.086 7.383 3.086 2.813 0 5.362-1.067 7.381-3.086 1.513-1.512 2.197-3.03 2.226-3.095a.946.946 0 0 0 .003-.761Zm-3.599 2.578c-1.677 1.651-3.7 2.49-6.01 2.49-2.313 0-4.334-.839-6.01-2.491A10.185 10.185 0 0 1 2.307 10a10.192 10.192 0 0 1 1.686-2.196C5.667 6.15 7.688 5.312 10 5.312s4.333.839 6.009 2.492c.659.652 1.226 1.39 1.685 2.196a10.19 10.19 0 0 1-1.685 2.197h.002Zm-6.01-5.636a3.438 3.438 0 1 0 0 6.876 3.438 3.438 0 0 0 0-6.876Zm0 5A1.562 1.562 0 1 1 10 8.438a1.562 1.562 0 0 1 0 3.124Z"/></svg>
                    <p>Preview</p>
                </a>  
            </div>

        `

        const shareButtonHtml = ` <a id="auth-button" class="button primary">Share Link</a> `

        const header = document.querySelector('.preview-header')

        if (!header.querySelector('div')) {

            const menu = this.parser.parseFromString(menuHtml, 'text/html').body.firstChild

            const shareButton = this.parser.parseFromString(shareButtonHtml, 'text/html').body.firstChild

            header.append(menu)

            header.append(shareButton)

        }

    }

    static #renderProfile(profile) {

        if (this.context.profileForm) {

            const formInputEl = Array.from(this.context.profileForm.querySelectorAll('input'))

            formInputEl[0].value = profile.firstName

            formInputEl[1].value = profile.lastName

            formInputEl[2].value = profile.email

            this.manageProfilePageState()

            this.manageProfilePictureState(profile)

        }

        if (this.context.linkPreviewParent && profile.linkArray.length > 0) {

            this.#renderProfilePreview(profile)

            this.context.linkPreviewParent.innerHTML = ''

            profile.linkArray.forEach(link => {

                const linkEl = this.#renderLinkPreview(link)

                this.context.linkPreviewParent.append(linkEl)

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

            if (input.value) saveButton.classList.remove('disabled')

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

                fileReader.readAsDataURL(file)

                fileReader.onload = e => {

                    profileImage.src = e.target.result

                    VersionControl.pushImageToCloud(e.target.result)

                }

            } else console.log('error no file')

        })

    }

    static manageSaveButtonActions(renderable) {

        const saveButton = document.getElementById('save')

        let customEvent
        
        if (!saveButton) return
    
        if (!saveButton.hasListener) {

            saveButton.addEventListener('click', (e) => {

                const containsLinkContainer = this.context.linkParent

                const containsLink = containsLinkContainer ? containsLinkContainer.querySelector('.link') : null

                if (containsLinkContainer && containsLink && this.#validateLinkData()) {

                    const updateStorageEvent = new CustomEvent('updateStorage')

                    document.dispatchEvent(updateStorageEvent)

                }

                if (this.context.profileForm) {

                    const isValid = this.#validateProfileData()

                    if (isValid) {

                        const profileFormInputs = Array.from(this.context.profileForm.querySelectorAll('input'))

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

        this.linkArray.forEach(link => {

            const urlContainer = document.getElementById(`url-input-${link.linkId}`)

            const urlInputEl = urlContainer.querySelector('.url-div')

            const urlValue = urlInputEl.querySelector('input').value

            const regex = this.#convertUrlStringToRegex(link.platformData.urlPattern)

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

    static #convertUrlStringToRegex(string) {

        const escapedString = string.replace(/[.]/g, '\\$&')

        return new RegExp(escapedString)

    }

    static #updateLinkOrder() {

        requestAnimationFrame(() => {

            const container = this.context.linkParent

            const linkChildren = Array.from(container.querySelectorAll('.link'))

            linkChildren.forEach((el, index) => {

                const elId = Number(el.id.slice(el.id.indexOf('-') + 1))

                let linkElement = this.linkArray.find(link => link.linkId === elId)

                linkElement.order = index

            })

            this.linkArray.sort((a, b) => a.order - b.order)

            document.querySelector('.link-preview').innerHTML = ''

            container.querySelectorAll('.link').forEach(link => container.removeChild(link))

            this.linkArray.forEach(link => this.render(link, 'link') )

        })

    }

}