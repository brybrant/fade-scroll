import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

import { createFileLoader } from '../utils/file-loader.ts';
import { Rewriter } from '../utils/rewriter.ts';

import type {
  Horizontal,
  Vertical,
  setResizeObserver,
} from '@brybrant/fade-scroll';

type FadeScrollerAPI = {
  Horizontal: typeof Horizontal;
  Vertical: typeof Vertical;
  setResizeObserver: typeof setResizeObserver;
};

declare global {
  interface Window {
    getState: (
      scroller: Horizontal | Vertical,
      horizontal?: boolean,
    ) => {
      contentPerpendicular: number;
      wrapperPerpendicular: number;
      position: number;
      overflow: number;
      start: boolean;
      end: boolean;
    };
    nextFrame: () => Promise<void>;
    FadeScroll: FadeScrollerAPI;
    horizontal: Horizontal;
    vertical: Vertical;
  }
}

const cwd = process.cwd();

const load = createFileLoader(resolve(cwd, 'test'));

const rewriter = new Rewriter(load);

const html = await load('./test.html').then(async ({ data }) => {
  data = await rewriter.transform(data);

  return data;
});

test('Fade Scroller', async ({ page }) => {
  await page.setContent(html);

  await test.step('Constructor (element)', async () => {
    await page.evaluate(() => {
      window.horizontal = new window.FadeScroll.Horizontal(
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        document.getElementById('horizontal')!,
      );
    });
  });

  await test.step('Constructor (selector)', async () => {
    await page.evaluate(() => {
      window.vertical = new window.FadeScroll.Vertical('#vertical');
    });
  });

  await test.step('Constructor (invalid)', async () => {
    const threw = await page.evaluate(() => {
      try {
        new window.FadeScroll.Horizontal('.undefined');
        return false;
      } catch {
        return true;
      }
    });

    expect(threw).toBe(true);
  });

  const axes = ['horizontal', 'vertical'] as const;

  for (const axis of axes) {
    const horizontal = axis === 'horizontal';

    const data = {
      horizontal,
      axis,
      resize: horizontal ? 'width' : 'height',
      scroll: horizontal ? 'scrollLeft' : 'scrollTop',
      hide: horizontal ? 'height' : 'width',
    } as const;

    await test.step(`Lifecycle (mount) - ${axis}`, async () => {
      const mounted = await page.evaluate((params) => {
        window[params.axis].mount();

        return window[params.axis].wrapper.parentElement !== null;
      }, data);

      expect(mounted).toBe(true);
    });

    await test.step(`Lifecycle (destroy) - ${axis}`, async () => {
      const destroyed = await page.evaluate((params) => {
        window[params.axis].destroy();

        return window[params.axis].wrapper.parentElement === null;
      }, data);

      expect(destroyed).toBe(true);
    });

    await test.step(`Lifecycle (re-mount) - ${axis}`, async () => {
      const mounted = await page.evaluate((params) => {
        window[params.axis].mount();

        return window[params.axis].wrapper.parentElement !== null;
      }, data);

      expect(mounted).toBe(true);
    });

    await test.step(`Overflow (start) - ${axis}`, async () => {
      const state = await page.evaluate(async (params) => {
        const scroller = window[params.axis];

        scroller.scrollBar[params.scroll] = 0;

        await window.nextFrame();

        return window.getState(window[params.axis]);
      }, data);

      expect(state.position).toBe(0);
      expect(state.start).toBe(false);
      expect(state.end).toBe(true);
    });

    await test.step(`Overflow (middle) - ${axis}`, async () => {
      const state = await page.evaluate(async (params) => {
        const scroller = window[params.axis];

        scroller.scrollBar[params.scroll] = scroller.overflowSize / 2;

        await window.nextFrame();

        return window.getState(scroller);
      }, data);

      expect(state.position).toBe(25);
      expect(state.start).toBe(true);
      expect(state.end).toBe(true);
    });

    await test.step(`Overflow (end) - ${axis}`, async () => {
      const state = await page.evaluate(async (params) => {
        const scroller = window[params.axis];

        scroller.scrollBar[params.scroll] = scroller.overflowSize;

        await window.nextFrame();

        const state = window.getState(scroller);

        scroller.scrollBar[params.scroll] = 0;

        await window.nextFrame();

        return state;
      }, data);

      expect(state.position).toBe(50);
      expect(state.start).toBe(true);
      expect(state.end).toBe(false);
    });

    await test.step(`Resize (content) - ${axis}`, async () => {
      const state = await page.evaluate(async (params) => {
        const scroller = window[params.axis];

        scroller.content.style[params.resize] = '50px';

        await window.nextFrame();

        const state = window.getState(scroller);

        scroller.content.style[params.resize] = '';

        await window.nextFrame();

        return state;
      }, data);

      expect(state.overflow).toBe(-50);
      expect(state.start).toBe(false);
      expect(state.end).toBe(false);
    });

    await test.step(`Resize (wrapper) - ${axis}`, async () => {
      const state = await page.evaluate(async (params) => {
        const scroller = window[params.axis];

        scroller.wrapper.style[params.resize] = '50px';

        await window.nextFrame();

        const state = window.getState(scroller);

        scroller.wrapper.style[params.resize] = '';

        await window.nextFrame();

        return state;
      }, data);

      expect(state.overflow).toBe(100);
      expect(state.start).toBe(false);
      expect(state.end).toBe(true);
    });

    await test.step(`Hide scrollbar - ${axis}`, async () => {
      const hidden = await page.evaluate(async (params) => {
        const scroller = window[params.axis];

        const startState = window.getState(scroller, params.horizontal);

        /** Scrollbar is ephemeral and therefore cannot be hidden */
        if (
          startState.contentPerpendicular === startState.wrapperPerpendicular
        ) {
          return true;
        }

        scroller.hideScrollbar = true;

        await window.nextFrame();

        const endState = window.getState(scroller, params.horizontal);

        return endState.contentPerpendicular === endState.wrapperPerpendicular;
      }, data);

      expect(hidden).toBe(true);
    });
  }

  await test.step(`Wheel capture - (horizontal only)`, async () => {
    await page.mouse.move(50, 50);

    await page.evaluate(() => {
      const scroller = window.horizontal;

      scroller.captureWheel = true;
    });

    await page.mouse.wheel(1, 0);

    const position1 = await page.evaluate(async () => {
      await window.nextFrame();

      return window.horizontal.scrollPosition;
    });

    expect(position1).toBe(1);

    await page.mouse.wheel(0, 1);

    const position2 = await page.evaluate(async () => {
      await window.nextFrame();

      const scroller = window.horizontal;

      scroller.captureWheel = false;

      return scroller.scrollPosition;
    });

    expect(position2).toBe(2);

    await page.mouse.wheel(0, 1);

    const position3 = await page.evaluate(async () => {
      await window.nextFrame();

      return window.horizontal.scrollPosition;
    });

    expect(position3).toBe(2);
  });
});
