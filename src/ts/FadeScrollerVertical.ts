import {
  classFadeScroll,
  classFadeScrollScrollbar,
  classFadeScrollContent,
  FadeScroller,
  prependStyle,
  scroll,
} from './FadeScroller';

const styleRules = `.${classFadeScroll}--vertical{height:100%}.${classFadeScroll}--vertical>.${classFadeScrollScrollbar}{overflow-y:scroll}.${classFadeScroll}--vertical>.${classFadeScrollScrollbar}>.${classFadeScrollContent}{width:100%;height:auto}`;

let style: HTMLStyleElement | undefined;

/** Vertical Fade Scroller */
export class Vertical extends FadeScroller {
  /**
   * Creates a Vertical Fade Scroller
   * @param element (Will become {@link content})
   */
  constructor(element: HTMLElement | string) {
    super(element, 'vertical');

    if (!style) style = document.createElement('style');

    prependStyle(style, styleRules);
  }

  /** @returns Height of {@link content} minus height of {@link wrapper} */
  public get overflowSize() {
    return this.content.offsetHeight - this.wrapper.offsetHeight;
  }

  /** @returns `scrollTop` value of {@link scrollBar} */
  public get scrollPosition() {
    return this.scrollBar.scrollTop;
  }

  /** @param position `scrollTop` value of {@link scrollBar} */
  public set scrollPosition(position: number) {
    scroll(this.scrollBar, 'top', 'scrollTop', position);
  }

  /** Hide the scrollbar? */
  public set hideScrollbar(hide: boolean) {
    if (!this._mounted) return;

    if (hide && this.scrollBar.style.width === '') {
      const scrollbarWidth =
        this.wrapper.offsetWidth - this.content.offsetWidth;

      this.scrollBar.style.width = `calc(100% + ${scrollbarWidth}px)`;
    } else {
      this.scrollBar.style.width = '';
    }
  }
}
