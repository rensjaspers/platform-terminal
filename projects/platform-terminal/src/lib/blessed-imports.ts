import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const blessed = require('neo-blessed');
export const contrib = require('blessed-contrib');

