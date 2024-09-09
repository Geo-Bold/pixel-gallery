import { Modal } from "./Modal.js"
document.addEventListener('DOMContentLoaded', (event) => {

  // Get dom elements for the email field and submission button

  const submitButton = document.querySelector('.button-submit') 

  const emailField = document.querySelector('.field-email')

  const invalidResponseEl = document.querySelector("#email-header > :nth-child(2)")

  // When submit button is clicked, check the validity of the email

  function checkEmailValidity () {

    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ // RegEx for email validation

    const emailValue = emailField.value 

    const emailIsValid = emailRegex.test(emailValue)

    if (emailIsValid) {

      return true

    } else {

      return false;

    }

  }

  function addInvalidEmailResponse() {

    invalidResponseEl.classList.add("invalid-email-prompt")

    emailField.classList.add("invalid-email-field")

    invalidResponseEl.innerText = "Valid email required"

  }

  function removeInvalidEmailReponse () {

    invalidResponseEl.classList.remove("invalid-email-prompt")

    emailField.classList.remove("invalid-email-field")

    invalidResponseEl.innerText = ""

    emailField.value = ""

  }

  submitButton.addEventListener('click', (event) => {

    event.preventDefault() // Required to prevent button from closing modal.

    if (checkEmailValidity()) {

      const title = "Thanks for subscribing!"
      const imgAddress = "./newsletter-sign-up-with-success-message-main/assets/images/icon-success.svg"
      const email = emailField.value
      const message = `A confirmation email has been sent to ${email}. Please open it and click the button inside to confirm your subscription.`
      const btnMessage = "Dismiss message"

      const modal = new Modal(message, title, btnMessage, null, imgAddress);

      modal.confirm()

      removeInvalidEmailReponse()

    } else {

      addInvalidEmailResponse()

    }

  })

}) 
