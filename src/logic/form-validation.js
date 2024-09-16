import { Notify } from '../../projects/link-share/src/logic/Notification.js'

document.addEventListener("DOMContentLoaded", () => {

    const fieldInputs = document.querySelector(".contact-me-form").querySelectorAll(".field")

    const sendMessageButton = document.querySelector("#contact-submit-button")

    sendMessageButton.addEventListener("click", (event) => {

        event.preventDefault()

        if (validInputFields()) {

            const nameEl = document.getElementById('name')

            const emailEl = document.getElementById('email')

            const messageEl = document.getElementById('message')

            emailjs.init('ef3-ZRdxfhqemg5QM')

            emailjs.send('service_7bx4lzw', 'template_sdvcriy', { from_name: nameEl.value, from_email: emailEl.value, message: messageEl.value }).then(response => { 

                new Notify("Your message has been sent!", 'success')

                nameEl.value = ''

                emailEl.value = ''

                messageEl.value = ''
            
            })
            .catch(error => { new Notify("Your message failed to send.", 'error') })

        }
        
    })

    function validInputFields () {

        let validForm = true

        fieldInputs.forEach( e => {

            const eTag = e.querySelector("input, textarea")

            if (eTag !== null && !eTag.value) {

                e.querySelector("p").textContent = "This field is required."

                validForm = false

            } else {

                if (e.querySelector("p")) e.querySelector("p").textContent = ""

            }

        })

        return validForm

    }

})