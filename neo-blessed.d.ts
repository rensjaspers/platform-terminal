// Type declarations for neo-blessed
// neo-blessed is API-compatible with blessed, so we declare it to use blessed types

declare module 'neo-blessed' {
  import * as blessed from 'blessed';
  export = blessed;
}

