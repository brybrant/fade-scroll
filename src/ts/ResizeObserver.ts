/** @access private */
class FauxResizeObserver {
  private _request: number;

  protected readonly _callback: FrameRequestCallback;

  constructor(callback: FrameRequestCallback) {
    this._request = 0;
    this._callback = callback;
  }

  disconnect() {}

  observe() {
    window.cancelAnimationFrame(this._request);
    this._request = window.requestAnimationFrame(this._callback);
  }

  unobserve() {}
}

/** @access private */
const resizeObserverSupported: boolean = 'ResizeObserver' in window;

/** @access private */
export let resizeObserver = (function () {
  if (resizeObserverSupported) return window.ResizeObserver;

  return FauxResizeObserver;
})();

/**
 * Set the ResizeObserver polyfill
 * @access public
 */
export function setResizeObserver(polyfill: ResizeObserver) {
  if (resizeObserverSupported) return;
  if (typeof polyfill === 'function') resizeObserver = polyfill;
}
