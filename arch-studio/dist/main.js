document.addEventListener("DOMContentLoaded", () => {

    document.querySelector('.navbar-burger').addEventListener('click', () => {

        document.querySelector(".navbar-menu").classList.toggle('is-active');

    })

    // Calculates the main page hero's left padding according to its width between 58px and 190px.
    window.addEventListener('resize', () => {

        const heroImg = document.querySelector('.hero-img');

        const heroText = document.querySelector('.hero-text');

        if (heroImg.offsetWidth >= 573 && heroImg.offsetWidth <= 1110) {

            const updatedWidth = ((heroImg.offsetWidth - 573) * 132 / 537) + 58;

            heroText.style.setProperty("--hero-img-width", `${updatedWidth}px`);

        }

    })

})
