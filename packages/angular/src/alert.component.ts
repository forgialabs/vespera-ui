import { Component, Input } from '@angular/core';

export type AlertTone = 'info' | 'pos' | 'warn' | 'neg';

@Component({
  selector: 'vsp-alert',
  template: `<div [class]="cls">
    <ng-content select="[slot=icon]" />
    <div style="flex: 1">
      @if (title) {
        <div class="ui-alert-title">{{ title }}</div>
      }
      <div class="ui-alert-body"><ng-content /></div>
    </div>
    <ng-content select="[slot=action]" />
  </div>`,
})
export class VspAlert {
  @Input() tone: AlertTone = 'info';
  @Input() title?: string;
  get cls(): string {
    return `ui-alert ${this.tone}`;
  }
}
