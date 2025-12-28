import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'pl-2-text-in-box',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <box top="center"
         left="center"
         height="5"
         width="21"
         [style]="style">
      <box top="2" left="1" [style]="style">
        BOXES ARE BORING!
      </box>
    </box>
  `,
})
export class TextInBoxComponent {
  style = {
    fg: 'white',
    bg: 'green',
    border: {
      fg: 'red',
    },
  };
}
