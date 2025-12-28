import "@angular/compiler";
import "zone.js";

import { DOCUMENT } from "@angular/common";
import {
  APP_ID,
  ApplicationRef,
  EnvironmentProviders,
  ErrorHandler,
  importProvidersFrom,
  ɵINTERNAL_APPLICATION_ERROR_HANDLER as INTERNAL_APPLICATION_ERROR_HANDLER,
  ɵinternalCreateApplication as internalCreateApplication,
  Provider,
  provideZoneChangeDetection,
  RendererFactory2,
  Sanitizer,
  Type,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { TerminalErrorHandler } from "./error-handler";
import { TerminalRendererFactory } from "./renderer";
import { TerminalSanitizer } from "./sanitizer";
import { Screen } from "./screen";

/**
 * Creates a minimal document-like object for the terminal platform.
 */
function createMinimalDocument(): Document {
  const body = {
    appendChild: () => body,
    removeChild: () => body,
    insertBefore: () => body,
    contains: () => false,
    querySelectorAll: () => [],
    style: {},
  } as unknown as HTMLElement;

  const doc = {
    body,
    documentElement: body,
    createElement: (tag: string) =>
      ({
        tagName: tag,
        setAttribute: () => {},
        getAttribute: () => null,
        appendChild: () => {},
        removeChild: () => {},
        style: {},
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false,
        },
      } as unknown as HTMLElement),
    createComment: () => ({} as Comment),
    createTextNode: (text: string) => ({ textContent: text } as Text),
    querySelector: () => null,
    querySelectorAll: () => [] as unknown as NodeListOf<Element>,
    addEventListener: () => {},
    removeEventListener: () => {},
    defaultView: {
      getComputedStyle: () => ({ getPropertyValue: () => "" }),
      addEventListener: () => {},
      removeEventListener: () => {},
      document: null as unknown as Document,
    } as unknown as Window,
    head: body,
  };

  // Make defaultView.document circular
  (doc.defaultView as { document: Document }).document =
    doc as unknown as Document;

  return doc as unknown as Document;
}

// Create and install the terminal document globally
const TERMINAL_DOCUMENT = createMinimalDocument();

// Install global document for Angular's internal usage
if (typeof globalThis.document === "undefined") {
  (globalThis as { document: Document }).document = TERMINAL_DOCUMENT;
}

/**
 * Provides the terminal platform configuration for Angular applications.
 * Use this with your own bootstrap setup.
 */
export function provideTerminalPlatform(): (Provider | EnvironmentProviders)[] {
  return [
    // DOCUMENT must come first to override BrowserModule's provider
    { provide: DOCUMENT, useValue: TERMINAL_DOCUMENT },
    { provide: APP_ID, useValue: "terminal-app" },
    provideZoneChangeDetection(),
    {
      provide: INTERNAL_APPLICATION_ERROR_HANDLER,
      useFactory: () => (e: unknown) => {
        throw e;
      },
    },
    // Import BrowserModule for core Angular functionality, but override DOCUMENT
    importProvidersFrom(BrowserModule),
    Screen,
    { provide: Sanitizer, useClass: TerminalSanitizer },
    {
      provide: RendererFactory2,
      useClass: TerminalRendererFactory,
      deps: [Screen],
    },
    { provide: ErrorHandler, useClass: TerminalErrorHandler },
  ];
}

/**
 * Bootstrap options for terminal applications
 */
export interface TerminalBootstrapOptions {
  providers?: (Provider | EnvironmentProviders)[];
}

/**
 * Bootstrap an Angular application for the terminal platform.
 *
 * @example
 * ```typescript
 * bootstrapTerminalApplication(AppComponent, {
 *   providers: [MyService]
 * });
 * ```
 */
export async function bootstrapTerminalApplication<T>(
  rootComponent: Type<T>,
  options?: TerminalBootstrapOptions
): Promise<ApplicationRef> {
  const allProviders: (Provider | EnvironmentProviders)[] = [
    ...provideTerminalPlatform(),
    ...(options?.providers ?? []),
  ];

  // Use internal API to create application
  const appRef = await internalCreateApplication({
    rootComponent,
    appProviders: allProviders,
  });

  // Get the screen and renderer to do initial render
  const rendererFactory = appRef.injector.get(
    RendererFactory2
  ) as TerminalRendererFactory;

  // Trigger initial render
  rendererFactory.end();

  return appRef;
}
