document.addEventListener("DOMContentLoaded", () => {
    const target = document.querySelector(".intro-title h1 .accent-word");
    if (!target) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const text = target.textContent;
    const chars = Array.from(text);

    target.textContent = "";
    target.style.display = "inline-block";
    target.style.transformStyle = "preserve-3d";

    const host = target.closest(".intro-title");
    if (host) host.style.perspective = "900px";

    const SCALED_DURATION_MS = 648;
    const SCALED_STAGGER_MS = 18;
    const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
    const Y_FROM_PX = 16 * 0.58;
    const BLUR_FROM_PX = 12;
    const INITIAL_DELAY_MS = Math.random() * 400;

    const units = chars.map((ch) => {
        const span = document.createElement("span");
        span.className = "text-animation-unit";
        span.textContent = ch;
        span.style.display = "inline-block";
        span.style.whiteSpace = "pre";
        span.style.backfaceVisibility = "hidden";
        span.style.transformOrigin = "50% 55%";
        span.style.willChange = "transform, opacity, filter";
        span.style.opacity = "0";
        span.style.transform = `translate3d(0, ${Y_FROM_PX}px, 0)`;
        span.style.filter = `blur(${BLUR_FROM_PX}px)`;
        target.appendChild(span);
        return span;
    });

    units.forEach((span, index) => {
        span.animate(
            [
                { opacity: 0, transform: `translate3d(0, ${Y_FROM_PX}px, 0)`, filter: `blur(${BLUR_FROM_PX}px)` },
                { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0px)" }
            ],
            {
                delay: INITIAL_DELAY_MS + index * SCALED_STAGGER_MS,
                duration: SCALED_DURATION_MS,
                easing: EASING,
                fill: "forwards"
            }
        );
    });
});
