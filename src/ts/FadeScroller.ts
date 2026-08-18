import { ResizeObserverClass } from './ResizeObserver';

export const classFadeScroll = 'fade-scroll';
export const classFadeScrollScrollbar = `${classFadeScroll}__scrollbar`;
export const classFadeScrollContent = `${classFadeScroll}__content`;

/** Class if {@link FadeScroller.scrollPosition} > 0 */
const classFadeStart = `${classFadeScroll}--fade-start`;

/** Class if {@link FadeScroller.scrollPosition} < {@link FadeScroller.overflowSize} */
const classFadeEnd = `${classFadeScroll}--fade-end`;

type Axis = 'horizontal' | 'vertical';

let observer: ResizeObserver | undefined;

const observationMap = new Map<Element, FadeScroller>();

/** Feature detection: `true` if smooth scrolling is supported */
let smoothScrollSupported: boolean;

let prefersReducedMotion: MediaQueryList | undefined;

export const scroll = (
  scrollBar: FadeScroller['scrollBar'],
  directionSmooth: 'top' | 'left',
  direction: 'scrollTop' | 'scrollLeft',
  position: number,
) => {
  if (smoothScrollSupported && !prefersReducedMotion?.matches) {
    scrollBar.scroll({
      [directionSmooth]: position,
      behavior: 'smooth',
    });
  } else {
    scrollBar[direction] = position;
  }
};

export const prependStyle = (element: HTMLStyleElement, css: string) => {
  if (element.parentNode) return;
  element.textContent = css;
  document.head.insertAdjacentElement('afterbegin', element);
};

const styleRules = `.${classFadeScroll}{overflow:hidden}.${classFadeScrollScrollbar}{overflow:hidden;width:100%;height:100%}.${classFadeScrollContent}{position:relative}`;

let style: HTMLStyleElement | undefined;

/** Fade Scroller */
export abstract class FadeScroller {
  /** @returns Resize Observer */
  private static get observer() {
    if (!ResizeObserverClass) {
      throw new Error('FadeScroller requires ResizeObserver');
    }

    return (observer ??= new ResizeObserverClass((entries) => {
      const scrollers = new Set<FadeScroller>();

      for (const entry of entries) {
        const scroller = observationMap.get(entry.target);

        if (scroller) scrollers.add(scroller);
      }

      scrollers.forEach((scroller) => {
        scroller.scrollListener();
      });
    }));
  }

  /** Scrolling axis */
  private readonly axis: Axis;

  /** Inner element (selected in constructor) */
  public readonly content: HTMLElement;

  /** Element with overflow (contains {@link content} element) */
  public readonly scrollBar: HTMLDivElement;

  /** Outer element (contains {@link scrollBar} element) */
  public readonly wrapper: HTMLDivElement;

  /** Fade Scroller is mounted? */
  protected _mounted = false;

  /**
   * Creates a Fade Scroller
   * @param element (Will become {@link content})
   * @param axis Scrolling axis
   */
  protected constructor(element: HTMLElement | string, axis: Axis) {
    let content: HTMLElement;

    if (element instanceof HTMLElement) {
      content = element;
    } else {
      const el = document.querySelector<HTMLElement>(element);

      if (el === null) {
        throw new Error(
          `Cannot find an element matching the selector '${element}'`,
        );
      }

      content = el;
    }

    this.axis = axis;

    if (!style) {
      style = document.createElement('style');
      smoothScrollSupported = 'scrollBehavior' in style.style;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      prefersReducedMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : undefined;
    }

    prependStyle(style, styleRules);

    const wrapper = document.createElement('div');
    const scrollBar = document.createElement('div');

    this.wrapper = wrapper;
    this.scrollBar = scrollBar;
    this.content = content;
  }

  /** Scroll event listener */
  private readonly scrollListener = () => {
    const position = Math.ceil(this.scrollPosition);

    const wrapper = this.wrapper.classList;

    wrapper[position < this.overflowSize ? 'add' : 'remove'](classFadeEnd);

    wrapper[position > 0 ? 'add' : 'remove'](classFadeStart);
  };

  /** @returns Size of the overflow */
  public abstract get overflowSize(): number;

  /** @returns Scroll offset of {@link scrollBar} */
  public abstract get scrollPosition(): number;

  /** @param number Scroll offset of {@link scrollBar} */
  public abstract set scrollPosition(number: number);

  /** Hide the scrollbar? */
  public abstract set hideScrollbar(hide: boolean);

  /**
   * 1. Adds {@link wrapper} and {@link scrollBar} to the DOM
   * 2. Adds FadeScroll CSS classes to applicable elements
   * 3. Adds {@link content} and {@link wrapper} to {@link observationMap}
   * 4. Starts observing the {@link content} and {@link wrapper} elements
   * 5. Adds {@link scrollListener} event listener to {@link scrollBar}
   * 6. Sets {@link _mounted} to `true`
   * @returns this
   */
  public mount() {
    if (this._mounted) return;

    this.wrapper.className = `${classFadeScroll} ${classFadeScroll}--${this.axis}`;
    this.scrollBar.className = classFadeScrollScrollbar;

    this.wrapper.appendChild(this.scrollBar);

    // Will throw if `this.content.parentNode === null`
    this.content.insertAdjacentElement('beforebegin', this.wrapper);
    this.scrollBar.appendChild(this.content);

    this.content.classList.add(classFadeScrollContent);

    observationMap.set(this.wrapper, this);
    observationMap.set(this.content, this);

    FadeScroller.observer.observe(this.wrapper);
    FadeScroller.observer.observe(this.content);

    this.scrollBar.addEventListener('scroll', this.scrollListener);

    this._mounted = true;

    // this.update();
    this.scrollListener();

    return this;
  }

  /**
   * 1. Sets {@link _mounted} to `false`
   * 2. Removes {@link scrollListener} event listener from {@link scrollBar}
   * 3. Stops observing the {@link content} and {@link wrapper} elements
   * 4. Removes {@link content} and {@link wrapper} from {@link observationMap}
   * 5. Removes FadeScroll CSS classes from applicable elements
   * 6. Removes {@link wrapper} and {@link scrollBar} from the DOM
   */
  public destroy() {
    if (!this._mounted) return;

    this._mounted = false;

    this.scrollBar.removeEventListener('scroll', this.scrollListener);

    FadeScroller.observer.unobserve(this.wrapper);
    FadeScroller.observer.unobserve(this.content);

    observationMap.delete(this.wrapper);
    observationMap.delete(this.content);

    this.wrapper.classList.remove(classFadeStart, classFadeEnd);
    this.content.classList.remove(classFadeScrollContent);

    this.wrapper.insertAdjacentElement('beforebegin', this.content);

    this.scrollBar.remove();
    this.wrapper.remove();
  }
}
