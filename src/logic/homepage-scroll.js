document.addEventListener("DOMContentLoaded", () => {

    const aboutMeButton = document.querySelector(".intro-title .jump-link-btn");
    const target = document.querySelector(".homepage-section");

    aboutMeButton.addEventListener("click", (event) => {

        event.preventDefault();

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    });

});