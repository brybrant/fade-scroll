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

```js
// index.js
import * as FadeScroll from '@brybrant/fade-scroll';

new FadeScroll.Horizontal('#horizontal').mount();

new FadeScroll.Vertical('#vertical').mount();
```

## API

The constructor function takes two arguments:

1. `element: HTMLElement | string`\
  [HTMLElement](https://mdn.io/HTMLElement) or [querySelector string](https://mdn.io/querySelector)

2. `options?: Options`\
  [Options object](#Fade_Scroller_Options)

### Fade Scroller Options

- `hideScrollbar: boolean` - Default: `false`\
  Hides the scrollbar when set to `true`

- `captureWheel: boolean` - Default: `false`\
  Capture [wheel events](https://mdn.io/WheelEvent) to translate vertical wheel spin to horizontal scroll movement when set to `true` **(Horizontal only)** 

### Fade Scroller Methods

- `mount()`\
  Starts observing the Fade Scroller elements to apply the appropriate styles when the sizes change

- `destroy()`\
  Stops observing the Fade Scroller elements and removes all event listeners and styles

---

## Browser Compatibility

Fade Scroll uses [CSS masks](https://caniuse.com/css-masks) to blend seamlessly with any background, however the CSS can be changed to use [linear gradients](https://caniuse.com/css-gradients) for better compatibility if the background is a solid color.

Fade Scroll uses the [Resize Observer API](https://caniuse.com/resizeobserver) to apply the correct styles when the elements sizes change. You can provide a fallback [Polyfill](https://mdn.io/Polyfill) for unsupporting browsers with the helper method:

```js
import polyfill from 'resize-observer-polyfill';

import * as FadeScroll from '@brybrant/fade-scroll';

FadeScroll.setResizeObserver( polyfill );
```
