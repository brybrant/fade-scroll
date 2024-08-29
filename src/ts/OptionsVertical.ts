import type { Options } from './FadeScroller';
import type { Vertical } from './FadeScrollerVertical';

/** Vertical Fade Scroll options object */
export interface FadeScrollOptionsV extends Options {
  /** Hide the scrollbar? */
  hideScrollbar: boolean;
}

/**
 * Create Vertical options object
 * @access private
 */
export function optionsVertical(fs: Vertical): FadeScrollOptionsV {
  return Object.seal({
    _hideScrollbar: false,
    get hideScrollbar() {
      return this._hideScrollbar;
    },
    set hideScrollbar(bool: boolean) {
      this._hideScrollbar = Boolean(bool);

      fs.scrollBar.style.width = this._hideScrollbar
        ? `calc(100% + ${fs.wrapper.offsetWidth - fs.content.offsetWidth}px)`
        : '';
    },
  });
}
