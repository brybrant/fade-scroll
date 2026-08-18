//#region src/ts/ResizeObserver.d.ts
/**
 * Set the `ResizeObserver` polyfill
 * @param polyfill User provided polyfill for `ResizeObserver` API
 */
declare function setResizeObserver(polyfill: typeof ResizeObserver): void;
//#endregion
//#region src/ts/FadeScroller.d.ts
type Axis = 'horizontal' | 'vertical';
/** Fade Scroller */
declare abstract class FadeScroller {
  /** @returns Resize Observer */
  private static get observer();
  /** Scrolling axis */
  private readonly axis;
  /** Inner element (selected in constructor) */
  readonly content: HTMLElement;
  /** Element with overflow (contains {@link content} element) */
  readonly scrollBar: HTMLDivElement;
  /** Outer element (contains {@link scrollBar} element) */
  readonly wrapper: HTMLDivElement;
  /** Fade Scroller is mounted? */
  protected _mounted: boolean;
  /**
   * Creates a Fade Scroller
   * @param element (Will become {@link content})
   * @param axis Scrolling axis
   */
  protected constructor(element: HTMLElement | string, axis: Axis);
  /** Scroll event listener */
  private readonly scrollListener;
  /** @returns Size of the overflow */
  abstract get overflowSize(): number;
  /** @returns Scroll offset of {@link scrollBar} */
  abstract get scrollPosition(): number;
  /** @param number Scroll offset of {@link scrollBar} */
  abstract set scrollPosition(number: number);
  /** Hide the scrollbar? */
  abstract set hideScrollbar(hide: boolean);
  /**
   * 1. Adds elements to the DOM
   * 2. Adds element classes
   * 3. Adds {@link content} and {@link wrapper} to {@link observationMap}
   * 4. Starts observing the {@link content} and {@link wrapper} elements
   * 5. Sets {@link _mounted} to `true`
   * @returns this
   */
  mount(): this | undefined;
  /**
   * 1. Sets {@link _mounted} to `false`
   * 2. Stops observing the {@link content} and {@link wrapper} elements
   * 3. Removes {@link content} and {@link wrapper} from {@link observationMap}
   * 4. Removes element classes
   * 5. Removes elements from the DOM
   */
  destroy(): void;
  /**
   * Add scroll event listener
   * @param callback Event listener callback function to add
   */
  addScrollListener(callback: EventListener): void;
  /**
   * Remove scroll event listener
   * @param callback Event listener callback function to remove
   */
  removeScrollListener(callback: EventListener): void;
}
//#endregion
//#region src/ts/FadeScrollerHorizontal.d.ts
/** Horizontal Fade Scroller */
declare class Horizontal extends FadeScroller {
  /**
   * Creates a Horizontal Fade Scroller
   * @param element (Will become {@link content})
   */
  constructor(element: HTMLElement | string);
  /**
   * Wheel event listener
   * @param event `WheelEvent`
   */
  private readonly wheelListener;
  /** @returns Width of {@link content} minus width of {@link wrapper} */
  get overflowSize(): number;
  /** @returns `scrollLeft` value of {@link scrollBar} */
  get scrollPosition(): number;
  /** @param position `scrollLeft` value of {@link scrollBar} */
  set scrollPosition(position: number);
  /** Hide the scrollbar? */
  set hideScrollbar(hide: boolean);
  /** Enable mousewheel event capture? */
  set captureWheel(capture: boolean);
}
//#endregion
//#region src/ts/FadeScrollerVertical.d.ts
/** Vertical Fade Scroller */
declare class Vertical extends FadeScroller {
  /**
   * Creates a Vertical Fade Scroller
   * @param element (Will become {@link content})
   */
  constructor(element: HTMLElement | string);
  /** @returns Height of {@link content} minus height of {@link wrapper} */
  get overflowSize(): number;
  /** @returns `scrollTop` value of {@link scrollBar} */
  get scrollPosition(): number;
  /** @param position `scrollTop` value of {@link scrollBar} */
  set scrollPosition(position: number);
  /** Hide the scrollbar? */
  set hideScrollbar(hide: boolean);
}
//#endregion
export { Horizontal, Vertical, setResizeObserver };