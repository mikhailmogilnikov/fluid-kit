import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** One page per package: `src/content/docs/blur.mdx` is /blur */
const docs = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/docs" }),
  schema: z.object({
    /** The package, as installed */
    package: z.string(),
    /** Its name in the nav and the page title */
    name: z.string(),
    /** One sentence for search results and link previews */
    description: z.string(),
    /** The page's opening, under its title; inline HTML */
    intro: z.string(),
    /** Order in the nav */
    order: z.number(),
    /** What React gets on this page, in a line under the framework switch; inline HTML */
    react: z.string().optional(),
  }),
});

export const collections = { docs };
