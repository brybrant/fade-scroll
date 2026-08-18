/** Feature detection: `true` if `ResizeObserver` API exists */
const nativeResizeObserver: boolean =
  typeof window !== 'undefined' && 'ResizeObserver' in window;

export let ResizeObserverClass = nativeResizeObserver ? ResizeObserver : null;

/**
 * Set the `ResizeObserver` polyfill
 * @param polyfill User provided polyfill for `ResizeObserver` API
 */
export function setResizeObserver(polyfill: typeof ResizeObserver) {
  if (nativeResizeObserver) return;
  ResizeObserverClass = polyfill;
}
