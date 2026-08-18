//#region src/ts/ResizeObserver.ts
/** Feature detection: `true` if `ResizeObserver` API exists */
const nativeResizeObserver = typeof window !== "undefined" && "ResizeObserver" in window;
let ResizeObserverClass = nativeResizeObserver ? ResizeObserver : null;
/**
* Set the `ResizeObserver` polyfill
* @param polyfill User provided polyfill for `ResizeObserver` API
*/
function setResizeObserver(polyfill) {
	if (nativeResizeObserver) return;
	ResizeObserverClass = polyfill;
}

//#endregion
//#region src/ts/FadeScroller.ts
const classFadeScroll = "fade-scroll";
const classFadeScrollScrollbar = `${classFadeScroll}__scrollbar`;
const classFadeScrollContent = `${classFadeScroll}__content`;
/** Class if {@link FadeScroller.scrollPosition} > 0 */
const classFadeStart = `${classFadeScroll}--fade-start`;
/** Class if {@link FadeScroller.scrollPosition} < {@link FadeScroller.overflowSize} */
const classFadeEnd = `${classFadeScroll}--fade-end`;
let observer;
const observationMap = /* @__PURE__ */ new Map();
/** Feature detection: `true` if smooth scrolling is supported */
let smoothScrollSupported;
let prefersReducedMotion;
const scroll = (scrollBar, directionSmooth, direction, position) => {
	if (smoothScrollSupported && !prefersReducedMotion?.matches) scrollBar.scroll({
		[directionSmooth]: position,
		behavior: "smooth"
	});
	else scrollBar[direction] = position;
};
const prependStyle = (element, css) => {
	if (element.parentNode) return;
	element.textContent = css;
	document.head.insertAdjacentElement("afterbegin", element);
};
const styleRules$2 = `.${classFadeScroll}{overflow:hidden}.${classFadeScrollScrollbar}{overflow:hidden;width:100%;height:100%}.${classFadeScrollContent}{position:relative}`;
let style$2;
/** Fade Scroller */
var FadeScroller = class FadeScroller {
	/** @returns Resize Observer */
	static get observer() {
		if (!ResizeObserverClass) throw new Error("FadeScroller requires ResizeObserver");
		return observer ??= new ResizeObserverClass((entries) => {
			const scrollers = /* @__PURE__ */ new Set();
			for (const entry of entries) {
				const scroller = observationMap.get(entry.target);
				if (scroller) scrollers.add(scroller);
			}
			scrollers.forEach((scroller) => {
				scroller.scrollListener();
			});
		});
	}
	/** Scrolling axis */
	axis;
	/** Inner element (selected in constructor) */
	content;
	/** Element with overflow (contains {@link content} element) */
	scrollBar;
	/** Outer element (contains {@link scrollBar} element) */
	wrapper;
	/** Fade Scroller is mounted? */
	_mounted = false;
	/**
	* Creates a Fade Scroller
	* @param element (Will become {@link content})
	* @param axis Scrolling axis
	*/
	constructor(element, axis) {
		let content;
		if (element instanceof HTMLElement) content = element;
		else {
			const el = document.querySelector(element);
			if (el === null) throw new Error(`Cannot find an element matching the selector '${element}'`);
			content = el;
		}
		this.axis = axis;
		if (!style$2) {
			style$2 = document.createElement("style");
			smoothScrollSupported = "scrollBehavior" in style$2.style;
			prefersReducedMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : void 0;
		}
		prependStyle(style$2, styleRules$2);
		const wrapper = document.createElement("div");
		const scrollBar = document.createElement("div");
		this.wrapper = wrapper;
		this.scrollBar = scrollBar;
		this.content = content;
	}
	/** Scroll event listener */
	scrollListener = () => {
		const position = Math.ceil(this.scrollPosition);
		const wrapper = this.wrapper.classList;
		wrapper[position < this.overflowSize ? "add" : "remove"](classFadeEnd);
		wrapper[position > 0 ? "add" : "remove"](classFadeStart);
	};
	/**
	* 1. Adds elements to the DOM
	* 2. Adds element classes
	* 3. Adds {@link content} and {@link wrapper} to {@link observationMap}
	* 4. Starts observing the {@link content} and {@link wrapper} elements
	* 5. Sets {@link _mounted} to `true`
	* @returns this
	*/
	mount() {
		if (this._mounted) return;
		this.wrapper.className = `${classFadeScroll} ${classFadeScroll}--${this.axis}`;
		this.scrollBar.className = classFadeScrollScrollbar;
		this.wrapper.appendChild(this.scrollBar);
		this.content.insertAdjacentElement("beforebegin", this.wrapper);
		this.scrollBar.appendChild(this.content);
		this.content.classList.add(classFadeScrollContent);
		observationMap.set(this.wrapper, this);
		observationMap.set(this.content, this);
		FadeScroller.observer.observe(this.wrapper);
		FadeScroller.observer.observe(this.content);
		this.addScrollListener(this.scrollListener);
		this._mounted = true;
		this.scrollListener();
		return this;
	}
	/**
	* 1. Sets {@link _mounted} to `false`
	* 2. Stops observing the {@link content} and {@link wrapper} elements
	* 3. Removes {@link content} and {@link wrapper} from {@link observationMap}
	* 4. Removes element classes
	* 5. Removes elements from the DOM
	*/
	destroy() {
		if (!this._mounted) return;
		this._mounted = false;
		FadeScroller.observer.unobserve(this.wrapper);
		FadeScroller.observer.unobserve(this.content);
		observationMap.delete(this.wrapper);
		observationMap.delete(this.content);
		this.wrapper.classList.remove(classFadeStart, classFadeEnd);
		this.content.classList.remove(classFadeScrollContent);
		this.wrapper.insertAdjacentElement("beforebegin", this.content);
		this.scrollBar.remove();
		this.wrapper.remove();
	}
	/**
	* Add scroll event listener
	* @param callback Event listener callback function to add
	*/
	addScrollListener(callback) {
		this.scrollBar.addEventListener("scroll", callback);
	}
	/**
	* Remove scroll event listener
	* @param callback Event listener callback function to remove
	*/
	removeScrollListener(callback) {
		this.scrollBar.removeEventListener("scroll", callback);
	}
};

//#endregion
//#region src/ts/FadeScrollerHorizontal.ts
const styleRules$1 = `.${classFadeScroll}--horizontal>.${classFadeScrollScrollbar}{overflow-x:scroll;height:auto}.${classFadeScroll}--horizontal>.${classFadeScrollScrollbar}>.${classFadeScrollContent}{display:inline-block;vertical-align:top;width:auto;height:100%;white-space:nowrap}`;
let style$1;
/** Horizontal Fade Scroller */
var Horizontal = class extends FadeScroller {
	/**
	* Creates a Horizontal Fade Scroller
	* @param element (Will become {@link content})
	*/
	constructor(element) {
		super(element, "horizontal");
		if (!style$1) style$1 = document.createElement("style");
		prependStyle(style$1, styleRules$1);
	}
	/**
	* Wheel event listener
	* @param event `WheelEvent`
	*/
	wheelListener = (event) => {
		const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
		if (delta !== 0) {
			event.preventDefault();
			this.scrollPosition += delta;
		}
	};
	/** @returns Width of {@link content} minus width of {@link wrapper} */
	get overflowSize() {
		return this.content.offsetWidth - this.wrapper.offsetWidth;
	}
	/** @returns `scrollLeft` value of {@link scrollBar} */
	get scrollPosition() {
		return this.scrollBar.scrollLeft;
	}
	/** @param position `scrollLeft` value of {@link scrollBar} */
	set scrollPosition(position) {
		scroll(this.scrollBar, "left", "scrollLeft", position);
	}
	/** Hide the scrollbar? */
	set hideScrollbar(hide) {
		if (!this._mounted) return;
		this.wrapper.style.height = hide ? `${this.content.offsetHeight}px` : "";
	}
	/** Enable mousewheel event capture? */
	set captureWheel(capture) {
		/** This computed property causes TypeScript to become confused [...] */
		this.scrollBar[`${capture ? "add" : "remove"}EventListener`]("wheel", this.wheelListener);
	}
};

//#endregion
//#region src/ts/FadeScrollerVertical.ts
const styleRules = `.${classFadeScroll}--vertical{height:100%}.${classFadeScroll}--vertical>.${classFadeScrollScrollbar}{overflow-y:scroll}.${classFadeScroll}--vertical>.${classFadeScrollScrollbar}>.${classFadeScrollContent}{width:100%;height:auto}`;
let style;
/** Vertical Fade Scroller */
var Vertical = class extends FadeScroller {
	/**
	* Creates a Vertical Fade Scroller
	* @param element (Will become {@link content})
	*/
	constructor(element) {
		super(element, "vertical");
		if (!style) style = document.createElement("style");
		prependStyle(style, styleRules);
	}
	/** @returns Height of {@link content} minus height of {@link wrapper} */
	get overflowSize() {
		return this.content.offsetHeight - this.wrapper.offsetHeight;
	}
	/** @returns `scrollTop` value of {@link scrollBar} */
	get scrollPosition() {
		return this.scrollBar.scrollTop;
	}
	/** @param position `scrollTop` value of {@link scrollBar} */
	set scrollPosition(position) {
		scroll(this.scrollBar, "top", "scrollTop", position);
	}
	/** Hide the scrollbar? */
	set hideScrollbar(hide) {
		if (!this._mounted) return;
		if (hide && this.scrollBar.style.width === "") {
			const scrollbarWidth = this.wrapper.offsetWidth - this.content.offsetWidth;
			this.scrollBar.style.width = `calc(100% + ${scrollbarWidth}px)`;
		} else this.scrollBar.style.width = "";
	}
};

//#endregion
export { Horizontal, Vertical, setResizeObserver };