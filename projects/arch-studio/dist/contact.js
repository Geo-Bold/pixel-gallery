document.addEventListener("DOMContentLoaded", () => {

    // Controls the OpenStreetMap

    let map = L.map('map').setView([34.844709, -90.228999], 5);
        
    let office1 = L.marker([35.602112, -83.628717], {alt: "The texas office."}).addTo(map);

    let office2 = L.marker([32.179439, -96.182890], {alt: "The tennessee office."}).addTo(map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Zooms into selected office when a marker is clicked.

    [office1, office2].forEach((office, index) => {

        office.on("click", () => {

            map.setView(office.getLatLng(), 10);
    
        })

    })

    // Scroll to map

    const viewMapButtons = document.querySelectorAll(".view-map")

    const mapDiv = document.getElementById("map")

    viewMapButtons.forEach(button => {

        button.addEventListener("click", () => {

            mapDiv.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
            
            if (button.dataset.office === "1") map.setView(office1.getLatLng(), 10)

            else map.setView(office2.getLatLng(), 10)

        })

    })
    
    // Form validation

    const submitButton = document.querySelector('.button-submit') 

    const emailField = document.querySelector('#email')

    const fields = document.querySelectorAll('.contact-input')

    const invalidEmailResponse = document.querySelector('#email-error')

    function checkEmailValidity () {

        const emailRegex = /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/
    

        if (!emailRegex.test(emailField.value))  return true
        
        else return false

    }
    // Check for empty fields and valid email string
    submitButton.addEventListener('click', (event) => {

        event.preventDefault() // Required to prevent button from closing modal.

        let noEmptyStrings = true

        let validEmail = true

        fields.forEach(field => {

            if (field.value.trim() === "") {

                document.querySelector(`#${field.dataset.type}-error`).innerText = "Can't be empty"

                field.classList.add("error-input")

                noEmptyStrings = false

            } else if (field.dataset.type === "email") {

                if (checkEmailValidity()) {

                    invalidEmailResponse.innerText = "Invalid email"

                    emailField.classList.add("error-input")

                    validEmail = false

                } 

                else {

                invalidEmailResponse.innerText = ""

                field.classList.remove("error-input")

                }

            } else {

                document.querySelector(`#${field.dataset.type}-error`).innerText = ""

                field.classList.remove("error-input")

            }

        })
        
        // Submit the form if email is valid and no fields are empty.
        if (validEmail && noEmptyStrings) {

            fields.forEach(field => {

                field.value = ""

                document.querySelector(`#${field.dataset.type}-error`).innerText = ""

            })

        }
        
    })

})