import type { FadeScrollOptionsH } from './OptionsHorizontal';

import {
  FadeScroller,
  setOptions,
  smoothScrollSupported,
} from './FadeScroller';
import { optionsHorizontal } from './OptionsHorizontal';

/**
 * Horizontal Fade Scroller
 * @access public
 */
export class Horizontal extends FadeScroller {
  readonly options: FadeScrollOptionsH;

  readonly _fadeStart: 'left-overflow';

  readonly _fadeEnd: 'right-overflow';

  /** Creates a Horizontal Fade Scroller */
  constructor(element: HTMLElement | string, options?: FadeScrollOptionsH) {
    super(element);

    this.wrapper.classList.add('fade-scroll--horizontal');

    this._fadeStart = 'left-overflow';
    this._fadeEnd = 'right-overflow';

    this.options = optionsHorizontal(this);

    if (options !== undefined) setOptions(this, options);
  }

  /** Wheel event listener */
  public wheelListener = (event: WheelEvent) => {
    if (event.deltaY !== 0) {
      event.preventDefault();
      this.scrollBar.scrollLeft += event.deltaY;
    }
  };

  /** - Width of `content` element */
  public get contentSize() {
    return this.content.offsetWidth;
  }

  /** - Width of `wrapper` element */
  public get wrapperSize() {
    return this.wrapper.offsetWidth;
  }

  /** - `scrollLeft` value of `scrollBar` element */
  public get scrollPosition() {
    return this.scrollBar.scrollLeft;
  }

  /** - `scrollLeft` value of `scrollBar` element */
  public set scrollPosition(number: number) {
    if (smoothScrollSupported) {
      this.scrollBar.scroll({
        left: number,
        behavior: 'smooth',
      });
    } else {
      this.scrollBar.scrollLeft = number;
    }
  }

  public destroy() {
    this.scrollBar.removeEventListener('scroll', this.scrollListener);
    this.scrollBar.onwheel = null;
    this.wrapper.classList.remove(this._fadeStart, this._fadeEnd);
    this._observer.disconnect();
  }
}
