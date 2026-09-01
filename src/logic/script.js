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

    // Builds the Table of Context from the content's own h2/h3 headings,
    // wires the CSS scrollspy (view-timelines) by heading position, and
    // runs it as an accordion: only the h2 section currently in view
    // keeps its h3 children expanded, every other section shows just
    // its heading. Adding a TOC entry is then a pure content change:
    // write an h2 or h3, nothing else needs touching.
    const tocBody = document.querySelector(".project-body");
    const tocNav = document.querySelector(".toc-nav");
    const content = document.querySelector(".project-body-background");
    const headings = content ? [...content.querySelectorAll("h2, h3")] : [];

    if (tocBody && tocNav && headings.length) {

        const slugify = (text) => text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

        const rootList = document.createElement("ul");

        let parentItem = null;

        let subList = null;

        const sections = [];

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
            link.textContent = heading.textContent.trim();

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

                item.classList.add("toc-parent");

                const partDivider = heading.closest(".part-divider");

                if (partDivider) {

                    item.classList.add("toc-part");

                    const overline = partDivider.querySelector(".part-overline");

                    if (overline) link.dataset.partLabel = overline.textContent.trim();

                }

                parentItem = item;

                subList = null;

                sections.push({ heading, item, link });

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

        let tocInteracting = false;

        let currentActive = null;

        const centerInToc = (link) => {

            const panelRect = tocNav.getBoundingClientRect();

            const linkRect = link.getBoundingClientRect();

            const delta = (linkRect.top + linkRect.height / 2) - (panelRect.top + panelRect.height / 2);

            tocNav.scrollTo({ top: tocNav.scrollTop + delta, behavior: "smooth" });

        };

        const setActiveSection = (activeHeading, { recenter = false, force = false } = {}) => {

            const changed = activeHeading !== currentActive;

            currentActive = activeHeading;

            sections.forEach(({ heading, item }) => {

                const sublist = item.querySelector(":scope > ul");

                if (!sublist) return;

                const isActive = heading === activeHeading;

                item.classList.toggle("is-expanded", isActive);

                sublist.style.maxHeight = isActive ? `${sublist.scrollHeight}px` : "0px";

                sublist.inert = !isActive;

            });

            if (recenter && (changed || force) && activeHeading && !tocInteracting) {

                const active = sections.find((section) => section.heading === activeHeading);

                if (active) centerInToc(active.link);

            }

        };

        tocNav.addEventListener("mouseenter", () => { tocInteracting = true; });

        tocNav.addEventListener("mouseleave", () => {

            tocInteracting = false;

            setActiveSection(currentActive, { recenter: true, force: true });

        });

        const findActiveSection = () => {

            const threshold = window.innerHeight * 0.25;

            let current = null;

            for (const { heading } of sections) {

                if (heading.getBoundingClientRect().top <= threshold) {

                    current = heading;

                } else {

                    break;

                }

            }

            return current;

        };

        let ticking = false;

        document.addEventListener("scroll", () => {

            if (ticking) return;

            ticking = true;

            requestAnimationFrame(() => {

                setActiveSection(findActiveSection(), { recenter: true });

                ticking = false;

            });

        }, { passive: true });

        sections.forEach(({ heading, link }) => {

            link.addEventListener("click", () => setActiveSection(heading));

        });

        setActiveSection(findActiveSection());

    }

});