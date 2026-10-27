/** The same, for settings: plain objects and arrays by what's in them, the rest by identity */
const same = (a: unknown, b: unknown) =>
  Object.is(a, b) ||
  (typeof a === "object" &&
    typeof b === "object" &&
    a !== null &&
    b !== null &&
    (Array.isArray(a) || Object.getPrototypeOf(a) === Object.prototype) &&
    JSON.stringify(a) === JSON.stringify(b));

/** The settings that changed since `before`, for an engine's `set()`; `null` when none did */
export function changed<S extends object>(before: S | null, settings: S): Partial<S> | null {
  const next: Partial<S> = {};
  let any = false;
  for (const key of Object.keys(settings) as Array<keyof S>) {
    if (!before || !same(before[key], settings[key])) {
      next[key] = settings[key];
      any = true;
    }
  }
  return any ? next : null;
}
