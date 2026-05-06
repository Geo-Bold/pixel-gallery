# Geo's Stash

My personal portfolio, hosted at [geobold.dev](https://geobold.dev). It's a small, hand-rolled site - no framework on the front, no build step, no bundler. Plain HTML, CSS and JavaScript modules, served as static files from GitHub Pages.

## What's here

- **Home** - a hero with a soft per-character blur-in on the title, a short about section, and a footer that nudges you toward the contact page.
- **Portfolio** - case studies for the projects I want to talk about. Each one has its own page with the background, the technical highlights, and what I'd do differently.
- **Contact** - a form that goes to my inbox.

## How it's built

The styling sits on top of [Bulma](https://bulma.io/) for the layout primitives and a single `styles.css` for everything custom - colors, typography, the showcase shapes behind the portfolio thumbnails, the wavy clip-path on the hero. Fonts are Ibarra Real Nova for headings and Public Sans for body, both pulled from Google Fonts.

The JavaScript is a handful of small modules under `src/logic/`. `script.js` handles the responsive nav, `homepage-scroll.js` runs the scroll-reveal observer for the about section, `soft-blur-in.js` is the WAAPI per-character animation on the hero accent word, and `form-validation.js` validates the contact form before sending. No framework, no virtual DOM. If a piece of behavior needed React I'd reach for it - none of this did.

The contact form goes through [EmailJS](https://www.emailjs.com/), which lets a static site send mail without a backend. The form posts directly from the browser; EmailJS proxies it to my inbox.

Each portfolio project lives as a git submodule under `projects/`, so the parent repo stays small and the project repos stay independent.

## Folder layout

```
contact/              Contact page
portfolio/            Portfolio index and per-project pages
projects/             Submoduled project repos
src/
  assets/             Images, brand marks, icons
  logic/              Vanilla JS modules
  styles/             styles.css
index.html            Home
CNAME                 geobold.dev
```

## Running it locally

There's nothing to install or build. Open `index.html` in a browser, or serve the folder with anything that handles static files - `python -m http.server`, `npx serve`, the VS Code Live Server extension, whatever you have.

## Contact

If you want to reach me, the [contact page](https://geobold.dev/contact) is the right door. I read everything.
