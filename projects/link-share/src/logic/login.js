import { LocalStorage } from './LocalStorage.js'
import { Profile } from './Profile.js' // Don't delete
import { Session } from './Session.js'

/**
 * Initializes the session and handles form rendering for account creation and login.
 * Manages switching between the login and create account views, and validates form inputs.
 *
 * @event DOMContentLoaded - Executes the logic once the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {

    Session.initialize()

    const container = document.querySelector('.container')

    const currentForm = container.querySelector('form')

    let local = new LocalStorage('account')

    let activeView = updateView()

    // If the active view is for account creation, render the account creation form
    if (activeView === 'create-account') { 
        
        renderCreateAccountView()

        document.getElementById('submit').addEventListener('click', e => validateInput(e, Session.createUser.bind(Session)) )
    
    } else if (activeView === 'login') {

        document.getElementById('submit').addEventListener('click', e => validateInput(e, Session.signInUser.bind(Session)))

    }

    // Switch between login and create account views
    document.getElementById('login-form-toggle').addEventListener('click', () => {

        if (activeView === 'login') {

            local.setItem('view', 'create-account')

            window.location.reload()

        }

        else {

            local.setItem('view', 'login')

            window.location.reload()

        }
    })

    /**
     * Adds an invalid input state to the specified container, displaying an error message.
     * @param {Element} container - The container where the error message should be displayed.
     * @param {string} message - The error message to display.
     */
    function addInvalidInputState(container, message) {

        const existingError = container.querySelector('p')

        const invalidHtml = `<p class="invalid-text invalid">${message}</p>`

        container.querySelector('input').classList.add('invalid')

        if (existingError) existingError.innerText = message

        else {

            const parser = new DOMParser()

            const invalidEl = parser.parseFromString(invalidHtml, 'text/html').body.firstChild

            container.append(invalidEl)

        }

    }

    /**
     * Clears all invalid input states and associated error messages from the form.
     */
    function clearInvalidInputState() {

        document.querySelectorAll('.invalid-text').forEach(el => el.remove())

        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'))

    }

    /**
     * Validates if the provided email value is a valid email format.
     * @param {string} emailValue - The email string to validate.
     * @returns {boolean} - Returns `true` if the email is valid, otherwise `false`.
     */
    function emailIsValid(emailValue) {

        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ // RegEx for email validation
    
        const emailIsValid = emailRegex.test(emailValue)
    
        return emailIsValid ? true : false

    }

    /**
     * Renders the "Create Account" view by replacing the current form in the container.
     */
    function renderCreateAccountView() {

        const createAccountHtml = `

        <form class="login-form">
            <header class="header">
                <h1>Create Account</h1>
                <p>Let's get you started sharing your links!</p>
            </header>
            <div class="body">
                <label for="email">Email</label>
                <div class="email">
                    <input id="email" type="text" class="input-field" placeholder="e.g. geo@email.com" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#EBF8FF" d="M14 3H2a.5.5 0 0 0-.5.5V12a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V3.5A.5.5 0 0 0 14 3Zm-.5 9h-11V4.637l5.162 4.732a.5.5 0 0 0 .676 0L13.5 4.637V12Z"/></svg>
                </div>
                <label for="password">Password</label>
                <div class="password">
                    <input id="password-1" type="password" class="input-field" placeholder="At least 8 characters" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#EBF8FF" d="M13 5h-2V3.5a3 3 0 0 0-6 0V5H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1ZM8.5 9.914V11.5a.5.5 0 0 1-1 0V9.914a1.5 1.5 0 1 1 1 0ZM10 5H6V3.5a2 2 0 1 1 4 0V5Z"/></svg>
                </div>
                <label for="password">Confirm Password</label>
                <div class="password">
                    <input id="password-2" type="password" class="input-field" placeholder="At least 8 characters" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#EBF8FF" d="M13 5h-2V3.5a3 3 0 0 0-6 0V5H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1ZM8.5 9.914V11.5a.5.5 0 0 1-1 0V9.914a1.5 1.5 0 1 1 1 0ZM10 5H6V3.5a2 2 0 1 1 4 0V5Z"/></svg>
                </div>
                <button id="submit" class="button primary">Create Account</button>
            </div>
            <footer>
                <p>Already have an account? <span id="login-form-toggle">Login</span></p>
            </footer>
        </form>

    `

    container.removeChild(currentForm)

        const parser = new DOMParser()

        const document = parser.parseFromString(createAccountHtml, 'text/html')

        const content = document.body.firstChild

        container.appendChild(content)

    }

    /**
     * Updates the view to either "login" or "create-account" based on the current local storage value.
     * @returns {string} - Returns the active view name ('login' or 'create-account').
     */
    function updateView() {

        let activeView = 'login'

        if (local.getItem('view')) activeView = local.getItem('view')

        else local.setItem('view', 'login')

        return activeView

    }

    /**
     * Validates the input fields (email and password) and executes a callback function on successful validation.
     * @param {Event} event - The event object.
     * @param {Function} executeOnSuccess - The callback function to execute after validation succeeds.
     */
    function validateInput(event, executeOnSuccess) {

        event.preventDefault()

        let validEmail = true

        let validPassword = true

        const emailContainer = document.querySelector('.email')

        const passwordContainer = document.querySelector('.password')

        const email = document.getElementById('email')

        const password = document.getElementById('password-1')

        let cPassword = document.getElementById('password-2')

        if (!email.value) {

            addInvalidInputState(emailContainer, "Can't be empty")

            validEmail = false

        } 

        else if (!emailIsValid(email.value)) {

            addInvalidInputState(emailContainer, 'Not a valid email')

            validEmail = false

        }

        if (!password.value) {

            addInvalidInputState(passwordContainer, "Can't be empty")

            validPassword = false

        }

        else if (password.value.length < 6) {

            addInvalidInputState(passwordContainer, 'Too short')

            validPassword = false

        }

        else if (cPassword && password.value != cPassword.value) {

            addInvalidInputState(passwordContainer, "Passwords don't match")

            password.value = ""

            cPassword.value = ""

            validPassword = false

        }

        if (validEmail && validPassword) {

            executeOnSuccess({ email: email.value, password: password.value })
                .then(user => window.location.href = '../')
                .catch(error => console.error('error signing in:', error.message))

            clearInvalidInputState()
                

            email.value = ""

            password.value = ""

            if (cPassword) cPassword.value = ""
            
        }
    }

})