import type { Widgets } from "blessed";
import type { Widgets as ContribWidgets } from "blessed-contrib";
import type { ElementFactory } from "../elements-registry";

import { contrib } from "../blessed-imports";

interface DeferredGridChildElementParams {
  row?: number;
  col?: number;
  rowSpan?: number;
  colSpan?: number;
  [key: string]: unknown;
}

interface DeferredElementLike {
  setData: (...args: unknown[]) => void;
  focus: () => void;
}

class DeferredElement {
  parent: ContribWidgets.GridElement | null = null;
  props: DeferredGridChildElementParams = {};
  data: unknown;
  element: DeferredElementLike | null = null;
  screen: Widgets.Screen | null = null;

  appendTo(parent: ContribWidgets.GridElement): void {
    this.parent = parent;
  }
}

/**
 * Since not all elements can be rendered as soon as they are added to the parent element
 * we need to wait until all required properties assigned and only then we can render an element.
 * That's we're providing deferredElement here. It intercepts all calls to the element factory,
 * then, waits until all required properties assigned and only then actually renders an element.
 */
export const deferredElement = (
  elementFactory: ElementFactory
): ElementFactory => {
  return (options: Record<string, unknown>): Widgets.BoxElement => {
    const screen = options["screen"] as Widgets.Screen;

    // Temp object that contains all properties until element rendered
    const temp = new DeferredElement();
    temp.screen = screen;

    // Creating a proxy to intercept all calls to the element factory
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Proxy(temp as any, {
      set(target: DeferredElement, p: PropertyKey, value: unknown): boolean {
        if (target.element) {
          // If we already have an element assign props and recreate
          assignToExistingElement(target, elementFactory, p, value);
          return true;
        }

        if (p === "parent") {
          // If assigning parent just store it in the separate field
          target.parent = value as ContribWidgets.GridElement;
          // Try to render now that we have the parent
          tryRender(elementFactory, target);
          return true;
        }

        // All the props are stored here
        target.props[p as string] = value;

        // Try to render if we have all requirements
        tryRender(elementFactory, target);

        return true;
      },
    }) as Widgets.BoxElement;
  };
};

const tryRender = (
  elementFactory: ElementFactory,
  target: DeferredElement
): void => {
  // Only render if we have parent AND all required props AND element not yet created
  if (target.parent && hasRequiredProps(target) && !target.element) {
    renderElement(elementFactory, target);
  }
};

const assignToExistingElement = (
  target: DeferredElement,
  elementFactory: ElementFactory,
  p: PropertyKey,
  value: unknown
): void => {
  if (p === "data" && value) {
    // Depending on type of the element it can accept data in different formats.
    // So, here we have a quick fix.
    if (elementFactory === (contrib.line as unknown as ElementFactory)) {
      // For instance line accepts an array of lines as one param.
      target.element!.setData(value);
    } else {
      // Meanwhile, other elements require parameters to be spread
      const args = Array.isArray(value) ? value : [value];
      target.element!.setData.apply(target.element, args);
    }

    // When data loaded to the element we need to store it for the rerendering purpose
    target.data = value;
  } else {
    // If assigning not data parameter element has to be recreated.
    // So, just store a new value
    target.props[p as string] = value;

    // Completely remove element from the screen
    target.screen!.remove(target.element as unknown as Widgets.BlessedElement);

    // And create new element with new params
    target.element = create(target, elementFactory);
  }

  // It's just a trick for demo :)
  // Focusing element if it's a table
  if (elementFactory === (contrib.table as unknown as ElementFactory)) {
    target.element!.focus();
  }
};

const create = (
  target: DeferredElement,
  elementFactory: ElementFactory
): DeferredElementLike => {
  const { parent, props, data, screen } = target;
  const { row, col, rowSpan, colSpan, ...opts } = props;

  // We need to create the widget manually with the screen option
  // because blessed-contrib's grid.set() doesn't pass screen to child widgets
  const top = +row! * 8.333333333333334 + "%";
  const left = +col! * 8.333333333333334 + "%";
  const width = 8.333333333333334 * +colSpan! + "%";
  const height = 8.333333333333334 * +rowSpan! + "%";

  const widgetOptions = {
    ...opts,
    data,
    top,
    left,
    width,
    height,
    screen, // Pass screen so blessed can find it!
    border: { type: "line", fg: "cyan" },
  };

  // Create the widget directly with screen option
  const instance = elementFactory(widgetOptions as Record<string, unknown>);

  // Append to screen
  screen!.append(instance as Widgets.BlessedElement);

  return instance as unknown as DeferredElementLike;
};

const renderElement = (
  elementFactory: ElementFactory,
  target: DeferredElement
): boolean => {
  // Quick fix for demo - can't render table without columnWidth property.
  if (
    elementFactory === (contrib.table as unknown as ElementFactory) &&
    !target.props["columnWidth"]
  ) {
    return true;
  }

  // Actually creating an element
  target.element = create(target, elementFactory);

  // It's just a trick for demo :)
  // Focusing element if it's a table
  if (elementFactory === (contrib.table as unknown as ElementFactory)) {
    target.element.focus();
  }

  return true;
};

const hasRequiredProps = (obj: DeferredElement): boolean => {
  return requiredProps.every((prop: string) =>
    Object.prototype.hasOwnProperty.call(obj.props, prop)
  );
};

const requiredProps = ["row", "col", "rowSpan", "colSpan"];
