export class LinkRenderer {

    static platformData = ['github', 'youtube', 'frontend-mentor', 'twitter', 'linkedin', 'facebook', 'twitch', 'devto', 'codewars', 'codepen', 'freecodecamp', 'gitlab', 'hashnode', 'stack-overflow']
    static platformOptions = ['GitHub', 'YouTube', 'Frontend Mentor', 'Twitter', 'LinkedIn', 'Facebook', 'Twitch', 'Dev.to', 'Codewars', 'Codepen', 'freeCodeCamp', 'GitLab', 'Hashnode', 'Stack Overflow']

    static render(link, container) {

        const linkContainer = document.createElement('div')

        linkContainer.classList.add('link')

        linkContainer.id = `link-${link.getId()}`

        linkContainer.append(LinkRenderer.createHeader(link, container))

        linkContainer.append(LinkRenderer.createCombobox(link))

        linkContainer.append(LinkRenderer.createUrlInput(link))

        container.append(linkContainer)

        document.addEventListener('click', (e) => { LinkRenderer.comboboxCloseMenu(e, link) })

    }

    static createHeader(link, container) {

        const linkHeader = document.createElement('header')

        const headerSvg = document.createElement('object')

        headerSvg.classList.add('drag-and-drop')

        headerSvg.setAttribute('data', '/src/assets/images/icon-drag-and-drop.svg')

        headerSvg.setAttribute('type', 'image/svg+xml')

        const title = document.createElement('h2')

        title.classList.add('label')
        
        title.innerText = `Link #${link.getId()}`

        const deleteButton = document.createElement('button')
        
        deleteButton.classList.add('delete')

        deleteButton.innerText = 'Remove'

        deleteButton.addEventListener('click', () => {

            link.destroy()

            LinkRenderer.destroy(link, container)

            LinkRenderer.updateIntroductionNode()

        })

        linkHeader.append(headerSvg)

        linkHeader.append(title)

        linkHeader.append(deleteButton)

        return linkHeader

    }

    static createCombobox(link) {

        const comboboxContainer = document.createElement('div')

        comboboxContainer.classList.add('link-input')

        const label = document.createElement('label')

        label.innerText = 'Platform'

        const customCombobox = document.createElement('div')

        customCombobox.classList.add('custom-select')

        const selectedDiv = LinkRenderer.createComboboxOption(LinkRenderer.platformOptions[0], LinkRenderer.platformData[0])

        selectedDiv.classList.add('select-selected')

        selectedDiv.id = `selected-${link.getId()}`

        selectedDiv.addEventListener('click', e => {

            selectedDiv.classList.add('blue-border')

            selectedDiv.classList.toggle('select-arrow-active');

            document.getElementById(`select-items${link.getId()}`).classList.toggle('select-hide');

        })

        const selectItems = document.createElement('div')

        selectItems.className = 'select-items select-hide'

        selectItems.id = `select-items${link.getId()}`

        for (let i = 0; i < LinkRenderer.platformOptions.length; i++) {

            const optionDiv = LinkRenderer.createComboboxOption(LinkRenderer.platformOptions[i], LinkRenderer.platformData[i])

            optionDiv.addEventListener('click', (event) => {

                LinkRenderer.comboboxUpdatePlatform(optionDiv.dataset.url, link)

                LinkRenderer.comboboxCloseMenu(event, link)

            })

            selectItems.append(optionDiv)

        }

        customCombobox.append(selectedDiv)

        customCombobox.append(selectItems)

        comboboxContainer.append(label)

        comboboxContainer.append(customCombobox)

        return comboboxContainer
        
    }

    static createUrlInput(link) {

        const urlInputContainer = document.createElement('div')

        urlInputContainer.classList.add('link-input')

        const label = document.createElement('label')

        label.innerText = 'Link'

        const inputContainer = document.createElement('div')

        inputContainer.classList.add('url-div')

        const input = document.createElement('input')

        input.classList.add('platform-url')

        input.setAttribute('type', 'url')

        input.placeholder = 'https://github.com/Geo-Bold'

        inputContainer.append(input)

        urlInputContainer.append(label)

        urlInputContainer.append(inputContainer)

        return urlInputContainer

    }

    static createComboboxOption(optionText, dataUrl) {

        const container = document.createElement('div')

        container.dataset.url = `${dataUrl}`

        container.append(LinkRenderer.createIcon(dataUrl))

        container.appendChild(document.createTextNode(`${optionText}`))
        
        return container

    }

    static createIcon(url) {

        const iconContainer = document.createElement('div');

        fetch(`./src/assets/images/icon-${url}.svg`)

            .then(response => response.text())

            .then(svgContent => {

            iconContainer.innerHTML = svgContent;

            })

            .catch(error => console.error('Error loading SVG:', error));

        return iconContainer;

    }

    static comboboxUpdatePlatform(url, link) {

        link.setPlatform(url) 

        const selectedIndex = LinkRenderer.platformData.indexOf(url)

        const selected = document.getElementById(`selected-${link.getId()}`)

        selected.innerHTML = ''

        selected.append(LinkRenderer.createIcon(url))

        selected.appendChild(document.createTextNode(LinkRenderer.platformOptions[selectedIndex]))

    }

    static comboboxCloseMenu(event, link) {

        const selected = document.getElementById(`selected-${link.getId()}`)

        const menu = document.getElementById(`select-items${link.getId()}`)

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

    static getDefaultPlatform() { return LinkRenderer.platformData }

    static destroy(link, container) { 

        const node = document.getElementById(`link-${link.getId()}`)

        container.removeChild(node) 
    
    }

}