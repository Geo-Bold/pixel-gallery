document.addEventListener("DOMContentLoaded", () => {
  const PROJECTS = [
    {
      slug: "qrum",
      title: "Qrum",
      tag: "Case Study",
      month: "SUMMER",
      year: "2026",
      blurb:
        "A volunteer and event manager with robust search built on Elasticsearch. This allows ranking a million events by distance, time, and typos in less than 20ms",
      href: "./qrum/",
      ctaLabel: "View Case Study",
      external: false,
      artImage: "../src/assets/images/qrum-showcase.png",
    },
    {
      slug: "procecs",
      title: "ProcECS Engine",
      tag: "Case Study",
      month: "FALL",
      year: "2025",
      blurb:
        "A product integrated with SAP to help businesses with warehouse management, quoting, technician scheduling and more. Currently deployed across 10+ organizations.",
      href: "./procecs/",
      ctaLabel: "View Case Study",
      external: false,
      artImage: "../src/assets/images/procecs-engine-showcase.png",
    },
    {
      slug: "link-share",
      title: "Link-Share",
      tag: "Project",
      month: "SPRING",
      year: "2024",
      blurb:
        "A multi-page app for gathering and sharing social links behind one profile, built with vanilla JS, HTML and CSS with Supabase for client-side routing.",
      href: "../projects/link-share/",
      ctaLabel: "View Project",
      external: true,
      artImage: "../src/assets/images/image-portfolio-link-share.png",
    },
    {
      slug: "arch-studio",
      title: "Arch Studio",
      tag: "Project",
      month: "FALL",
      year: "2023",
      blurb:
        "A sleek and minimalistic proof of concept portfolio for an architecture studio. Crafted with 1200 lines of hand-rolled CSS.",
      href: "../projects/arch-studio/",
      ctaLabel: "View Project",
      external: true,
      artImage: "../src/assets/images/image-portfolio-arch-studio.jpg",
    },
  ];

  const root = document.getElementById("portfolioHero");
  if (!root) return;

  root.innerHTML = `
        <div class="hero-copy">
          <p class="hero-date">
            <span class="yr" id="heroYear">${PROJECTS[0].year}</span>
            <span class="sep">·</span>
            <span class="eyebrow" id="heroTag">${PROJECTS[0].tag}</span>
          </p>
          <h1 id="heroTitle">${PROJECTS[0].title}</h1>
          <p class="hero-blurb" id="heroBlurb">${PROJECTS[0].blurb}</p>
          <a class="hero-cta" id="heroCta" href="${PROJECTS[0].href}">
              <span>${PROJECTS[0].ctaLabel}</span>
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
                  <path d="M8 1l5 5-5 5M0.5 6h12" stroke="currentColor" stroke-width="1.4" />
              </svg>
          </a>
        </div>
        <div class="hero-stage">
            <nav class="hero-rail" role="tablist" aria-label="Browse projects by ship date" id="heroRail"></nav>
            <div class="hero-art-wrap">
                <div class="hero-art" id="heroPanel" role="tabpanel" aria-labelledby="tab-${PROJECTS[0].slug}"></div>
            </div>
        </div>
    `;

  const heroYear = document.getElementById("heroYear");
  const heroTag = document.getElementById("heroTag");
  const heroTitle = document.getElementById("heroTitle");
  const heroBlurb = document.getElementById("heroBlurb");
  const heroCta = document.getElementById("heroCta");
  const heroArt = document.getElementById("heroPanel");
  const rail = document.getElementById("heroRail");

  const tabs = PROJECTS.map((project, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.id = `tab-${project.slug}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", index === 0 ? "true" : "false");
    tab.setAttribute("aria-controls", "heroPanel");
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.innerHTML = `
          <span class="date">
          <span class="mon">${project.month}</span>
          <span class="yr">${project.year}</span>
          </span>
          <span class="tick"></span>
        `;
    tab.addEventListener("click", () => setActive(index, true));
    tab.addEventListener("keydown", (event) => handleKey(event, index));
    rail.appendChild(tab);
    return tab;
  });

  function handleKey(event, index) {
    const isHorizontal = window.matchMedia("(max-width: 950px)").matches;
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    let target = null;

    if (event.key === nextKey) target = (index + 1) % PROJECTS.length;
    else if (event.key === prevKey)
      target = (index - 1 + PROJECTS.length) % PROJECTS.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = PROJECTS.length - 1;
    else return;

    event.preventDefault();
    setActive(target, true);
  }

  function setActive(index, moveFocus) {
    const project = PROJECTS[index];

    heroYear.textContent = project.year;
    heroTag.textContent = project.tag;
    heroTitle.textContent = project.title;
    heroBlurb.textContent = project.blurb;
    heroCta.href = project.href;
    heroCta.querySelector("span").textContent = project.ctaLabel;
    heroArt.setAttribute("aria-labelledby", `tab-${project.slug}`);

    if (project.external) {
      heroCta.setAttribute("target", "_blank");
      heroCta.setAttribute("rel", "noopener noreferrer");
    } else {
      heroCta.removeAttribute("target");
      heroCta.removeAttribute("rel");
    }

    heroArt.querySelectorAll("img").forEach((el) => el.remove());
    const artEl = document.createElement("img");
    artEl.src = project.artImage;
    artEl.alt = "";
    artEl.style.objectFit = project.artFit || "cover";
    heroArt.insertBefore(artEl, heroArt.firstChild);

    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    if (moveFocus) tabs[index].focus();
  }

  setActive(0, false);
});
