import { Modal } from "./Modal.js"
document.addEventListener('DOMContentLoaded', (event) => {

  // Get dom elements for the email field and submission button

  const submitButton = document.getElementById('button-submit') 

  const emailField = document.getElementById('field-email')

  // When submit button is clicked, check the validity of the email

  submitButton.addEventListener('click', () => {

    console.log('Working')

    const newModal = new Modal()

    newModal.confirm()

  })

  emailField.addEventListener('change', () => {

    const prompt = new Modal

    const emailValue = emailField.value 

    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ // RegEx for email validation
        
    let validEmailAddress = emailRegex.test(emailValue)

    
  })

}) 
