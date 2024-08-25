export class Renderer {

    static renderInfo
    static parser = new DOMParser()
    static linkArray = []

    static render(link, type) {

        const linkHtml = `

            <div class="link" id="" draggable="true"></div>

        `

        if (type === 'link') {

            const linkEl = document.createElement('div')

            linkEl.classList.add('link')

            linkEl.id = `link-${link.linkId}`

            linkEl.setAttribute('draggable', 'true')

            linkEl.append(Renderer.#createHeader(link)) 

            linkEl.append(Renderer.#createCombobox(link)) 

            linkEl.append(Renderer.#createUrlInput(link)) 

            if (Renderer.renderInfo.linkParent) {

                Renderer.renderInfo.linkParent.append(linkEl)

                Renderer.#createDragEventListeners(linkEl, link)

                Renderer.manageLinkPageState()

                document.addEventListener('click', (e) => { Renderer.#comboboxCloseMenu(e, link) })

            }
            
            if (Renderer.renderInfo.previewParent) {

                const mobilePreview = Renderer.#updateMobilePreview(link)

                if (mobilePreview) Renderer.renderInfo.previewParent.append(mobilePreview)

            }

        }

        if (type === 'profile' && Renderer.renderInfo.profileForm) {

            const formInputEl = Array.from(Renderer.renderInfo.profileForm.querySelectorAll('input'))

            formInputEl[0].value = link.firstName

            formInputEl[1].value = link.lastName

            formInputEl[2].value = link.email

        }

    }

    static #createHeader(link) {

        const headerHtml = `

            <header>
                <object class="drag-and-drop" data="/src/assets/images/icon-drag-and-drop.svg" type="image/svg+xml"></object>
                <h2 class="label">Link #${1}</h2>
                <button class="delete">Remove</button>
            </header>

        `

        const linkHeader = document.createElement('header')

        const headerSvg = document.createElement('object')

        headerSvg.classList.add('drag-and-drop')

        headerSvg.setAttribute('data', '/src/assets/images/icon-drag-and-drop.svg')

        headerSvg.setAttribute('type', 'image/svg+xml')

        headerSvg.addEventListener('dragend', (e) => { document.getElementById(`selected-${link.linkId}`).style.opacity = '1' })

        const title = document.createElement('h2')

        title.classList.add('label')
        
        title.innerText = `Link #${link.linkId}`

        const deleteButton = document.createElement('button')
        
        deleteButton.classList.add('delete')

        deleteButton.innerText = 'Remove'

        deleteButton.addEventListener('click', () => {

            const event = new CustomEvent('linkDeleted', { detail: { link: link } }) 

            document.dispatchEvent(event) // Notifies profile to remove link

            Renderer.#removeLinkAndPreview(link) 

            Renderer.manageLinkPageState()

            Renderer.linkArray.pop(link)

        })

        linkHeader.append(headerSvg)

        linkHeader.append(title)

        linkHeader.append(deleteButton)

        return linkHeader

    }

    static #createCombobox(link) {

        const platformHtml = `

            <div class="link-input">
                <label>Platform</label>
                <div class="custom-select">
                    <div class="select-selected" data-url="${2}" id="selected-${3}">
                    <div></div>
                </div>
                <div class="select-items select-hide" id="select-items${4}">
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                    <div data-url="${5}"><div></div></div>
                </div>
                </div>
            </div>

        ` 

        const comboboxContainer = document.createElement('div')

        comboboxContainer.classList.add('link-input')

        const label = document.createElement('label')

        label.innerText = 'Platform'

        const customCombobox = document.createElement('div')

        customCombobox.classList.add('custom-select')

        const selectedDiv = Renderer.#createComboboxOption(link.platformData) 

        selectedDiv.classList.add('select-selected') // Renders the selected menu option

        selectedDiv.id = `selected-${link.linkId}`

        selectedDiv.addEventListener('click', e => { // Toggles the menu state

            selectedDiv.classList.add('blue-border')

            selectedDiv.classList.toggle('select-arrow-active')

            document.getElementById(`select-items${link.linkId}`).classList.toggle('select-hide')

        })

        const selectItems = document.createElement('div') // Renders the menu options

        selectItems.className = 'select-items select-hide'

        selectItems.id = `select-items${link.linkId}`

        for (let i = 0; i < Renderer.renderInfo.platformData.length; i++) { 

            const optionDiv = Renderer.#createComboboxOption(Renderer.renderInfo.platformData[i])

            optionDiv.addEventListener('click', (event) => {

                Renderer.#comboboxUpdatePlatform(optionDiv.innerText ,optionDiv.dataset.url, link)

                Renderer.#comboboxCloseMenu(event, link)

            })

            selectItems.append(optionDiv)

        }

        customCombobox.append(selectedDiv)

        customCombobox.append(selectItems)

        comboboxContainer.append(label)

        comboboxContainer.append(customCombobox)

        return comboboxContainer
        
    }

    static #createUrlInput(link) {

        const linkHtml = `

            <div class="link-input">
                <label>Link</label>
                <div class="url-div">
                    <input class="input-field" type="url" placeholder="">
                </div>
            </div>

        `

        const urlInputContainer = document.createElement('div')

        urlInputContainer.classList.add('link-input')

        const label = document.createElement('label')

        label.innerText = 'Link'

        const inputContainer = document.createElement('div')

        inputContainer.classList.add('url-div')

        const input = document.createElement('input')

        input.classList.add('input-field')

        input.setAttribute('type', 'url')
        
        if (link.linkUrl) input.value = link.linkUrl
        
        input.placeholder = 'https://github.com/Geo-Bold'

        input.addEventListener('change', () => {

            const inputLink = input.value

            if (link.platformData.urlPattern.test(inputLink)) {

                link.linkUrl = inputLink

                const event = new CustomEvent('linkCreated', { detail: { link: link } }) 

                document.dispatchEvent(event) // Notifies profile to add link

            } else {} // Required: error state
                
        })

        inputContainer.append(input)

        urlInputContainer.append(label)

        urlInputContainer.append(inputContainer)

        return urlInputContainer

    }

    // Creates a mobile link preview for the first six links 
    // REQUIRES UPDATING ACCORDING TO NEW LINK DOM ORDER

    static #updateMobilePreview(link) {

        const mobilePreviewHtml = `

            <div class="mobile-link" id="preview-${link.linkId}">
                <p>${link.platformData.title}</p>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#fff" d="M2.667 7.333v1.334h8L7 12.333l.947.947L13.227 8l-5.28-5.28L7 3.667l3.667 3.666h-8Z"/></svg>
                </div>
            </div>
            
        `

        const mobilePreviewChildrenCount = Renderer.renderInfo.previewParent.childElementCount

        const existingPreview = document.getElementById(`preview-${link.linkId}`)

        if (mobilePreviewChildrenCount < 5 && existingPreview === null) {

            const doc = Renderer.parser.parseFromString(mobilePreviewHtml, 'text/html')

            const mobilePreview = doc.body.firstChild

            const icon = Renderer.#createIcon(link.platformData.icon)

            mobilePreview.insertBefore(icon, doc.body.firstChild.querySelector('p'))

            return mobilePreview

        } else if (existingPreview != null) {

            const icon = Renderer.#createIcon(link.platformData.icon)

            existingPreview.querySelector('div:nth-child(1)').replaceWith(icon)

            existingPreview.querySelector('p').innerText = `${link.platformData.title}`

        }
        
    }

    static #createComboboxOption(platformData) {

        const container = document.createElement('div')

        const title = platformData.title 

        const icon = platformData.icon 

        container.dataset.url = `${icon}`

        container.append(Renderer.#createIcon(icon))

        container.appendChild(document.createTextNode(`${title}`))
        
        return container

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

    static #comboboxUpdatePlatform(title, url, link) {

        link.setPlatformData(title, url)

        Renderer.#updateMobilePreview(link)

        const selected = document.getElementById(`selected-${link.linkId}`)

        selected.innerHTML = ''

        selected.append(Renderer.#createIcon(url))

        selected.appendChild(document.createTextNode(title))

    }

    static #comboboxCloseMenu(event, link) {

        const selected = document.getElementById(`selected-${link.linkId}`)

        const menu = document.getElementById(`select-items${link.linkId}`)

        if (selected && menu && !selected.contains(event.target) && selected.classList.contains('blue-border')) {

            selected.classList.remove('blue-border')

            menu.classList.add('select-hide')
    
        }

    }

    static manageSaveButtonActions() {

        const page = document.querySelector('.container').dataset.page

        const saveButton = document.getElementById('save')

        let customEvent = null

        saveButton.addEventListener('click', (e) => {

            if (page === 'link') customEvent = new CustomEvent('linkPageSaved', {detail: Renderer.linkArray})
    
            if (page === 'profile') {
    
                const profileFormInputs = Array.from(document.querySelector('.profile-form').querySelectorAll('input'))
    
                customEvent = new CustomEvent('profilePageSaved', {
                    
                    detail: {
    
                        firstName: profileFormInputs[0].value,
                        lastName: profileFormInputs[1].value,
                        email: profileFormInputs[2].value,
    
                    }
    
                })
    
            }

            document.dispatchEvent(customEvent)

        })

    }

    static manageLinkPageState() {

        const linkBody = document.querySelector('.link-body')

        const linkBodyIntroduction = linkBody.querySelector('.info')

        const saveButton = document.getElementById('save')

        console.log(linkBody.querySelector('.link'))

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

        const saveButton = document.getElementById('save')

        if (profileForm) {

            const profileFormInputFields = Array.from(profileForm.querySelectorAll('input'))

            profileFormInputFields.forEach(input => {

                input.addEventListener('keyup', () => {
        
                    if (profileForm && (profileFormInputFields.some(input => input.value.length > 0))) saveButton.classList.remove('disabled')
                    
                    else saveButton.classList.add('disabled')
            
                })
        
            })

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

}