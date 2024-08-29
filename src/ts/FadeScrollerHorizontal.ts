import type { Options } from './FadeScroller';
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
  /** - Options object */
  readonly options: FadeScrollOptionsH;

  /** - Class if `scrollPosition > 0` */
  readonly _fadeStart: 'left-overflow';

  /** - Class if `scrollPosition < overflowSize` */
  readonly _fadeEnd: 'right-overflow';

  /** Creates a Horizontal Fade Scroller */
  constructor(selector: HTMLElement | string, options?: Options) {
    super(selector);

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
