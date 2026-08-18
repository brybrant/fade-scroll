import {
  classFadeScroll,
  classFadeScrollScrollbar,
  classFadeScrollContent,
  FadeScroller,
  prependStyle,
  scroll,
} from './FadeScroller';

const styleRules = `.${classFadeScroll}--horizontal>.${classFadeScrollScrollbar}{overflow-x:scroll;height:auto}.${classFadeScroll}--horizontal>.${classFadeScrollScrollbar}>.${classFadeScrollContent}{display:inline-block;vertical-align:top;width:auto;height:100%;white-space:nowrap}`;

let style: HTMLStyleElement | undefined;

/** Horizontal Fade Scroller */
export class Horizontal extends FadeScroller {
  /**
   * Creates a Horizontal Fade Scroller
   * @param element (Will become {@link content})
   */
  constructor(element: HTMLElement | string) {
    super(element, 'horizontal');

    if (!style) style = document.createElement('style');

    prependStyle(style, styleRules);
  }

  /**
   * Wheel event listener
   * @param event `WheelEvent`
   */
  private readonly wheelListener = (event: WheelEvent) => {
    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (delta !== 0) {
      event.preventDefault();
      this.scrollPosition += delta;
    }
  };

  /** @returns Width of {@link content} minus width of {@link wrapper} */
  public get overflowSize() {
    return this.content.offsetWidth - this.wrapper.offsetWidth;
  }

  /** @returns `scrollLeft` value of {@link scrollBar} */
  public get scrollPosition() {
    return this.scrollBar.scrollLeft;
  }

  /** @param position `scrollLeft` value of {@link scrollBar} */
  public set scrollPosition(position: number) {
    scroll(this.scrollBar, 'left', 'scrollLeft', position);
  }

  /** Hide the scrollbar? */
  public set hideScrollbar(hide: boolean) {
    if (!this._mounted) return;

    this.wrapper.style.height = hide ? `${this.content.offsetHeight}px` : '';
  }

  /** Enable mousewheel event capture? */
  public set captureWheel(capture: boolean) {
    /** This computed property causes TypeScript to become confused [...] */
    this.scrollBar[`${capture ? 'add' : 'remove'}EventListener`](
      'wheel',
      /* [...] therefore it is necessary to cast the type here */
      this.wheelListener as EventListener,
    );
  }
}
