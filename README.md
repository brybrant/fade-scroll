# Fade Scroll

<img src='https://img.shields.io/badge/gzipped-1.2_KB-blue'>

Fade Scroll is a tiny, zero-dependency cosmetic addon which adds subtle gradient masks to scrollable content.

See the [demo page](https://brybrant.github.io/fade-scroll/) for an interactive demonstration.

## Install

```bash
$ npm i github:brybrant/fade-scroll
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

*See [fade-scroll.css](./dist/fade-scroll.css) for the Fade Scroll styles.*

```js
// index.js
import * as FadeScroll from '@brybrant/fade-scroll';

// Basic usage
const horizontal = new FadeScroll.Horizontal('#horizontal').mount();

// Set options
const vertical = new FadeScroll.Vertical('#vertical', {
  hideScrollbar: true,
}).mount();

// Change options
horizontal.options.captureWheel = true;
vertical.options.hideScrollbar = true;

// Destroy
horizontal.destroy();
vertical.destroy();
```

## API

The constructor function takes two arguments:

1. `element: HTMLElement | string` &mdash; *Required*\
  [HTMLElement](https://mdn.io/HTMLElement) or [querySelector string](https://mdn.io/querySelector) *(this will be the `content` of the Fade Scroller)*

2. `options?: object` &mdash; *Optional*\
  Fade Scroller options object

...and returns a **Fade Scroller**:

### Fade Scroller Properties

- `content: HTMLElement`\
  The element selected in the first argument of the constructor function

- `scrollBar: HTMLDivElement`\
  The element with overflow (contains `content` element)

- `wrapper: HTMLDivElement`\
  The outer element (contains `scrollBar` element)

- `contentSize: number`\
  The size of the `content` element *(width if Horizontal, height if Vertical)*

- `wrapperSize: number`\
  The size of the `wrapper` element *(width if Horizontal, height if Vertical)*

- `overflowSize: number`\
  The size of the overflow (`contentSize - wrapperSize`)

- `scrollPosition: number`\
  The scroll position of the `scrollBar` element *([`scrollLeft`](https://mdn.io/scrollLeft) if Horizontal, [`scrollTop`](https://mdn.io/scrollTop) if Vertical)*

- `options: object`\
  The Fade Scroller options object:
  - `hideScrollbar: boolean` &mdash; Default: `false`\
    Hide the scrollbar?
  
  - `captureWheel: boolean` ***(Horizontal only)*** &mdash; Default: `false`\
    Capture [wheel events](https://mdn.io/WheelEvent) and translate to horizontal scroll movement?

### Fade Scroller Methods

- `mount()`\
  Starts observing the Fade Scroller elements to apply the correct classes when the sizes change

- `destroy()`\
  Stops observing the Fade Scroller elements and removes built-in event listeners and styles

- `addScrollListener( callback: EventListener )`\
  Add a `scroll` EventListener to the `scrollBar` element

- `removeScrollListener( callback: EventListener )`\
  Remove a `scroll` EventListener from the `scrollBar` element

---

## Browser Compatibility

Fade Scroll uses [CSS masks](https://caniuse.com/css-masks) to blend seamlessly with any background, however the CSS can be changed to use [linear gradients](https://caniuse.com/css-gradients) for better compatibility if the background is a solid color.

Fade Scroll uses the [Resize Observer API](https://caniuse.com/resizeobserver) to apply the correct styles when the elements sizes change. You can [Ponyfill](https://ponyfill.com/) for unsupporting browsers by using the `setResizeObserver` function:

```js
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';

import * as FadeScroll from '@brybrant/fade-scroll';

FadeScroll.setResizeObserver(Polyfill);

// Create some Fade Scrollers after setting the polyfill...
```
