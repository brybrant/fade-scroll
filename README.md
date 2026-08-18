# Fade Scroll

[<img src='https://img.shields.io/npm/v/%40brybrant%2Ffade-scroll'>](https://www.npmjs.com/package/@brybrant/fade-scroll) <img src='https://img.shields.io/bundlejs/size/%40brybrant%2Ffade-scroll?exports=Horizontal%2CVertical&format=minzip'> [<img src='https://img.shields.io/github/actions/workflow/status/brybrant/fade-scroll/test.yaml?logo=github&logoColor=fff&label=Playwright%20Tests'>](https://github.com/brybrant/fade-scroll/actions/workflows/test.yaml)

Fade Scroll is a cosmetic module which adds subtle gradient masks to the overflow of scrollable content.

See the [demo page](https://brybrant.github.io/fade-scroll/) for an interactive demonstration.

> [!IMPORTANT]
> Fade Scroll automatically injects the minimal CSS required. The visual fade effect is intentionally left to the user so that it can be customized freely.
> See [fade-scroll.css](./dist/fade-scroll.css) for example styles which use [CSS masks](https://caniuse.com/css-masks) to blend seamlessly with *any* background.
> If you want to support legacy browsers, see [fade-scroll--legacy.css](./dist/fade-scroll--legacy.css) for an example of how you can use [linear gradients](https://caniuse.com/css-gradients) with pseudo elements to achieve a similar effect.

## Install

```bash
$ npm i @brybrant/fade-scroll
```

## Setup

```html
<html>
  <head>
    <link rel='stylesheet' href='fade-scroll.css'/>
  </head>
  <body>
    <div id='horizontal'>
      <p>Some horizontal overflowing content...</p>
    </div>

    <div id='vertical'>
      <p>Some vertical overflowing content...</p>
    </div>

    <script type='module' src='index.js'></script>
  </body>
</html>
```

```ts
// index.js
import * as FadeScroll from '@brybrant/fade-scroll';

// Constructor with HTMLElement
const horizontal = new FadeScroll.Horizontal(
  document.getElementById<HTMLElement>('horizontal')!,
);

// Constructor with string (passed to `document.querySelector()`)
const vertical = new FadeScroll.Vertical('#vertical');

// Lifecycle begin
horizontal.mount();
vertical.mount();

// Set options
horizontal.captureWheel = true;
vertical.hideScrollbar = true;

// Change options
vertical.hideScrollbar = false;

// Lifecycle end
horizontal.destroy();
vertical.destroy();
```

## API

The constructor requires only one argument:

[`HTMLElement`](https://mdn.io/HTMLElement) or `string` (which is passed to [`querySelector()`](https://mdn.io/querySelector))

This will become the [`content`](#content) of the Fade Scroller.

The constructor returns a **Fade Scroller**:

### Fade Scroller Properties:

#### `content`
The element selected in the first argument of the constructor function
- Type: [`HTMLElement`](https://mdn.io/HTMLElement)
- Access: `Read`

---

#### `scrollBar`
The element with overflow *(contains [`content`](#content) element)*
- Type: [`HTMLDivElement`](https://mdn.io/HTMLDivElement)
- Access: `Read`

---

#### `wrapper`
The outer element *(contains [`scrollBar`](#scrollbar) element)*
- Type: [`HTMLDivElement`](https://mdn.io/HTMLDivElement)
- Access: `Read`

---

#### `overflowSize`
The size of the overflow
- Type: `number`
- Access: `Read`

|Horizontal|Vertical|
|-|-|
|[`content`](#content) width minus [`wrapper`](#wrapper) width|[`content`](#content) height minus [`wrapper`](#wrapper) height|

---

#### `scrollPosition`
The scroll position of the [`scrollBar`](#scrollbar) element
- Type: `number`
- Access: `Read / Write`

|Horizontal|Vertical|
|-|-|
|[`scrollLeft`](https://mdn.io/scrollLeft)|[`scrollTop`](https://mdn.io/scrollTop)|

---

#### `hideScrollbar`
Hide the scrollbar?
- Type: `boolean`
- Default: `false`
- Access: `Write`

---

#### `captureWheel` ***(Horizontal only)***
Capture [wheel events](https://mdn.io/WheelEvent) and translate vertical to horizontal scroll movement?
- Type: `boolean`
- Default: `false`
- Access: `Write`

---

### Fade Scroller Methods:

#### `mount()`
1. Adds the FadeScroll CSS classes.
2. Adds [wrapper](#wrapper) and [scrollBar](#scrollbar) to the DOM.
3. Moves [content](#content) to inside the [scrollBar](#scrollbar) element.
4. Starts observing [content](#content) and [wrapper](#wrapper) elements.
5. Adds the internal scroll event listener to [scrollBar](#scrollbar).

This will begin to add or remove CSS classes on the [wrapper](#wrapper) element in response to scrolling or size changes.

> [!TIP]
> The `mount()` method returns `this` so you can construct a new Fade Scroller and then immediately mount it in a single assignment:
> ```ts
> const scroller = new FadeScroll.Horizontal('.selector').mount();
>
> console.log(scroller instanceof FadeScroll.Horizontal); // true
> ```

---

#### `destroy()`
1. Removes the internal scroll event listener from [scrollBar](#scrollbar).
2. Stops observing [content](#content) and [wrapper](#wrapper) elements.
3. Removes the FadeScroll CSS classes.
4. Moves the [content](#content) element to its original position in the DOM.
5. Removes [wrapper](#wrapper) and [scrollBar](#scrollbar) from the DOM.

> [!TIP]
> A destroyed Fade Scroller can be mounted again by calling [`mount()`](#mount)

---

## Browser Compatibility

The [Fade Scroll demo](https://brybrant.github.io/fade-scroll/) uses [CSS masks](https://caniuse.com/css-masks), but you may use [linear gradients](https://caniuse.com/css-gradients) for better compatibility if the background is a solid color.

Fade Scroll requires the [`ResizeObserver` API](https://caniuse.com/resizeobserver). Browsers without native support must provide a ponyfill using `setResizeObserver()` **before constructing any scrollers**:

```js
import { ResizeObserver as Ponyfill } from '@juggle/resize-observer';

import * as FadeScroll from '@brybrant/fade-scroll';

FadeScroll.setResizeObserver(Ponyfill);

// Create some Fade Scrollers **after** setting the ponyfill...
```
