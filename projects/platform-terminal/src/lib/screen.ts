import { Injectable } from "@angular/core";
import type { Widgets } from "blessed";

import { blessed } from "./blessed-imports";
import { ElementFactory, elementsFactory } from "./elements-registry";

@Injectable()
export class Screen {
  private screen!: Widgets.Screen;

  constructor() {
    this.init();
  }

  createElement(
    name: string,
    options: Record<string, unknown> = {}
  ): Widgets.BoxElement {
    let elementFactory: ElementFactory | undefined = elementsFactory.get(name);

    if (!elementFactory) {
      elementFactory = elementsFactory.get("box");
    }

    return elementFactory!({ ...options, screen: this.screen });
  }

  selectRootElement(): Widgets.Screen {
    return this.screen;
  }

  private init(): void {
    this.screen = blessed.screen({ smartCSR: true });
    this.setupExitListener();
  }

  private setupExitListener(): void {
    this.screen.key(["escape", "q", "C-c"], () => process.exit(0));
  }
}
