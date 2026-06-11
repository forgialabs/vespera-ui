import { Component, Input } from '@angular/core';

export type BadgeTone = 'pos' | 'neg' | 'warn' | 'info' | 'muted';

@Component({
  selector: 'vsp-badge',
  template: `<span [class]="cls">
    @if (dot) {
      <i></i>
    }
    <ng-content />
  </span>`,
})
export class VspBadge {
  @Input() tone: BadgeTone = 'muted';
  @Input() dot = false;

  get cls(): string {
    return `badge badge-${this.tone}`;
  }
}
