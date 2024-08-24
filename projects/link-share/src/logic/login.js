import { LocalStorage } from "./LocalStorage.js"

document.addEventListener("DOMContentLoaded", () => {

    const createAccountHtml = `
        <form class="login-form">
            <header class="header">
                <h1>Create Account</h1>
                <p>Let's get you started sharing your links!</p>
            </header>
            <div class="body">
                <label for="email">Email</label>
                <div class="email">
                    <input type="email" class="input-field" placeholder="e.g. geo@email.com">
                </div>
                <label for="password">Password</label>
                <div class="password">
                    <input type="password" class="input-field" placeholder="At least 8 characters">
                </div>
                <label for="password">Confirm Password</label>
                <div class="password">
                    <input type="password" class="input-field" placeholder="At least 8 characters">
                </div>
                <button type="submit" class="button primary">Create Account</button>
            </div>
            <footer>
                <p>Already have an account? <span id="login-form-toggle">Login</span></p>
            </footer>
        </form>
    `
    const container = document.querySelector(".container")

    const currentForm = container.querySelector("form")

    let activeView = "login"

    let local = new LocalStorage("account")

    if (local.getItem("view")) activeView = local.getItem("view")

    else local.setItem("view", "login")

    if (activeView === "create-account") {

        container.removeChild(currentForm)

        const parser = new DOMParser()

        const document = parser.parseFromString(createAccountHtml, "text/html")

        const content = document.body.firstChild

        container.appendChild(content)

    }

    document.getElementById("login-form-toggle").addEventListener("click", () => {

        if (activeView === "login") {

            local.setItem("view", "create-account")

            window.location.reload()

        }

        else {

            local.setItem("view", "login")

            window.location.reload()

        }
    })

})