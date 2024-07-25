document.addEventListener("DOMContentLoaded", () => {
    
    // Toggles the state of the navbar menu.
    
    document.querySelector('.navbar-burger').addEventListener('click', () => {

        document.querySelector(".navbar-menu").classList.toggle('is-active');

        document.querySelector(".anchor").classList.toggle("active")

    })

    // Closes the burger menu when the user scrolls

    document.addEventListener("scroll", () => { 

        document.querySelector(".navbar-menu").classList.remove('is-active');

        document.querySelector(".anchor").classList.remove("active")

        document.querySelector(".ham").classList.remove("active")

    })

    // Calculates the main page hero's left padding according to its width between 58px and 190px.
    
    function resizeHeroTextPadding () {
        
        const heroImg = document.querySelector('.hero-img');
        
        const heroText = document.querySelectorAll('.hero-text');
        
        if (768 <= window.innerWidth  && heroImg.offsetWidth <= 1440) {
            
            const updatedWidth = ((heroImg.offsetWidth - 573) * 132 / 537) + 58;
            
            heroText.forEach((e) => {
                
                e.style.setProperty("--hero-img-width", `${updatedWidth}px`);
                
            })
            
        }
        
    }
    
    resizeHeroTextPadding();
    
    window.addEventListener('resize', () => resizeHeroTextPadding() )
    
    // Manages the pagination state for the home page hero. Events are only added if the window is a certain size.
    
    const paginationGroup = document.querySelectorAll('.pagination-link');

    if (window.innerWidth >= 1024) {

        paginationGroup.forEach((el) => {

            el.addEventListener('click', (e) => {
                
                // Update button
                
                const activePagination = document.querySelector('.is-current');

                if (el != activePagination) {

                    el.classList.add('is-current');

                    activePagination.classList.remove('is-current');
                    
                }
                
                // Update image
                
                const heroImageEl = document.getElementById('hero-img');

                heroImageEl.src = `../src/assets/home/desktop/image-hero-${el.dataset.portfolio}.jpg`;
                
                // Update text
                
                const heroTextDiv = document.querySelector('.hero-text');

                const title = heroTextDiv.querySelector('h2');

                const subtitle = heroTextDiv.querySelector('p');

                switch (el.dataset.portfolio) {
    
                    case "seraph":
                        
                        title.textContent = "Seraph Station";
                        
                        subtitle.textContent = "The Seraph Station project challenged us to design a unique station that would transport people through time. The result is a fresh and inspired by space stations.";
                        
                        subtitle.altTextContent = "A futuristic, well-lit hallway with a unique, wavy light strip running along the ceiling. The corridor has a clean, sleek design, and two people are walking in the distance.\n" +
                            "\n";
                        
                        break;
                        
                    case "federal":
                        
                        title.textContent = "Federal II Tower";
                        
                        subtitle.textContent = "A sequel theme project for a tower originally built in the 1800s. We achieved this with a striking look of brutal minimalism with modern touches.";
                        
                        subtitle.altTextContent = "A striking, upward view of a modern skyscraper with a series of parallel lines extending towards the sky, creating a sense of immense height and perspective.";
                        
                        break;
                    
                    case "trinity":
                        
                        title.textContent = "Trinity Bank Tower";
                        
                        subtitle.textContent = "Trinity Bank challenged us to make a concept for a 84 story building located in the middle of a city with a high earthquake frequency. For this project we used curves to blend design and stability to meet our objectives.";
                        
                        subtitle.altTextContent = "A dramatic shot of a high-rise building with a wavy facade. The building's exterior consists of a grid of reflective windows, giving it a modern, abstract appearance against a dark sky.";
                        
                        break;

                    case "paramour":
                        
                        title.textContent = "Project Paramour";
                        
                        subtitle.textContent = "Project made for an art museum near Southwest London. Project Paramour is a statement of bold, modern architecture.";
                        
                        subtitle.altTextContent = "A creative corner shot from below a bright blue structure with a three-dimensional pattern adorning the walls. A concrete supporting pillar can be seen.";
                        
                        break;

                }
            })

        })

    }
    
})
