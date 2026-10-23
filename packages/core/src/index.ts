/**
 * What the Fluidkit packages share: the spring every moving part runs on, boxes read as the
 * browser draws them, and the DOM attributes they recognize each other by. Nothing here touches the
 * page by itself.
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
