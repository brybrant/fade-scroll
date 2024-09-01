/**
 * Set the `ResizeObserver` polyfill
 * @access public
 */
export declare function setResizeObserver(polyfill: ResizeObserver): void;
/**
 * Vertical Fade Scroller
 * @access public
 */
export declare class Vertical extends FadeScroller {
	readonly options: FadeScrollOptionsV;
	readonly _fadeStart: "top-overflow";
	readonly _fadeEnd: "bottom-overflow";
	/** Creates a Vertical Fade Scroller */
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
/** Vertical Fade Scroll options object */
export interface FadeScrollOptionsV extends Options {
	/**
	 * Hide the scrollbar?
	 * @default false
	 */
	hideScrollbar: boolean;
}
export interface Options {
	[option: string]: unknown;
}
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
	/** Creates a Fade Scroller */
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
	/** Add scroll event listener */
	addScrollListener(callback: EventListener): void;
	/** Remove scroll event listener */
	removeScrollListener(callback: EventListener): void;
}
/** Horizontal Fade Scroll options object */
export interface FadeScrollOptionsH extends Options {
	/**
	 * Hide the scrollbar?
	 * @default false
	 */
	hideScrollbar: boolean;
	/**
	 * Enable mousewheel event capture?
	 * @default false
	 */
	captureWheel: boolean;
}
/**
 * Horizontal Fade Scroller
 * @access public
 */
export declare class Horizontal extends FadeScroller {
	readonly options: FadeScrollOptionsH;
	readonly _fadeStart: "left-overflow";
	readonly _fadeEnd: "right-overflow";
	/** Creates a Horizontal Fade Scroller */
	constructor(element: HTMLElement | string, options?: FadeScrollOptionsH);
	/** Wheel event listener */
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

export as namespace FadeScroll;

export {};
