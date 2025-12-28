/*
 * Public API Surface of platform-terminal
 */

export { bootstrapTerminalApplication, provideTerminalPlatform } from './lib/platform';
export { Screen } from './lib/screen';
export { TerminalRenderer, TerminalRendererFactory } from './lib/renderer';
export { TerminalSanitizer } from './lib/sanitizer';
export { TerminalErrorHandler } from './lib/error-handler';
export { elementsFactory, type ElementFactory } from './lib/elements-registry';
