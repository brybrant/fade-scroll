# Fade Scroll

<img src='https://img.shields.io/badge/gzipped-1.2_KB-blue'>

Fade Scroll is a tiny, zero-dependency cosmetic addon for scrollable content which adds subtle gradient masks to scrollable content.

See the [demo page](brybrant.github.io/fade-scroll/) for an interactive demonstration.

## Install

```bash
$ npm i github:brybrant/fade-scroll
```

## Setup

```html
<html>
  <head>
    <link rel='stylesheet' href='/fade-scroll.css'/>
  </head>
  <body>
    <div id='horizontal'>
      <p>Some horizontal overflowing content...</p>
    </div>

    <div id='vertical'>
      <p>Some vertical overflowing content...</p>
    </div>

    <script type='module' src='/index.js'></script>
  </body>
</html>
```

*See [fade-scroll.css](./dist/fade-scroll.css) for the Fade Scroll styles.*

### Basic Usage

```js
// index.js
import * as FadeScroll from '@brybrant/fade-scroll';

new FadeScroll.Horizontal('#horizontal').mount();

const verticalScroller = new FadeScroll.Vertical('#vertical').mount();

verticalScroller.destroy();
```

### Settings and Changing Options

```js
// index.js
import { Horizontal } from '@brybrant/fade-scroll';

const horizontalElement = document.getElementById('horizontal');

const horizontalScroller = new Horizontal(horizontalElement, {
  captureWheel: true,
});

horizontalScroller.options.captureWheel = false;
```

## API

The constructor function takes two arguments:

1. `element: HTMLElement | string` - *Required*\
  [HTMLElement](https://mdn.io/HTMLElement) or [querySelector string](https://mdn.io/querySelector) (this will be the `content` of the Fade Scroller)

2. `options?: object` - *Optional*\
  [Fade Scroller options object](#fade-scroller-options)

### Fade Scroller Properties

- `content: HTMLElement`\
  The element selected in the first argument of the constructor function

- `scrollBar: HTMLDivElement`\
  The element with overflow (contains `content` element)

- `wrapper: HTMLDivElement`\
  The outer element (contains `scrollBar` element)

- `contentSize: number`\
  The size of the `content` element (width if Horizontal, height if Vertical)

- `wrapperSize: number`\
  The size of the `wrapper` element (width if Horizontal, height if Vertical)

- `overflowSize: number`\
  The size of the overflow (`contentSize - wrapperSize`)

- `scrollPosition: number`\
  The scroll position of the `scrollBar` element (scrollLeft if Horizontal, scrollTop if Vertical)

- `options: object`\
  The Fade Scroller options object:
  - `hideScrollbar: boolean` - Default: `false`\
    Hide the scrollbar?
  
  - `captureWheel: boolean` ***(Horizontal only)*** - Default: `false`\
    Capture [wheel events](https://mdn.io/WheelEvent) and translate to horizontal scroll movement?

### Fade Scroller Methods

- `mount()`\
  Starts observing the Fade Scroller elements to apply the appropriate styles when the sizes change

- `destroy()`\
  Stops observing the Fade Scroller elements and removes built-in event listeners and styles

- `addScrollListener(callback: EventListener)`\
  Add a `scroll` EventListener to the `scrollBar` element

- `removeScrollListener(callback: EventListner)`\
  Remove a `scroll` EventListener from the `scrollBar` element

---

## Browser Compatibility

Fade Scroll uses [CSS masks](https://caniuse.com/css-masks) to blend seamlessly with any background, however the CSS can be changed to use [linear gradients](https://caniuse.com/css-gradients) for better compatibility if the background is a solid color.

Fade Scroll uses the [Resize Observer API](https://caniuse.com/resizeobserver) to apply the correct styles when the elements sizes change. You can provide a fallback [Polyfill](https://mdn.io/Polyfill) for unsupporting browsers with the `setResizeObserver` helper method:

```js
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';

import * as FadeScroll from '@brybrant/fade-scroll';

FadeScroll.setResizeObserver(Polyfill);
```

Note: This is not necessary if using the old [resize observer polyfill](https://www.npmjs.com/package/resize-observer-polyfill) package