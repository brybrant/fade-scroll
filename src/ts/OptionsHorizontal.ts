import type { Options } from './FadeScroller';
import type { Horizontal } from './FadeScrollerHorizontal';

/** Horizontal Fade Scroll options object */
export interface FadeScrollOptionsH extends Options {
  /**
   * Hide the scrollbar?
   * @default false
   */
  hideScrollbar: boolean;

  /**
   * Enable mousewheel event capture?
   * @default false
   */
  captureWheel: boolean;
}

/**
 * Create Horizontal options object
 * @access private
 */
export function optionsHorizontal(fs: Horizontal): FadeScrollOptionsH {
  return Object.seal({
    _hideScrollbar: false,
    get hideScrollbar() {
      return this._hideScrollbar;
    },
    set hideScrollbar(bool: boolean) {
      this._hideScrollbar = Boolean(bool);

      fs.wrapper.style.height = bool ? `${fs.content.offsetHeight}px` : '';
    },
    _captureWheel: false,
    get captureWheel() {
      return this._captureWheel;
    },
    set captureWheel(bool: boolean) {
      this._captureWheel = Boolean(bool);

      fs.scrollBar.onwheel = bool ? fs.wheelListener : null;
    },
  });
}
