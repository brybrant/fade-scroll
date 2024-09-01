import type { FadeScrollOptionsH } from './OptionsHorizontal';
import type { FadeScrollOptionsV } from './OptionsVertical';
import type { Horizontal } from './FadeScrollerHorizontal';
import type { Vertical } from './FadeScrollerVertical';

import { resizeObserver } from './ResizeObserver';

export interface Options {
  [option: string]: unknown;
}

/**
 * Set the Fade Scroller options
 * @access private
 */
export function setOptions(fs: Horizontal | Vertical, options: Options) {
  if (!(Boolean(options) && options.constructor === Object)) return;

  for (const option of Object.keys(options)) {
    if (fs.options[option] === undefined) {
      console.warn(`FadeScroll: '${option}' is not a valid option`);
      continue;
    }

    fs.options[option] = options[option];
  }
}

/**
 * `true` if smooth scrolling is supported
 * @access private
 */
export const smoothScrollSupported: boolean =
  'scrollBehavior' in document.documentElement.style;

/**
 * Fade Scroller
 * @access private
 */
export abstract class FadeScroller {
  /** - Inner element (selected in constructor) */
  readonly content: HTMLElement;

  /** - Element with overflow (contains `content` element) */
  readonly scrollBar: HTMLDivElement;

  /** - Outer element (contains `scrollBar` element) */
  readonly wrapper: HTMLDivElement;

  /** - Resize Observer */
  protected readonly _observer: ResizeObserver;
  
  /** - Options object */
  abstract readonly options: FadeScrollOptionsH | FadeScrollOptionsV;

  /** - Class if `scrollPosition > 0` */
  abstract readonly _fadeStart: string;

  /** - Class if `scrollPosition < overflowSize` */
  abstract readonly _fadeEnd: string;

  /** Creates a Fade Scroller */
  protected constructor(element: HTMLElement | string) {
    let content: HTMLElement | null;

    if (element instanceof HTMLElement) {
      content = element;
    } else {
      try {
        content = document.querySelector(element);
      } catch {
        throw new SyntaxError(
          `'${JSON.stringify(element)}' is not a valid selector`,
        );
      }

      if (content === null) {
        throw new Error(
          `Cannot find an element matching the selector '${element}'`,
        );
      }
    }

    if (content.parentNode === null) {
      throw new Error('Provided element does not have a parent');
    }

    content.classList.add('fade-scroll__content');

    const wrapper = document.createElement('div');
    wrapper.className = 'fade-scroll';

    const scrollBar = document.createElement('div');
    scrollBar.className = 'fade-scroll__scrollbar';

    wrapper.appendChild(scrollBar);
    content.parentNode.insertBefore(wrapper, content);
    scrollBar.appendChild(content);

    this.content = content;
    this.scrollBar = scrollBar;
    this.wrapper = wrapper;

    this._observer = new resizeObserver(this.scrollListener);

    this.addScrollListener(this.scrollListener);
  }

  /** Scroll event listener */
  protected scrollListener = () => {
    const wrapperClasses = this.wrapper.classList;

    wrapperClasses[this.scrollPosition < this.overflowSize ? 'add' : 'remove'](
      this._fadeEnd,
    );

    wrapperClasses[this.scrollPosition > 0 ? 'add' : 'remove'](this._fadeStart);
  };

  /**
   * Size of the `content` element:
   * - `width` for Horizontal
   * - `height` for Vertical
   */
  abstract get contentSize(): number;

  /**
   * Size of the `wrapper` element:
   * - `width` for Horizontal
   * - `height` for Vertical
   */
  abstract get wrapperSize(): number;

  /** - Size of overflow `(contentSize - wrapperSize)` */
  public get overflowSize() {
    return this.contentSize - this.wrapperSize;
  }

  /**
   * Scroll offset of `scrollBar` element:
   * - `scrollLeft` for Horizontal
   * - `scrollTop` for Vertical
   */
  abstract get scrollPosition(): number;

  /** - Starts observing the `content` and `wrapper` elements to apply the appropriate styles when the sizes change */
  public mount() {
    this._observer.observe(this.wrapper);
    this._observer.observe(this.content);

    return this;
  }

  /**
   * - Stops observing the `content` and `wrapper` elements
   * - Removes built-in event listeners and styles
   */
  abstract destroy(): void

  /** Add scroll event listener */
  public addScrollListener(callback: EventListener) {
    this.scrollBar.addEventListener('scroll', callback);
  }

  /** Remove scroll event listener */
  public removeScrollListener(callback: EventListener) {
    this.scrollBar.removeEventListener('scroll', callback);
  }
}
