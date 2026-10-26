/**
 * The playground's cases: what each shows and what should happen, by package. The markup is in
 * `components/playground/<Package>Cases.astro`, the behavior in `playground/<package>.ts`, both
 * by the same id. Plain data: the page reads it on the server for the list.
 */
export type CaseMeta = {
  id: string;
  pkg: "blur" | "morph" | "indicator" | "drag" | "lift";
  title: string;
  tags: string[];
  /** What should happen: what to look for, and what would be a bug */
  expect: string;
  /** The steps the step bar runs in turn; none for a case that's only played with */
  steps: string[];
};

export const PACKAGES = [
  ["blur", "Blur"],
  ["morph", "Morph"],
  ["indicator", "Indicator"],
  ["drag", "Drag"],
  ["lift", "Lift"],
] as const;

export const CASES: CaseMeta[] = [
  // ── Blur ──
  {
    id: "blur-dock",
    pkg: "blur",
    title: "Group: split and dock",
    tags: ["group", "melt", "spring"],
    expect:
      "The search button slides out of the bar and back on a bouncy spring. The glass necks between them, parts and melts back together: one surface, never a darker overlap where two panes would blur twice.",
    steps: ["Split", "Dock"],
  },
  {
    id: "blur-stretch",
    pkg: "blur",
    title: "Group: stretch",
    tags: ["group", "stretch", "press"],
    expect:
      "Press and drag any piece: it stretches after the pointer and the group's glass follows it, necks and all. Let go, it springs back without leaving a seam.",
    steps: [],
  },
  {
    id: "blur-drops",
    pkg: "blur",
    title: "Group: drops",
    tags: ["group", "drag"],
    expect:
      "Drag a drop toward the pill: it necks to it from a distance and melts in. Let go and it springs home, parting cleanly.",
    steps: [],
  },
  {
    id: "blur-scroll",
    pkg: "blur",
    title: "Glass over scrolling content",
    tags: ["scroll", "sticky"],
    expect:
      "A glass bar stuck to the top of a list blurs what scrolls under it. No seams or flashes at its edges while it scrolls, at either end.",
    steps: ["Scroll down", "Scroll up"],
  },
  {
    id: "blur-edge",
    pkg: "blur",
    title: "Scroll edges",
    tags: ["lb-edge", "scroll"],
    expect:
      "Content fades out toward the top and bottom edges. At the start there's no fade at the top, at the end none at the bottom; in between, both.",
    steps: ["To the end", "To the start"],
  },
  {
    id: "blur-lens",
    pkg: "blur",
    title: "Lens",
    tags: ["lb-lens", "transition"],
    expect:
      "The thumb turns from frosted glass into a clear lens and back, its rims and volume kept: the stripes under it go sharp, not hidden.",
    steps: ["Lens", "Glass"],
  },
  {
    id: "blur-clipped",
    pkg: "blur",
    title: "Under a rounded clip",
    tags: ["overflow", "radius", "safari"],
    expect:
      "Glass moving inside a parent with overflow: hidden and rounded corners stays clipped to the corners. Not a square corner, and no blurred rectangle around it.",
    steps: ["Move", "Back"],
  },
  {
    id: "blur-variants",
    pkg: "blur",
    title: "Clear, tinted, interactive",
    tags: ["lb-clear", "lb-tinted", "lb-interactive"],
    expect:
      "Three buttons: clear glass for photos, glass tinted with --lb-tint, and the usual interactive glass. Pressed, each swells and highlights where it's pressed.",
    steps: [],
  },

  // ── Morph ──
  {
    id: "morph-corner",
    pkg: "morph",
    title: "Corner menu",
    tags: ["reference", "menu"],
    expect:
      "The reference: the button swells right and down into the menu, its glass the same glass all the way. Closing, the menu shrinks back into the button, the plus icon flying into its place.",
    steps: ["Open", "Close", "Interrupt"],
  },
  {
    id: "morph-upward",
    pkg: "morph",
    title: "Upward",
    tags: ["anchor"],
    expect:
      "Anchored at the bottom right, it grows up and left, the content scaling from that corner. No jump at the start or the end.",
    steps: ["Open", "Close", "Interrupt"],
  },
  {
    id: "morph-capsule",
    pkg: "morph",
    title: "Capsule with a label",
    tags: ["match", "label"],
    expect:
      "A capsule opens into its options. Pick one: the menu shrinks back and the button comes back with the new label, the picked label flying into it.",
    steps: ["Open", "Close", "Interrupt"],
  },
  {
    id: "morph-field",
    pkg: "morph",
    title: "Into a field",
    tags: ["shape", "input"],
    expect:
      "A circle grows into a long capsule anchored on the right, the field focused once it's there. Enter or Escape closes it back into the circle.",
    steps: ["Open", "Close", "Interrupt"],
  },
  {
    id: "morph-group",
    pkg: "morph",
    title: "In a group",
    tags: ["group", "melt"],
    expect:
      "Melted into the dock, it pours up out of it, parts from the bar and grows; closing, it melts back. One surface the whole way, no double blur where it meets the bar.",
    steps: ["Open", "Close", "Interrupt"],
  },
  {
    id: "morph-over-group",
    pkg: "morph",
    title: "Over the group",
    tags: ["group", "overlap"],
    expect:
      "It covers the bar: it lifts out of the group as glass of its own, the bar blurred beneath it, and settles back into the group when closed.",
    steps: ["Open", "Close", "Interrupt"],
  },
  {
    id: "morph-squircle",
    pkg: "morph",
    title: "Squircles",
    tags: ["corner-shape"],
    expect:
      "Left, a squircle into a squircle; right, a round button into a squircle. Where corner-shape isn't drawn, both are round, and still no jump at either end.",
    steps: ["Open", "Close", "Interrupt"],
  },
  {
    id: "morph-far",
    pkg: "morph",
    title: "Far",
    tags: ["clear", "flight"],
    expect: "Clear glass with no overlap between the two: the shape flies across the scene and lands exactly.",
    steps: ["Open", "Close", "Interrupt"],
  },
  {
    id: "morph-edges",
    pkg: "morph",
    title: "Edges",
    tags: ["size", "tinted"],
    expect:
      "Left, a panel barely bigger than its button; right, a tall, narrow, tinted one. Both land without a jump in size or corners.",
    steps: ["Open", "Close", "Interrupt"],
  },

  // ── Indicator ──
  {
    id: "indicator-menu",
    pkg: "indicator",
    title: "Menu: separator and disabled",
    tags: ["hover", "separator", "disabled"],
    expect:
      "Item to item in a few frames, never in between. Over the separator it stays put; over the disabled item it goes away, fading where it was.",
    steps: ["Love", "Copy Link", "Show in Store", "Away"],
  },
  {
    id: "indicator-tabs",
    pkg: "indicator",
    title: "Tabs",
    tags: ["press", "rest"],
    expect:
      "The thumb rests on the chosen tab and flies to the next. Pressed and dragged across, it follows the pointer; released, that tab is chosen.",
    steps: ["Releases", "Audience", "Overview"],
  },
  {
    id: "indicator-grow",
    pkg: "indicator",
    title: "A tab that grows",
    tags: ["resize", "torph"],
    expect:
      "A count rolls up in the chosen tab and the tab grows with it; the thumb resting on it keeps to it frame by frame, not a spring behind.",
    steps: ["New mail", "Read all"],
  },
  {
    id: "indicator-scaled",
    pkg: "indicator",
    title: "In a scaled container",
    tags: ["transform", "scale"],
    expect:
      "The menu is scaled down by its container's transform. The highlight still lands exactly on each item, at the menu's size, not the unscaled one.",
    steps: ["Albums", "Artists", "Songs", "Away"],
  },
  {
    id: "indicator-sweep",
    pkg: "indicator",
    title: "Swept past",
    tags: ["interrupt", "presence"],
    expect:
      "A pointer sweeps over every item and off: the highlight doesn't trail through all of them; it fades out on the last item it was over.",
    steps: ["Sweep"],
  },

  // ── Drag ──
  {
    id: "drag-snap",
    pkg: "drag",
    title: "Snap points",
    tags: ["snap", "flick"],
    expect:
      "The card settles on the nearest snap point, or on the one a flick would slide to. Caught on its way, it moves from where it was caught.",
    steps: ["Middle", "Right", "Left"],
  },
  {
    id: "drag-bounds",
    pkg: "drag",
    title: "Bounds and rubber",
    tags: ["bounds", "rubberband"],
    expect:
      "Free in both directions inside the frame. Pulled past an edge it resists, as iOS's rubber band does, and springs back in when let go.",
    steps: [],
  },
  {
    id: "drag-switch",
    pkg: "drag",
    title: "Switch",
    tags: ["snap", "tap"],
    expect: "A tap flips it; dragged, the knob follows and snaps to the side it's let go nearer, or flicked toward.",
    steps: ["On", "Off"],
  },
  {
    id: "drag-sheet",
    pkg: "drag",
    title: "Sheet with a list",
    tags: ["scroll", "handoff"],
    expect:
      "Pulled up, the sheet rises to its full height and the list scrolls from there. Scrolled to its top and pulled down, the list hands the drag back to the sheet, which goes down with it.",
    steps: ["Full", "Half", "Down"],
  },
  {
    id: "drag-nested",
    pkg: "drag",
    title: "Nested handles",
    tags: ["nested", "axis"],
    expect:
      "A slider on a card that moves sideways: the slider's thumb takes its own drag, the card everything else. One drag never moves both.",
    steps: [],
  },

  // ── Lift ──
  {
    id: "lift-below",
    pkg: "lift",
    title: "Menu below",
    tags: ["placement", "press"],
    expect:
      "Held for half a second (or right-clicked), the photo lifts above everything, the page dimmed and blurred behind it, and the menu opens under it (over it on a screen too short for it under).",
    steps: ["Lift", "Close"],
  },
  {
    id: "lift-above",
    pkg: "lift",
    title: "Menu above",
    tags: ["placement"],
    expect: "Near the bottom of the screen, with no room under it, the menu opens over the element.",
    steps: ["Lift", "Close"],
  },
  {
    id: "lift-edges",
    pkg: "lift",
    title: "At the edges",
    tags: ["placement", "alignment"],
    expect:
      "The menu goes on the element's side of the screen: left-aligned with one at the left edge, right-aligned with one at the right, and never past the screen's margins.",
    steps: ["Left", "Close", "Right", "Close"],
  },
  {
    id: "lift-tall",
    pkg: "lift",
    title: "Moved up for its menu",
    tags: ["placement", "shift"],
    expect:
      "Asked to open below (placement: below) at the bottom of the screen, with no room there: the element moves up for the menu, as in iOS, and settles back down when it closes.",
    steps: ["Lift", "Close"],
  },
  {
    id: "lift-message",
    pkg: "lift",
    title: "A message",
    tags: ["copy", "press", "safari"],
    expect:
      "Hold a bubble: it gives a little, then lifts. Its copy is the same size as the bubble, its text on one line as it was, with reactions over the actions.",
    steps: ["Lift", "Close"],
  },
  {
    id: "lift-preview",
    pkg: "lift",
    title: "A bigger preview",
    tags: ["preview"],
    expect:
      "A link lifts a preview of its page, bigger than the link: it grows out of the link at its own size, centered on it and kept on screen, and shrinks back into the link when it closes.",
    steps: ["Lift", "Close"],
  },
  {
    id: "lift-keys",
    pkg: "lift",
    title: "From the keyboard",
    tags: ["keyboard", "a11y", "disabled"],
    expect:
      "Opened by a key (or the step), the first item is focused. The arrow keys go through the items, past the disabled one, Home and End to the ends; PageDown doesn't scroll the page. Escape closes it and focus goes back where it was before it opened.",
    steps: ["Open"],
  },
  {
    id: "lift-page-scrolls",
    pkg: "lift",
    title: "The page scrolls while it's open",
    tags: ["scroll", "close"],
    expect:
      "Lifted, then its page is scrolled from outside (as by its scrollbar), and closed while a smooth scroll still runs: the photo settles back where the element is, following it, not where it was, and the element shows without a jump.",
    steps: ["Lift, scroll, close"],
  },
  {
    id: "lift-live",
    pkg: "lift",
    title: "A copy changes nothing",
    tags: ["copy", "form", "iframe"],
    expect:
      "A card with a checked radio and a frame lifts as a picture: the radio stays checked in the page, and the frame isn't loaded again (an empty box in the copy).",
    steps: ["Lift", "Close"],
  },
  {
    id: "lift-one-at-a-time",
    pkg: "lift",
    title: "One at a time",
    tags: ["modal"],
    expect:
      "One lift opens, then another while it's open: the first closes at once and the second lifts. Never two dims.",
    steps: ["One, then the other"],
  },
  {
    id: "lift-scrolled",
    pkg: "lift",
    title: "In a scrolled list",
    tags: ["scroll", "modal"],
    expect:
      "An element inside a scrolled list lifts from exactly where it's drawn, and the list doesn't scroll under the open menu.",
    steps: ["Scroll", "Lift", "Close"],
  },
];
