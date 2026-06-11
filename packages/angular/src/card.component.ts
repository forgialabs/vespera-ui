import { Component, Input } from '@angular/core';

@Component({
  selector: 'vsp-card',
  template: `<div [class]="cls"><ng-content /></div>`,
})
export class VspCard {
  @Input() pad = false;
  get cls(): string {
    return this.pad ? 'card card-pad' : 'card';
  }
}

@Component({
  selector: 'vsp-card-head',
  template: `<div class="card-head">
    <div style="min-width: 0">
      <div class="ttl">{{ title }}</div>
      @if (desc) {
        <div class="eyebrow" style="margin-top: 3px">{{ desc }}</div>
      }
    </div>
    <div class="vsp-top-spacer"></div>
    <ng-content select="[slot=right]" />
  </div>`,
})
export class VspCardHead {
  @Input() title?: string;
  @Input() desc?: string;
}
