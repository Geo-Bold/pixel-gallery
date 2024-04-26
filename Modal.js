export class Modal {

    #id = 'modal'

    modal = `
        <div class="modal is-active" id="${this.#id}">
            <div class="modal-background"></div>
            <button class="modal-close is-large" aria-label="close"></button>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title"></p>
                </header>
                <section class="modal-card-body">
                    <div class="field" id="modal-card-field">
                        <label class="label"></label>
                    </div>
                </section>
                <footer class="modal-card-foot is-justify-content-end">
                    <div class="buttons">
                        <button class="button is-danger" id="modal-primary-button"></button>
                        <button class="button is-info" id="modal-secondary-button"></button>
                    </div>
                </footer>
            </div>
        </div> 
    `

    input = `<input id="modal-input" class="input">`

    constructor(message, title, primaryBtnText, secondaryBtnText) {

        this.title = title ?? 'Attention' 
        this.message = message ?? 'Do you wish to proceed?'
        this.requireUserInput = false
        this.primaryBtnText = primaryBtnText ?? 'OK'
        this.secondaryBtnText = secondaryBtnText ?? 'Cancel'
    }

    #createTemplate() {
        
        const existingModal = document.getElementById(`${this.#id}`)
        existingModal && this.#close()

        const parser = new DOMParser()
        const parsedContent = parser.parseFromString(this.modal, 'text/html')
                
        const modalTitle = parsedContent.querySelector('.modal-card-title')
        modalTitle.innerText = this.title

        const modalMessage = parsedContent.querySelector('.label')
        modalMessage.innerText = this.message

        if (this.requireUserInput) {

            const parsedInput = parser.parseFromString(this.input, 'text/html')
            const input = parsedInput.querySelector('input')
            const parsedSection = parsedContent.getElementById('modal-card-field')
            parsedSection.append(input)

        }

        const modalPrimaryButton = parsedContent.getElementById('modal-primary-button')
        modalPrimaryButton.innerText = this.primaryBtnText

        const modalSecondaryButton = parsedContent.getElementById('modal-secondary-button')
        modalSecondaryButton.innerText = this.secondaryBtnText

        const modalDiv = parsedContent.querySelector('.modal')
        document.body.appendChild(modalDiv)

        this.#createCloseEvents() // Listens for events to close the modal

    }

    prompt(funcToRunOnOkay, funcToRunOnCancel) {

        this.requireUserInput = true
        this.#createTemplate()

        const primaryButton = document.getElementById('modal-primary-button')
        const secondaryButton = document.getElementById('modal-secondary-button')
        const userInput = document.getElementById('modal-input')

        if (funcToRunOnOkay) {
        
            primaryButton.addEventListener('click', () => {

                funcToRunOnOkay(userInput.value)
                this.#close()

            })

        }

        secondaryButton.addEventListener('click', () => {

            if (funcToRunOnCancel) {

                funcToRunOnCancel(userInput.value)
                this.#close()
                
            } else { this.#close() }

        })

    }

    confirm(funcToRunOnOkay, funcToRunOnCancel) {

        this.#createTemplate()

        const primaryButton = document.getElementById('modal-primary-button')
        const secondaryButton = document.getElementById('modal-secondary-button')

        if (funcToRunOnOkay) {

            primaryButton.addEventListener('click', () => {

                funcToRunOnOkay(true)

            })

        }

        secondaryButton.addEventListener('click', () => {

            if (funcToRunOnCancel) {

                funcToRunOnCancel(userInput.value)
                this.#close()
                
            } else { this.#close() }

        })

    }

    #createCloseEvents() {

        document.querySelectorAll('.modal-background, .delete, .modal-close').forEach((el) => {

            el.addEventListener('click', () => { this.#close() })

        }) 

        document.addEventListener('keydown', (event) => { event.key === "Escape" && this.#close()})

    }

    #close() {

        const modal = document.getElementById(this.#id)

        modal && modal.remove()
    
      }

}