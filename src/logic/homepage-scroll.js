document.addEventListener("DOMContentLoaded", () => {

    const aboutMeButton = document.querySelector(".intro-title .jump-link-btn");
    const target = document.querySelector(".homepage-section");

    aboutMeButton.addEventListener("click", (event) => {

        event.preventDefault();

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    });

    const revealEls = document.querySelectorAll(".reveal");

    if (revealEls.length === 0) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));

});