import { Injectable, Sanitizer, SecurityContext } from '@angular/core';

@Injectable()
export class TerminalSanitizer extends Sanitizer {
  override sanitize(_context: SecurityContext, value: string): string {
    return value;
  }
}
