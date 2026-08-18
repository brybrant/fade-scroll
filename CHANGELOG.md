# v2.0.0

Version 2 is a substantial redesign of FadeScroll. The public API has been simplified, the lifecycle has been made explicit, and a number of implementation details have been consolidated to reduce duplication and improve efficiency.

> [!CAUTION]
> Version 2 contains several breaking API changes. Existing v1 code may require modification before upgrading.

## ⚠️ Breaking changes

### Removed the `options` object

The `options` parameter has been removed.

**Before:**
```ts
new Horizontal(element, {
  hideScrollbar: true,
  captureWheel: true,
});
```

**After:**
```ts
const scroller = new Horizontal(element);

scroller.hideScrollbar = true;
scroller.captureWheel = true;
```

The previous options system was unnecessarily complicated for the small number of configurable properties. Configuration is now exposed directly through setters on the scroller instance.

### Explicit lifecycle start with `mount()`

Constructing a `Horizontal` or `Vertical` scroller no longer immediately modifies the DOM.

**Before:**
```ts
const scroller = new Horizontal(element);
```

The constructor immediately created and rearranged DOM elements, attached event listeners, and began observing the elements.

**After:**
```ts
const scroller = new Horizontal(element);

scroller.mount();
```

The constructor now only validates and stores the content element and creates the required internal elements.

This allows a scroller to be constructed before its content element is ready to be inserted into the DOM. This is particularly useful in component-based environments such as React, Solid, Vue, etc.

`mount()` performs the DOM modification and begins operation.

#### `destroy()` now completely unmounts the scroller

`destroy()` has been redesigned to reverse the work performed by `mount()`.

It now:
- stops resize observation;
- removes the fade scroll classes;
- removes the generated wrapper elements;
- restores the original content element to its previous position.

A destroyed scroller can subsequently be mounted again:
```ts
scroller.mount();
scroller.destroy();
scroller.mount();
```

This makes the lifecycle explicitly reversible.

### CSS is now injected automatically

Version 2 no longer requires users to separately import the core CSS required for FadeScroll to function.

The necessary styles are injected into the document automatically when a scroller is first constructed.

The styles are inserted at the beginning of `<head>` so that user stylesheets appearing later in the document can override them naturally through the CSS cascade.

The style elements are reused rather than creating a new `<style>` element for every scroller.

> [!WARNING]
> Only the necessary styles are injected. You must still provide your own CSS mask styles to fade the overflow. An example of these styles can be found in [fade-scroll.css](./dist/fade-scroll.css)

### The `contentSize` and `wrapperSize` getters have been removed

These getters were practically redundant. The `content` and `wrapper` elements are available as scroller properties if you wish to query their size:

**Before:**
```ts
scroller.contentSize;
scroller.wrapperSize;
```

**After:**
```ts
// Horizontal
scroller.content.offsetWidth;
scroller.wrapper.offsetWidth;

// Vertical
scroller.content.offsetHeight;
scroller.wrapper.offsetHeight;
```

### The `addScrollListener()` and `removeScrollListener()` methods have been removed

These methods were practically redundant. The `scrollBar` element is available as a property if you wish to add or remove your own event listeners:

**Before:**
```ts
scroller.addScrollListener(() => {});
```

**After:**
```ts
scroller.scrollBar.addEventListener('scroll', () => {});
```

### `FauxResizeObserver` has been removed

The no-op `FauxResizeObserver` fallback has been removed.

> [!IMPORTANT]
> If the browser does not provide `ResizeObserver` then you must provide a ponyfill using `setResizeObserver()` **before** mounting a scroller. Check [caniuse](https://caniuse.com/resizeobserver) for browser support details.

## Internal changes

### Smooth scrolling now respects `prefers-reduced-motion`

The `scrollPosition` setter previously always requested `behavior: 'smooth'` regardless of user preference.

Version 2 checks the user's `prefers-reduced-motion` preference and falls back to immediate scrolling when reduced motion is requested.

### Horizontal wheel capture has changed

The wheel event handler has been improved to account for both `deltaX` and `deltaY`, using whichever represents the dominant wheel movement.

This translates vertical mouse-wheel input to horizontal, while also supporting horizontal wheel/trackpad input.

### Lifecycle moved to `FadeScroller` class

Previously, the `destroy()` method was implemented differently by `Horizontal` and `Vertical` subclasses because the two orientations had slightly different cleanup requirements.

Now both `mount()` and `destroy()` lifecycle implementations are consolidated into the base `FadeScroller` class. This eliminates duplicated lifecycle code while allowing `Horizontal` and `Vertical` to contain only behavior specific to their respective orientations.

### `scrollPosition` is no longer rounded

The `Math.ceil()` previously used by `scrollPosition` has been removed. This was meant to compensate for the discrepancy observed between maximum `scrollPosition` and `overflowSize`.

The getter now retrieves the element's native scroll position value. Rounding is only performed internally when determining whether the start/end fade classes should be applied, avoiding sub-pixel discrepancies between the reported scroll position and calculated overflow.

### `ResizeObserver` is now shared

Version 1 created a separate `ResizeObserver` for each scroller.

Version 2 uses a single shared observer and associates observed elements with their corresponding `FadeScroller` instances.

This reduces the number of `ResizeObserver` instances when multiple scrollers are present.

> [!NOTE]
> The resize callback deduplicates scrollers when both their content and wrapper elements are resized simultaneously, preventing the same scroller from being updated twice unnecessarily.
