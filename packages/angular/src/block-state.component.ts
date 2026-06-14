import { Component, Input } from '@angular/core';
import { VspIcon } from './icon.component';
import { VspSkeleton } from './feedback.component';

/** A stack of shimmer rows shown while a block's data is loading. */
@Component({
  selector: 'vsp-block-skeleton',
  imports: [VspSkeleton],
  template: `<div style="padding: 14px; display: grid; gap: 16px">
    @for (i of rowList; track i) {
      <div style="display: flex; align-items: center; gap: 12px">
        <vsp-skeleton [w]="32" [h]="32" [r]="9" />
        <vsp-skeleton [w]="30 + ((i * 13) % 35) + '%'" [h]="12" />
        <div style="flex: 1"></div>
        <vsp-skeleton [w]="68" [h]="12" />
      </div>
    }
  </div>`,
})
export class VspBlockSkeleton {
  @Input() rows = 4;
  get rowList(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }
}

/** Default empty placeholder; overridden by a projected `[slot=empty]` node. */
@Component({
  selector: 'vsp-block-empty',
  imports: [VspIcon],
  template: `<div class="ui-empty">
    <vsp-icon name="inbox" [size]="26" />
    <div class="ui-empty-title">{{ title }}</div>
    @if (desc) {
      <div class="ui-empty-desc">{{ desc }}</div>
    }
  </div>`,
})
export class VspBlockEmpty {
  @Input() title = '';
  @Input() desc?: string;
}
