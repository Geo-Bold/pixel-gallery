import { Link } from "./Link.js"

export class LinkRenderer {

    static renderInfo

    static render(link) {

        const linkEl = document.createElement('div')

        linkEl.classList.add('link')

        linkEl.id = `link-${link.linkId}`

        linkEl.setAttribute('draggable', 'true')

        linkEl.append(LinkRenderer.#createHeader(link)) 

        linkEl.append(LinkRenderer.#createCombobox(link)) 

        linkEl.append(LinkRenderer.#createUrlInput(link)) 

        LinkRenderer.renderInfo.linkParent.append(linkEl)

        LinkRenderer.updateIntroductionNode()

        LinkRenderer.renderInfo.previewParent.append(LinkRenderer.#updateMobilePreview(link))

        LinkRenderer.#createDragEventListeners(linkEl, link)
        
        document.addEventListener('click', (e) => { LinkRenderer.#comboboxCloseMenu(e, link) })

    }

    static #createHeader(link) {

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

            LinkRenderer.#destroy(link) 

            LinkRenderer.#destroyMobilePreview(link)

        })

        linkHeader.append(headerSvg)

        linkHeader.append(title)

        linkHeader.append(deleteButton)

        return linkHeader

    }

    static #createCombobox(link) {

        const comboboxContainer = document.createElement('div')

        comboboxContainer.classList.add('link-input')

        const label = document.createElement('label')

        label.innerText = 'Platform'

        const customCombobox = document.createElement('div')

        customCombobox.classList.add('custom-select')

        const selectedDiv = LinkRenderer.#createComboboxOption(link.platformData) 

        selectedDiv.classList.add('select-selected')

        selectedDiv.id = `selected-${link.linkId}`

        selectedDiv.addEventListener('click', e => {

            selectedDiv.classList.add('blue-border')

            selectedDiv.classList.toggle('select-arrow-active')

            document.getElementById(`select-items${link.linkId}`).classList.toggle('select-hide')

        })

        const selectItems = document.createElement('div')

        selectItems.className = 'select-items select-hide'

        selectItems.id = `select-items${link.linkId}`

        for (let i = 0; i < LinkRenderer.renderInfo.platformData.length; i++) { 

            const optionDiv = LinkRenderer.#createComboboxOption(LinkRenderer.renderInfo.platformData[i])

            optionDiv.addEventListener('click', (event) => {

                LinkRenderer.#comboboxUpdatePlatform(optionDiv.innerText ,optionDiv.dataset.url, link)

                LinkRenderer.#comboboxCloseMenu(event, link)

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

        const urlInputContainer = document.createElement('div')

        urlInputContainer.classList.add('link-input')

        const label = document.createElement('label')

        label.innerText = 'Link'

        const inputContainer = document.createElement('div')

        inputContainer.classList.add('url-div')

        const input = document.createElement('input')

        input.classList.add('platform-url')

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

    static #updateMobilePreview(link) {

        const existingPreview = document.getElementById(`preview-${link.linkId}`)

        if (link.linkId < 6 && existingPreview === null) {

            const previewEl = document.createElement('div')

            previewEl.classList.add('mobile-link')

            previewEl.id = `preview-${link.linkId}`

            const icon = LinkRenderer.#createIcon(link.platformData.icon)

            const title = document.createElement('p')
            
            title.innerText = `${link.platformData.title}`

            const arrowDiv = document.createElement('div')

            const arrowSvg = document.createElement('svg')

            arrowSvg.setAttribute('path', './src/assets/images/icon-arrow-right.svg')

            arrowDiv.append(arrowSvg)

            previewEl.append(icon)

            previewEl.append(title)

            previewEl.append(arrowDiv)

            return previewEl

        } else if (link.linkId < 6) {

            const icon = LinkRenderer.#createIcon(link.platformData.icon)

            existingPreview.firstChild.replaceWith(icon)

            existingPreview.querySelector('p').innerText = `${link.platformData.title}`

        }
        
    }

    static #destroyMobilePreview(link) { //fixed

        const previewEl = document.getElementById(`preview-${link.linkId}`)

        if (LinkRenderer.renderInfo.previewParent.contains(previewEl)) LinkRenderer.renderInfo.previewParent.removeChild(previewEl)

    }

    static #createComboboxOption(platformData) {

        const container = document.createElement('div')

        const title = platformData.title 

        const icon = platformData.icon 

        container.dataset.url = `${icon}`

        container.append(LinkRenderer.#createIcon(icon))

        container.appendChild(document.createTextNode(`${title}`))
        
        return container

    }

    static #createIcon(icon) {

        const iconContainer = document.createElement('div')

        fetch(`./src/assets/images/icon-${icon}.svg`)

            .then(response => response.text())

            .then(svgContent => { iconContainer.innerHTML = svgContent })

            .catch(error => console.error('Error loading SVG:', error))

        return iconContainer

    }

    static #comboboxUpdatePlatform(title, url, link) {

        link.setPlatformData(title, url)

        LinkRenderer.#updateMobilePreview(link)

        const selected = document.getElementById(`selected-${link.linkId}`)

        selected.innerHTML = ''

        selected.append(LinkRenderer.#createIcon(url))

        selected.appendChild(document.createTextNode(title))

    }

    static #comboboxCloseMenu(event, link) {

        const selected = document.getElementById(`selected-${link.linkId}`)

        const menu = document.getElementById(`select-items${link.linkId}`)

        if (!selected.contains(event.target) && selected.classList.contains('blue-border')) {

            selected.classList.remove('blue-border')

            menu.classList.add('select-hide')
    
        }

    }

    static updateIntroductionNode() {

        const linkBody = document.querySelector('.link-body')

        const linkBodyIntroduction = linkBody.querySelector('.info')

        !linkBody.querySelector('.link') ? linkBodyIntroduction.classList.remove('inactive') : linkBodyIntroduction.classList.add('inactive')

    }

    static #destroy(link) { //fixed

        const node = document.getElementById(`link-${link.linkId}`)

        LinkRenderer.renderInfo.linkParent.removeChild(node) 
    
    }

    /* Returns the closest element to the element being dragged by calculating the offset from mouse position to the div midpoints */

    static getDragAfterElement(linkContainer, y) {

        const draggableElements = [...linkContainer.querySelectorAll('.draggable:not(.dragging)')]
    
        return draggableElements.reduce((closest, child) => {

            const box = child.getBoundingClientRect()
            
            const offset = y - box.top - box.height / 2
            
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }

            else return closest

        }, { offset: Number.NEGATIVE_INFINITY }).element

    }

    static #createDragEventListeners(linkEl, link) {

        const linkBody = LinkRenderer.renderInfo.linkParent

        linkEl.addEventListener('dragstart', (e) => {

            const linkId = link.linkId.toString()

            linkEl.classList.add('dragging')
        
            e.target.style.opacity = '0.5'

        })

        linkBody.addEventListener('dragover', (e) => {

            e.preventDefault() // Allow dropping

            const draggedElement = document.querySelector('.dragging')

            const afterElement = LinkRenderer.getDragAfterElement(linkBody, e.clientY)
        
            if (afterElement) {

                linkBody.insertBefore(draggedElement, afterElement)

            } else {

                if (draggedElement !== linkBody.lastElementChild) {

                    linkBody.append(draggedElement)

                }

            }

        })

        linkEl.addEventListener('dragend', (e) => {

            e.target.style.opacity = '1'

        })

    }

}