import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";

import { PlainTextComponent } from "./1-plain-text/1-plain-text.component";
import { TextInBoxComponent } from "./2-text-in-box/2-text-in-box.component";
import { DashboardComponent } from "./3-dashboard/3-dashboard.component";

@Component({
  selector: "pl-root",
  standalone: true,
  imports: [PlainTextComponent, TextInBoxComponent, DashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!--<pl-1-plain-text />-->
    <!--<pl-2-text-in-box />-->
    <pl-3-dashboard />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
