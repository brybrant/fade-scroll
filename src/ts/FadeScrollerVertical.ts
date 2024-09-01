import type { FadeScrollOptionsV } from './OptionsVertical';

import {
  FadeScroller,
  setOptions,
  smoothScrollSupported,
} from './FadeScroller';
import { optionsVertical } from './OptionsVertical';

/**
 * Vertical Fade Scroller
 * @access public
 */
export class Vertical extends FadeScroller {
  readonly options: FadeScrollOptionsV;

  readonly _fadeStart: 'top-overflow';

  readonly _fadeEnd: 'bottom-overflow';

  /** Creates a Vertical Fade Scroller */
  constructor(element: HTMLElement | string, options?: FadeScrollOptionsV) {
    super(element);

    this.wrapper.classList.add('fade-scroll--vertical');

    this._fadeStart = 'top-overflow';
    this._fadeEnd = 'bottom-overflow';

    this.options = optionsVertical(this);

    if (options !== undefined) setOptions(this, options);
  }

  /** - Height of `content` element */
  public get contentSize() {
    return this.content.offsetHeight;
  }

  /** - Height of `wrapper` element */
  public get wrapperSize() {
    return this.wrapper.offsetHeight;
  }

  /** - `scrollTop` value of `scrollBar` element */
  public get scrollPosition() {
    return this.scrollBar.scrollTop;
  }

  /** - `scrollTop` value of `scrollBar` element */
  public set scrollPosition(number: number) {
    if (smoothScrollSupported) {
      this.scrollBar.scroll({
        top: number,
        behavior: 'smooth',
      });
    } else {
      this.scrollBar.scrollTop = number;
    }
  }

  public destroy() {
    this.scrollBar.removeEventListener('scroll', this.scrollListener);
    this.wrapper.classList.remove(this._fadeStart, this._fadeEnd);
    this._observer.disconnect();
  }
}
