document.addEventListener("DOMContentLoaded", () => {
    
    const navBurger = document.querySelector(".navbar-burger");
    const navMenu = document.querySelector(".navbar-menu");

    navBurger.addEventListener("click", () => {

        navMenu.classList.toggle("is-active");
        
    });

    document.addEventListener("scroll", () => { 

        navMenu.classList.remove('is-active');

        navBurger.classList.remove("active")

        document.querySelector(".ham").classList.remove("active")

    })

});