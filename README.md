# Fade Scroll

<img src='https://img.shields.io/badge/gzipped-1.17_KB-blue'> <img src='https://img.shields.io/badge/dependencies-0-292'>

Fade Scroll is a cosmetic module which adds subtle gradient masks to the overflow of scrollable content.

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

1. #### `element` &mdash; *Required*
    [HTMLElement](https://mdn.io/HTMLElement) or [querySelector string](https://mdn.io/querySelector) *(this will be the `content` of the Fade Scroller)*\
    &#9642; Type: `HTMLElement` | `String`

2. #### `options` &mdash; *Optional*
    [Fade Scroller options object](#options)\
    &#9642; Type: `Object`

...and returns a **Fade Scroller**:

### Fade Scroller Properties:

- #### `content`
  The element selected in the first argument of the constructor function\
  &#9642; Type: `HTMLElement`

- #### `scrollBar`
  The element with overflow *(contains `content` element)*\
  &#9642; Type: `HTMLDivElement`

- #### `wrapper`
  The outer element *(contains `scrollBar` element)*\
  &#9642; Type: `HTMLDivElement`

- #### `contentSize`
  The size of the `content` element:\
  &#9642; Type: `Number`
    - *Horizontal &mdash; [`offsetWidth`](https://mdn.io/offsetWidth)*
    - *Vertical &mdash; [`offsetHeight`](https://mdn.io/offsetHeight)*

- #### `wrapperSize`
  The size of the `wrapper` element:\
  &#9642; Type: `Number`
    - *Horizontal &mdash; [`offsetWidth`](https://mdn.io/offsetWidth)*
    - *Vertical &mdash; [`offsetHeight`](https://mdn.io/offsetHeight)*

- #### `overflowSize`
  The size of the overflow (`contentSize - wrapperSize`)\
  &#9642; Type: `Number`

- #### `scrollPosition` &mdash; *Read / Write*
  The scroll position of the `scrollBar` element:\
  &#9642; Type: `Number`
    - *Horizontal &mdash; [`scrollLeft`](https://mdn.io/scrollLeft)*
    - *Vertical &mdash; [`scrollTop`](https://mdn.io/scrollTop)*

- #### `options`
  The Fade Scroller options:\
  &#9642; Type: `Object`\
  &#9642; Properties:
    - `hideScrollbar`\
      Hide the scrollbar?
      &#9642; Type: `Boolean`
      &#9642; Default: `false`
  
    - `captureWheel` ***(Horizontal only)***\
      Capture [wheel events](https://mdn.io/WheelEvent) and translate to horizontal scroll movement?
      &#9642; Type: `Boolean`
      &#9642; Default: `false`

### Fade Scroller Methods:

- #### `mount()`
  Starts observing the Fade Scroller elements to apply the correct classes when the sizes change

- #### `destroy()`
  Stops observing the Fade Scroller elements and removes built-in event listeners and styles

- #### `addScrollListener( callback: EventListener )`
  Add a `scroll` EventListener to the `scrollBar` element

- #### `removeScrollListener( callback: EventListener )`
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
