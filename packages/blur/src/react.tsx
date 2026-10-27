"use client";

/**
 * Liquid Blur for React: `<Glass>`, glass with its variants as props, and `<Glass.Group>`, glass
 * that melts between its children.
 *
 *   <Glass render={<button />} interactive tint="#0a84ff">Follow</Glass>
 *   <Glass.Group className="toolbar">
 *     <Glass>…</Glass>
 *     <Glass interactive render={<button />}>…</Glass>
 *   </Glass.Group>
 *
 * The material is the stylesheet's (`@fluidkit/blur/style.css`, imported once): `<Glass>` is its
 * classes and custom properties, written for you. A press prop installs press on its document the
 * first time it's there, nothing to set up at the root; glass with press classes of your own takes
 * `usePress()`. A group is made once its root is in the page and let go of when it goes.
 */
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefCallback,
} from "react";
import { useAttach, useMergedRefs, renderPart, type RenderProp } from "@fluidkit/core/react";
import { createGlassGroup, type GlassGroup } from "./group";
import { installPress } from "./interaction";

/** Press installed on the document from an effect: the same install however many ask for it */
export function usePress() {
  useEffect(() => {
    installPress();
  }, []);
}

export type GlassVariants = {
  /** Clear, for glass over photos and video: at least transparency 1 (`lb-clear`) */
  clear?: boolean;
  /** Its fill is a color: this one, or `--lb-tint` as inherited with `true` (`lb-tinted`) */
  tint?: boolean | string;
  /** A lens: the same glass with no blur, as a held thumb is in iOS (`lb-lens`) */
  lens?: boolean;
  /** 0 opaque, 0.5 the default, 1 clear: fill and blur together (`--lb-transparency`) */
  transparency?: number;
  /** 0 flat, 0.5 the default, 1 pronounced: shade, glow and rims (`--lb-depth`) */
  depth?: number;
  /** Highlight, swell and stretch, the usual set for a button, chip or icon (`lb-interactive`) */
  interactive?: boolean;
  /** Lights up where it's pressed (`lb-highlight`) */
  highlight?: boolean;
  /** Grows while it's pressed, more the smaller it is (`lb-swell`) */
  swell?: boolean;
  /** Pulls toward the finger and stretches along the drag; along `x` or `y` alone if given (`lb-stretch`) */
  stretch?: boolean | "x" | "y";
};

/** The classes and custom properties for these variants: for glass that isn't `<Glass>` */
export function glass(variants: GlassVariants = {}): { className: string; style: CSSProperties } {
  const { clear, tint, lens, transparency, depth, interactive, highlight, swell, stretch } = variants;
  const classes = ["lb"];
  if (clear) classes.push("lb-clear");
  if (tint) classes.push("lb-tinted");
  if (lens) classes.push("lb-lens");
  if (interactive) classes.push("lb-interactive");
  if (highlight) classes.push("lb-highlight");
  if (swell) classes.push("lb-swell");
  if (stretch) classes.push("lb-stretch");
  const style: Record<string, string | number> = {};
  if (typeof tint === "string") style["--lb-tint"] = tint;
  if (transparency !== undefined) style["--lb-transparency"] = transparency;
  if (depth !== undefined) style["--lb-depth"] = depth;
  if (stretch === "x" || stretch === "y") style["--lb-stretch-axis"] = stretch;
  return { className: classes.join(" "), style };
}

/** Whether any of these needs press */
const presses = ({ interactive, highlight, swell, stretch }: GlassVariants) =>
  !!(interactive || highlight || swell || stretch);

type PartProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  /** Render as an element of yours, or a function of the props; a `div` unless given */
  render?: RenderProp<Record<string, never>>;
  children?: ReactNode;
};

export type GlassProps = PartProps & GlassVariants;

/** Glass: a `div` unless rendered as something else, its variants as props, your classes and styles kept */
const Root = forwardRef<HTMLElement, GlassProps>(function Glass(props, ref) {
  const { clear, tint, lens, transparency, depth, interactive, highlight, swell, stretch, render, ...rest } = props;
  const variants = { clear, tint, lens, transparency, depth, interactive, highlight, swell, stretch };
  const own = useRef<HTMLElement | null>(null);
  const pressed = presses(variants);
  // Press on its own document, an iframe's too, the first time glass there needs it
  useEffect(() => {
    if (pressed && own.current) installPress(own.current.ownerDocument);
  }, [pressed]);
  const merged = useMergedRefs(own, ref);
  const { className, style } = glass(variants);
  return renderPart(
    "div",
    {
      ...rest,
      ref: merged,
      className: [className, rest.className].filter(Boolean).join(" "),
      style: { ...style, ...rest.style },
    },
    render,
    {},
  );
});

export type UseGlassGroup = {
  /** The ref for the group's root, written `lb lb-group` */
  root: RefCallback<HTMLElement>;
  /** The group, once its root is in the page: `update()` it after something it can't see moves a child */
  group: GlassGroup | null;
};

/** A glass group on a root of yours, made once it's in the page and let go of when it goes */
export function useGlassGroup(): UseGlassGroup {
  const [group, setGroup] = useState<GlassGroup | null>(null);
  const root = useAttach<HTMLElement>((el) => {
    const made = createGlassGroup(el);
    setGroup(made);
    return () => {
      made.destroy();
      setGroup(null);
    };
  });
  return { root, group };
}

export type GlassGroupProps = PartProps &
  Pick<GlassVariants, "transparency" | "depth"> & {
    /** How close children come before they melt, px: 18 unless given (`--lb-merge`) */
    merge?: number;
  };

/**
 * Glass that melts between its children where they come close: a `div` unless rendered as
 * something else, written `lb lb-group`. Its children are glass, `<Glass>` or `lb`
 */
const Group = forwardRef<HTMLElement, GlassGroupProps>(function GlassGroupRoot(
  { transparency, depth, merge, render, ...rest },
  ref,
) {
  const { root } = useGlassGroup();
  const merged = useMergedRefs(root, ref);
  const style: Record<string, string | number> = {};
  if (transparency !== undefined) style["--lb-transparency"] = transparency;
  if (depth !== undefined) style["--lb-depth"] = depth;
  if (merge !== undefined) style["--lb-merge"] = `${merge}px`;
  return renderPart(
    "div",
    {
      ...rest,
      ref: merged,
      className: ["lb lb-group", rest.className].filter(Boolean).join(" "),
      style: { ...style, ...rest.style },
    },
    render,
    {},
  );
});

/** Glass, and `Glass.Group` for glass that melts */
export const Glass = Object.assign(Root, { Group });
