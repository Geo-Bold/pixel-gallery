import { Modal } from "./Modal.js"
document.addEventListener('DOMContentLoaded', (event) => {

  
  
  // Get dom elements for the email field and submission button

  const submitButton = document.querySelector('.button-submit') 

  const emailField = document.getElementById('field-email')

  // When submit button is clicked, check the validity of the email

  function checkEmailValidity () {

    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ // RegEx for email validation

    const emailValue = emailField.value 

    return emailRegex.test(emailValue)

  }

  function emailValidationResponse(checkEmailValidity) {

    if (!checkEmailValidity()) {

      const validationPrompt = document.querySelector('.email-validation-prompt')

      validationPrompt.innerText = "Valid email required"

      return false

    } 
    
    return true

  }

  submitButton.addEventListener('click', (event) => {

    event.preventDefault()
    
    const subscribedModal = new Modal()

    subscribedModal.confirm()


  })
  

  

}) 
