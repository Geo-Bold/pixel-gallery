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

    // Builds the Table of Context from the content's own h2/h3 headings
    // and wires the CSS scrollspy (view-timelines) by heading position.
    // Adding a TOC entry is then a pure content change: write an h2 or
    // h3, nothing else needs touching.
    const tocBody = document.querySelector(".project-body");
    const tocNav = document.querySelector(".toc-nav");
    const content = document.querySelector(".project-body-background");
    const headings = content ? [...content.querySelectorAll("h2, h3")] : [];

    if (tocBody && tocNav && headings.length) {

        const slugify = (text) => text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

        const rootList = document.createElement("ul");

        let parentItem = null;

        let subList = null;

        headings.forEach((heading) => {

            if (!heading.id) {

                const base = slugify(heading.textContent) || "section";

                let slug = base, n = 2;

                while (document.getElementById(slug)) slug = `${base}-${n++}`;

                heading.id = slug;

            }

            const link = document.createElement("a");
            link.className = "toc-link";
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;

            const item = document.createElement("li");

            item.appendChild(link);

            if (heading.tagName === "H3" && parentItem) {

                if (!subList) {

                    subList = document.createElement("ul");
                    parentItem.appendChild(subList);

                }

                subList.appendChild(item);

            } else {

                rootList.appendChild(item);

                parentItem = item;

                subList = null;

            }

        });

        tocNav.replaceChildren(rootList);

        const names = headings.map((_, i) => `--pt-${i + 1}`);

        const links = [...tocNav.querySelectorAll(".toc-link")];

        tocBody.style.setProperty("timeline-scope", names.join(", "));

        headings.forEach((heading, i) => heading.style.setProperty("view-timeline-name", names[i]));

        links.forEach((link, i) => {

            const next = names[i + 1];

            link.style.setProperty("animation-name", next ? "toc-on, toc-off" : "toc-on");

            link.style.setProperty("animation-timeline", next ? `${names[i]}, ${next}` : names[i]);
            
        });

    }

});