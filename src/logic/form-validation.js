document.addEventListener("DOMContentLoaded", () => {

    const fieldInputs = document.querySelector(".contact-me-form").querySelectorAll(".field");
    const sendMessageButton = document.querySelector("#contact-submit-button");

    sendMessageButton.addEventListener("click", (event) => {

        event.preventDefault();

        validateInputFields();
        
    });

    function validateInputFields () {

        fieldInputs.forEach((e) => {

            const eTag = e.querySelector("input, textarea");

            if (eTag !== null && !eTag.value) {

                e.querySelector("p").textContent = "This field is required.";

            } else {

                e.querySelector("p").textContent = "";

            }

        });

    }

});