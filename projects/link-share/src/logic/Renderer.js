export class Renderer {

    static renderInfo
    static parser = new DOMParser()
    static linkArray = []

    static render(renderable, type) {
        console.log(Renderer.linkArray)
        if (type === 'link' && Renderer.renderInfo.linkParent) {

            const linkHtml = `

                <div class="link" id="link-${renderable.linkId}" draggable="true">
                    <header>
                        <object class="drag-and-drop" data="/src/assets/images/icon-drag-and-drop.svg" type="image/svg+xml"></object>
                        <h2 class="label">Link #${renderable.linkId}</h2>
                        <button class="delete">Remove</button>
                    </header>
                    <div class="link-input" id="url-input-${renderable.linkId}">
                        <label>Link</label>
                        <div class="url-div">
                            <input class="input-field" type="url" placeholder="https://${renderable.platformData.urlPattern}">
                        </div>
                    </div>
                </div>

            `

            const linkEl = Renderer.parser.parseFromString(linkHtml, 'text/html').body.firstChild

            linkEl.insertBefore(Renderer.#createCombobox(renderable), linkEl.querySelector('.link-input')) 

            Renderer.renderInfo.linkParent.append(linkEl)

            Renderer.#createDragEventListeners(linkEl, renderable)

            Renderer.manageLinkPageState()

            document.addEventListener('click', (e) => { Renderer.#comboboxCloseMenu(e, renderable) })

            Renderer.#addLinkEventListeners(linkEl, renderable)

        }

        if (Renderer.renderInfo.previewParent) {

            const mobilePreview = Renderer.#renderMobilePreview(renderable, type)

            if (mobilePreview) Renderer.renderInfo.previewParent.append(mobilePreview)

        }

        if (type === 'profile' && Renderer.renderInfo.profileForm) {

            const formInputEl = Array.from(Renderer.renderInfo.profileForm.querySelectorAll('input'))

            formInputEl[0].value = renderable.firstName

            formInputEl[1].value = renderable.lastName

            formInputEl[2].value = renderable.email

            Renderer.manageProfilePageState()

            Renderer.manageProfilePictureState(renderable)

        }

        Renderer.manageSaveButtonActions(renderable)

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
        
        // input.addEventListener('change', () => {

        //     const inputLink = input.value

        //     if (link.platformData.urlPattern.test(inputLink)) {

        //         link.linkUrl = inputLink

        //         const event = new CustomEvent('linkCreated', { detail: { link: link } }) 

        //         document.dispatchEvent(event) // Notifies profile to add link

        //     } else {} // Required: error state
                
        // })

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

        for (let i = 0; i < Renderer.renderInfo.platformData.length; i++) { 

            const option = Renderer.#createComboboxOption(Renderer.renderInfo.platformData[i])

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

    // Creates a mobile link preview for the first six links 
    // REQUIRES UPDATING ACCORDING TO NEW LINK DOM ORDER

    static #renderMobilePreview(link, type) {

        if (type === 'profile') {

            const mobileProfile = document.getElementById('mobile-profile-img')

            if (link.imageString) mobileProfile.src = link.imageString

        }

        if (type === 'link') {

            const mobilePreviewHtml = `

            <div class="mobile-link" id="preview-${link.linkId}">
                <p>${link.platformData.title}</p>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#fff" d="M2.667 7.333v1.334h8L7 12.333l.947.947L13.227 8l-5.28-5.28L7 3.667l3.667 3.666h-8Z"/></svg>
                </div>
            </div>

         `
            const mobilePreviewChildrenCount = Renderer.renderInfo.previewParent.childElementCount

            if (mobilePreviewChildrenCount < 5) {

                const existingPreview = document.getElementById(`preview-${link.linkId}`)

                if (existingPreview != null) {

                    const icon = Renderer.#createIcon(link.platformData.icon)

                    existingPreview.querySelector('div:nth-child(1)').replaceWith(icon)

                    existingPreview.querySelector('p').innerText = `${link.platformData.title}`

                } else {

                    const mobilePreview = Renderer.parser.parseFromString(mobilePreviewHtml, 'text/html').body.firstChild

                    const icon = Renderer.#createIcon(link.platformData.icon)

                    mobilePreview.insertBefore(icon, mobilePreview.firstChild)

                    return mobilePreview
                    
                }

            }

        }
        
    }

    // Helper function that retrieves svg files to create icons

    static #createIcon(icon) {

        const iconContainer = document.createElement('div')

        if (Renderer.renderInfo.linkParent) {

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

    // Updates the selected menu option

    static #comboboxUpdatePlatform(title, url, pattern, link) {

        link.setPlatformData(title, url, new RegExp(pattern.slice(1, -1)))

        Renderer.#renderMobilePreview(link, 'link')

        const selected = document.getElementById(`selected-${link.linkId}`)

        const input = document.getElementById(`url-input-${link.linkId}`).querySelector('input')

        selected.innerHTML = ''

        selected.append(Renderer.#createIcon(url))

        selected.appendChild(document.createTextNode(title))

        input.placeholder = `https://${pattern.toString()}`

    }

    static #comboboxCloseMenu(event, link) {

        const selected = document.getElementById(`selected-${link.linkId}`)

        const menu = document.getElementById(`select-items${link.linkId}`)

        if (selected && menu && !selected.contains(event.target) && selected.classList.contains('blue-border')) {

            selected.classList.remove('blue-border')

            menu.classList.add('select-hide')
    
        }

    }

    static manageSaveButtonActions(renderable) {

        const saveButton = document.getElementById('save')

        let customEvent
        
        if (!saveButton) return
    
        if (!saveButton.hasListener) {

            saveButton.addEventListener('click', (e) => {

                const containsLinkContainer = Renderer.renderInfo.linkParent

                const containsLink = containsLinkContainer ? containsLinkContainer.querySelector('.link') : null

                if (containsLinkContainer && containsLink) {

                    customEvent = new CustomEvent('linkCreated', { detail: Renderer.linkArray })

                }

                if (Renderer.renderInfo.profileForm) {

                    const profileFormInputs = Array.from(Renderer.renderInfo.profileForm.querySelectorAll('input'))

                    const profileImage = document.getElementById('profile-img')
    
                    customEvent = new CustomEvent('profilePageSaved', {

                        detail: {
                            
                            firstName: profileFormInputs[0].value,
                            lastName: profileFormInputs[1].value,
                            email: profileFormInputs[2].value,
                            imageString: profileImage.src

                        }

                    })
    
                }

                document.dispatchEvent(customEvent)
    
                document.location.reload()

            }, { once: true })
    
            saveButton.hasListener = true

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

            if (input.value) changeSaveButtonState()

            input.addEventListener('keyup', changeSaveButtonState)
    
        })

        function changeSaveButtonState() {

            if (profileForm && (profileFormInputFields.some(input => input.value.length > 0)) || profileImage.src != null) saveButton.classList.remove('disabled')
                    
            else saveButton.classList.add('disabled')

        }

    }

    static #removeLinkAndPreview(link) { //fixed

        const node = document.getElementById(`link-${link.linkId}`)

        Renderer.renderInfo.linkParent.removeChild(node)
        
        const previewEl = document.getElementById(`preview-${link.linkId}`)

        if (Renderer.renderInfo.previewParent.contains(previewEl)) Renderer.renderInfo.previewParent.removeChild(previewEl)
    
    }

    // Returns the closest element to the element being dragged by calculating the offset from mouse position to the div midpoints

    static getDragAfterElement(linkContainer, y) {

        const draggableElements = [...linkContainer.querySelectorAll('.link[draggable="true"]:not(.dragging)')]
    
        return draggableElements.reduce((closest, child) => {

            const box = child.getBoundingClientRect()
            
            const offset = y - box.top - box.height / 2
            
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }

            else return closest

        }, { offset: Number.NEGATIVE_INFINITY }).element

    }

    static #createDragEventListeners(linkEl, link) {

        const linkBody = Renderer.renderInfo.linkParent

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

}