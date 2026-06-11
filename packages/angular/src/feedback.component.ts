import { Component, Input } from '@angular/core';

@Component({
  selector: 'vsp-spinner',
  template: `<span [class]="cls" aria-hidden="true"></span>`,
})
export class VspSpinner {
  @Input() size?: 'lg';
  get cls(): string {
    return this.size === 'lg' ? 'ui-spinner lg' : 'ui-spinner';
  }
}

@Component({
  selector: 'vsp-icon-button',
  template: `<button type="button" class="vsp-icon-btn" [attr.aria-label]="label">
    <ng-content />
  </button>`,
})
export class VspIconButton {
  @Input() label?: string;
}

@Component({
  selector: 'vsp-progress',
  template: `<div class="meter" [style.height.px]="height">
    <i [style.width.%]="clamped" [style.background]="tone" style="transition: width 0.3s"></i>
  </div>`,
})
export class VspProgress {
  @Input() value = 0;
  @Input() tone?: string;
  @Input() height = 6;
  get clamped(): number {
    return Math.min(100, this.value);
  }
}

@Component({
  selector: 'vsp-skeleton',
  template: `<div
    class="skel"
    [style.width]="px(w)"
    [style.height]="px(h)"
    [style.borderRadius]="px(r)"
  ></div>`,
})
export class VspSkeleton {
  @Input() w: string | number = '100%';
  @Input() h: string | number = 12;
  @Input() r: number = 7;
  px(v: string | number): string {
    return typeof v === 'number' ? `${v}px` : v;
  }
}
