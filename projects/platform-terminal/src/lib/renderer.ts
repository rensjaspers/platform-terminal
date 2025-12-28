import {
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
  RendererType2,
} from "@angular/core";
import type { Widgets } from "blessed";

import { contrib } from "./blessed-imports";
import { Screen } from "./screen";

@Injectable()
export class TerminalRendererFactory implements RendererFactory2 {
  protected renderer: Renderer2;

  constructor(private screen: Screen) {
    this.renderer = new TerminalRenderer(screen);
  }

  end(): void {
    this.screen.selectRootElement().render();
  }

  createRenderer(
    _hostElement: unknown,
    _type: RendererType2 | null
  ): Renderer2 {
    return this.renderer;
  }
}

export class TerminalRenderer implements Renderer2 {
  readonly data: Record<string, unknown> = {};
  destroyNode: ((node: unknown) => void) | null = null;

  constructor(private screen: Screen) {}

  createElement(
    name: string,
    _namespace?: string | null
  ): Widgets.BlessedElement {
    return this.screen.createElement(name);
  }

  createText(value: string): Widgets.BlessedElement {
    return this.screen.createElement("text", { content: value });
  }

  selectRootElement(): Widgets.Screen {
    return this.screen.selectRootElement();
  }

  addClass(_el: unknown, _name: string): void {
    // Terminal elements don't use CSS classes
  }

  appendChild(
    parent: Widgets.BlessedElement,
    newChild: Widgets.BlessedElement
  ): void {
    if (newChild instanceof contrib.grid) {
      return;
    }

    if (parent instanceof contrib.grid) {
      (newChild as unknown as { appendTo: (parent: unknown) => void }).appendTo(
        parent
      );
      return;
    }

    if (newChild) {
      parent.append(newChild);
    }
  }

  createComment(_value: string): unknown {
    return null;
  }

  destroy(): void {
    // Cleanup if needed
  }

  insertBefore(_parent: unknown, _newChild: unknown, _refChild: unknown): void {
    // Not implemented for terminal
  }

  listen(
    target: Widgets.BlessedElement,
    eventName: string,
    callback: (event: unknown) => boolean | void
  ): () => void {
    target.on(eventName, callback);
    return () => {
      target.off(eventName, callback);
    };
  }

  nextSibling(_node: unknown): unknown {
    return null;
  }

  parentNode(_node: unknown): unknown {
    return null;
  }

  removeAttribute(
    _el: unknown,
    _name: string,
    _namespace?: string | null
  ): void {
    // Not implemented
  }

  removeChild(
    parent: Widgets.BlessedElement,
    oldChild: Widgets.BlessedElement
  ): void {
    if (parent && oldChild) {
      parent.remove(oldChild);
    }
  }

  removeClass(_el: unknown, _name: string): void {
    // Terminal elements don't use CSS classes
  }

  removeStyle(
    _el: unknown,
    _style: string,
    _flags?: RendererStyleFlags2
  ): void {
    // Not implemented
  }

  setAttribute(
    el: Widgets.BlessedElement,
    name: string,
    value: string,
    _namespace?: string | null
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any)[name] = value;
  }

  setProperty(el: Widgets.BlessedElement, name: string, value: unknown): void {
    const propertyName = name === "styles" ? "style" : name;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any)[propertyName] = value;
  }

  setStyle(
    el: Widgets.BlessedElement,
    style: string,
    value: unknown,
    _flags?: RendererStyleFlags2
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any)[style] = value;
  }

  setValue(node: Widgets.BlessedElement, value: string): void {
    node.setContent(value);
  }
}
