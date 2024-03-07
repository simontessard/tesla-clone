import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let panels = gsap.utils.toArray(".js-card");
// we'll create a ScrollTrigger for each panel just to track when each panel's top hits the top of the viewport (we only need this for snapping)
let tops = panels.map(panel => ScrollTrigger.create({trigger: panel, start: "top top"}));

panels.forEach((panel, i) => {
    ScrollTrigger.create({
        trigger: panel,
        start: () => panel.offsetHeight < window.innerHeight ? "top top" : "bottom bottom", // if it's shorter than the viewport, we prefer to pin it at the top
        pin: true,
        pinSpacing: false
    });

    let textCard = panel.querySelector(".js-text-card");
    if (textCard) {
        gsap.from(textCard, {
            scrollTrigger: {
                trigger: panel, // L'animation se déclenche en fonction du panel
                start: "top center", // L'animation se déclenche lorsque le haut du panel atteint le milieu de la fenêtre de visualisation
            },
            autoAlpha: 0,
            duration: 2,
        });
    }
});

ScrollTrigger.create({
    snap: {
        snapTo: (progress, self) => {
            let panelStarts = tops.map(st => st.start),
                snapScroll = gsap.utils.snap(panelStarts, self.scroll());
            return gsap.utils.normalize(0, ScrollTrigger.maxScroll(window), snapScroll);
        },
        duration: 0.3
    }
});
