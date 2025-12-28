import type { Widgets } from "blessed";
import type { Widgets as ContribWidgets } from "blessed-contrib";

import { contrib } from "../blessed-imports";

interface GridOptions extends ContribWidgets.GridOptions {
  screen: Widgets.Screen;
}

// We store the grid along with its screen for later reference
const gridScreenMap = new WeakMap<ContribWidgets.GridElement, Widgets.Screen>();

export function gridFactory(options: GridOptions): Widgets.BlessedElement {
  // The grid MUST have a screen in its options for blessed-contrib to work
  if (!options.screen) {
    throw new Error("Grid requires a screen option");
  }

  // Create the grid - blessed-contrib requires rows and cols to be numbers, not strings
  // They may come in as strings from Angular template attributes
  const gridOptions: GridOptions = {
    ...options,
    rows: typeof options.rows === "string" ? parseInt(options.rows, 10) : options.rows || 12,
    cols: typeof options.cols === "string" ? parseInt(options.cols, 10) : options.cols || 12,
  };

  const grid: ContribWidgets.GridElement = new contrib.grid(gridOptions);
  
  // Store the screen reference for later use by child elements
  gridScreenMap.set(grid, options.screen);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Proxy(grid as any, {
    set(
      target: ContribWidgets.GridElement,
      p: PropertyKey,
      value: unknown
    ): boolean {
      if (p === "rows" || p === "cols") {
        // Convert string to number if needed
        const numValue = typeof value === "string" ? parseInt(value, 10) : +value!;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[p] = numValue;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[p as string] = value;
      }
      return true;
    },
    get(target: ContribWidgets.GridElement, p: PropertyKey): unknown {
      // Expose the screen via a special property
      if (p === "_gridScreen") {
        return gridScreenMap.get(target);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any)[p];
    },
  }) as Widgets.BlessedElement;
}

// Export helper to get screen from grid
export function getScreenFromGrid(grid: ContribWidgets.GridElement): Widgets.Screen | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (grid as any)._gridScreen || gridScreenMap.get(grid);
}
