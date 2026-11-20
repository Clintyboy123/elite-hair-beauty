// The site's motion language, defined once so every animation shares the same timing and easing.
// Keep in step with --ease-site / --default-transition-timing-function in styles/index.css.
//
// Spec: one sophisticated ease-out, cubic-bezier(0.16, 1, 0.3, 1) - a quicker, noticeable start that decelerates
// and glides gently into place, never stopping abruptly. Major animations (entrances, image reveals, text
// transitions, the hero, page reveals) run 4-6 seconds; because the curve front-loads the movement they land
// quickly and spend the rest settling. Direct UI feedback (hover, menus, tabs, header) uses the same curve but
// stays at 0.6-1.2 s so the site always feels responsive. Steps that block the next action stay under 1 s.
export const ease = [0.16, 1, 0.3, 1];

export const duration = {
  micro: 0.6, // hover, tap and small state feedback
  ui: 1.2, // menus, panels, tabs, header show/hide, filters
  major: 4, // scroll entrances, image reveals, text transitions
  prominent: 5, // hero type, section-defining moments
  cinematic: 6, // hero photographs
};

// Fade up into place: the default entrance for blocks of text.
export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.major, ease } },
};

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.major, ease } },
};

// Parent that makes its children arrive one after another.
export const stagger = (gap = 0.12, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

// A word of a heading rising out of its own mask.
export const lineUp = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: duration.major, ease } },
};

// An image card sliding up from below into place as it scrolls into view. No fade and no blur: the card is fully
// visible the whole way and simply rises 160px on the site's ease-out curve.
export const SLIDE_DISTANCE = 160;
export const floatUp = {
  hidden: { y: SLIDE_DISTANCE },
  visible: { y: 0, transition: { duration: duration.major, ease } },
};

// A photograph blurring into focus (the brand's "beauty, elevated" moment). The filter is removed afterwards
// so it costs nothing at rest.
export const blurIn = {
  hidden: { opacity: 0, filter: 'blur(24px)', scale: 1.08 },
  visible: { opacity: 1, filter: 'blur(0px)', scale: 1, transitionEnd: { filter: 'none' }, transition: { duration: 4.5, ease } },
};

// A hairline drawing across.
export const drawLine = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: duration.major, ease } },
};

export const withDelay = (variants, delay = 0) => ({
  ...variants,
  visible: { ...variants.visible, transition: { ...variants.visible.transition, delay } },
});

export const inViewOnce = { once: true, amount: 0.2 };
