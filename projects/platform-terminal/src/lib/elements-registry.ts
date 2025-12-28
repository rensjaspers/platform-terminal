import type { Widgets } from 'blessed';

import { blessed, contrib } from './blessed-imports';
import { gridFactory } from './adapters/grid-adapter';
import { deferredElement } from './adapters/deferred';

export type ElementFactory = (options: Record<string, unknown>) => Widgets.BoxElement;

export const elementsFactory: Map<string, ElementFactory> = new Map<string, ElementFactory>()
  .set('text', blessed.text as unknown as ElementFactory)
  .set('box', blessed.box as unknown as ElementFactory)
  .set('table', blessed.table as unknown as ElementFactory)
  .set('line', deferredElement(contrib.line as unknown as ElementFactory))
  .set('sparkline', deferredElement(contrib.sparkline as unknown as ElementFactory))
  .set('bar', deferredElement(contrib.bar as unknown as ElementFactory))
  .set('contrib-table', deferredElement(contrib.table as unknown as ElementFactory))
  .set('map', deferredElement(contrib.map as unknown as ElementFactory))
  .set('grid', gridFactory as unknown as ElementFactory);
