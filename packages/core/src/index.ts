/**
 * What the Fluid Kit packages share: the spring every moving part runs on, boxes read as the
 * browser draws them, the DOM attributes they recognize each other by, and dropping the click a
 * gesture would make. Nothing here touches the page by itself.
 */
export { SpringAnimator, type SpringConfig, type SpringParams } from "./springAnimator.js";
export {
  cornerOf,
  cornerShapeOf,
  drawsCornerShape,
  fitRadii,
  measureBox,
  px,
  radiiCss,
  radiiOf,
  still,
  type Box,
  type Radii,
} from "./box.js";
export { AWAY, PART, SURFACE } from "./contract.js";
export { swallowClick } from "./click.js";
