import type { Options } from './FadeScroller';
import type { Vertical } from './FadeScrollerVertical';

/** Vertical Fade Scroll options object */
export interface FadeScrollOptionsV extends Partial<Options> {
  /**
   * Hide the scrollbar?
   * @default false
   */
  hideScrollbar?: boolean;
}

/**
 * Create Vertical options object
 * @param {Vertical} fs
 * @access private
 */
export function optionsVertical(fs: Vertical): FadeScrollOptionsV {
  return Object.seal({
    _hideScrollbar: false as boolean,
    get hideScrollbar() {
      return this._hideScrollbar;
    },
    set hideScrollbar(bool: boolean) {
      this._hideScrollbar = bool;

      fs.scrollBar.style.width = this._hideScrollbar
        ? `calc(100% + ${fs.wrapper.offsetWidth - fs.content.offsetWidth}px)`
        : '';
    },
  });
}
