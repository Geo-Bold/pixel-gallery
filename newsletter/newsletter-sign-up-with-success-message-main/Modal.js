export class Modal {

    #id = 'modal'

    modal = `
        <div class="modal is-active" id="${this.#id}">
        <div class="modal-background"></div>
        <div class="modal-card">
            <div class="modal-card-body">
                <div class="block">
                    <figure class="image is-64x64 is-rounded">
                        <img src="/newsletter-sign-up-with-success-message-main/assets/images/icon-list.svg" class="is-large" alt="">
                    </figure>
                </div>
                <div class="block">
                    <h1 class="modal-card-title">
                        Thanks for subscribing!
                    </h1>
                </div>
                <div class="block">
                    <label class="label">
                        A confirmation email has been sent to ash@loremcompany.com. Please open it and click the button inside to confirm your subscription.
                    </label>
                </div>
                <div class="block">
                    <div></div>
                    <button id="modal-primary-button" class="button is-fullwidth">Dismiss message</button>
                </div>
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
        if (modalSecondaryButton) {
            modalSecondaryButton.innerText = this.secondaryBtnText
        }

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