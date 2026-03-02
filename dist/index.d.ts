//#region src/ts/ResizeObserver.d.ts
/**
 * Set the `ResizeObserver` polyfill
 * @param {ResizeObserver} polyfill
 * @access public
 */
declare function setResizeObserver(polyfill: ResizeObserver): void;
//#endregion
//#region src/ts/FadeScrollerVertical.d.ts
/**
 * Vertical Fade Scroller
 * @access public
 */
declare class Vertical extends FadeScroller {
  readonly options: FadeScrollOptionsV;
  readonly _fadeStart: 'top-overflow';
  readonly _fadeEnd: 'bottom-overflow';
  /**
   * Creates a Vertical Fade Scroller
   * @param {HTMLElement | string} element
   * @param {FadeScrollOptionsV} [options]
   */
  constructor(element: HTMLElement | string, options?: FadeScrollOptionsV);
  /** - Height of `content` element */
  get contentSize(): number;
  /** - Height of `wrapper` element */
  get wrapperSize(): number;
  /** - `scrollTop` value of `scrollBar` element */
  get scrollPosition(): number;
  /** - `scrollTop` value of `scrollBar` element */
  set scrollPosition(number: number);
  destroy(): void;
}
//#endregion
//#region src/ts/OptionsVertical.d.ts
/** Vertical Fade Scroll options object */
interface FadeScrollOptionsV extends Partial<Options> {
  /**
   * Hide the scrollbar?
   * @default false
   */
  hideScrollbar?: boolean;
}
//#endregion
//#region src/ts/FadeScroller.d.ts
interface Options {
  [option: string]: boolean;
}
/**
 * Fade Scroller
 * @access private
 */
declare abstract class FadeScroller {
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
  /**
   * Creates a Fade Scroller
   * @param {HTMLElement | string} element
   */
  protected constructor(element: HTMLElement | string);
  /** Scroll event listener */
  protected scrollListener: () => void;
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
  get overflowSize(): number;
  /**
   * Scroll offset of `scrollBar` element:
   * - `scrollLeft` for Horizontal
   * - `scrollTop` for Vertical
   */
  abstract get scrollPosition(): number;
  /** - Starts observing the `content` and `wrapper` elements to apply the appropriate styles when the sizes change */
  mount(): this;
  /**
   * - Stops observing the `content` and `wrapper` elements
   * - Removes built-in event listeners and styles
   */
  abstract destroy(): void;
  /**
   * Add scroll event listener
   * @param {EventListener} callback
   */
  addScrollListener(callback: EventListener): void;
  /**
   * Remove scroll event listener
   * @param {EventListener} callback
   */
  removeScrollListener(callback: EventListener): void;
}
//#endregion
//#region src/ts/OptionsHorizontal.d.ts
/** Horizontal Fade Scroll options object */
interface FadeScrollOptionsH extends Partial<Options> {
  /**
   * Hide the scrollbar?
   * @default false
   */
  hideScrollbar?: boolean;
  /**
   * Enable mousewheel event capture?
   * @default false
   */
  captureWheel?: boolean;
}
//#endregion
//#region src/ts/FadeScrollerHorizontal.d.ts
/**
 * Horizontal Fade Scroller
 * @access public
 */
declare class Horizontal extends FadeScroller {
  readonly options: FadeScrollOptionsH;
  readonly _fadeStart: 'left-overflow';
  readonly _fadeEnd: 'right-overflow';
  /**
   * Creates a Horizontal Fade Scroller
   * @param {HTMLElement | string} element
   * @param {FadeScrollOptionsH} [options]
   */
  constructor(element: HTMLElement | string, options?: FadeScrollOptionsH);
  /**
   * Wheel event listener
   * @param {WheelEvent} event
   */
  wheelListener: (event: WheelEvent) => void;
  /** - Width of `content` element */
  get contentSize(): number;
  /** - Width of `wrapper` element */
  get wrapperSize(): number;
  /** - `scrollLeft` value of `scrollBar` element */
  get scrollPosition(): number;
  /** - `scrollLeft` value of `scrollBar` element */
  set scrollPosition(number: number);
  destroy(): void;
}
//#endregion
export { Horizontal, Vertical, setResizeObserver };