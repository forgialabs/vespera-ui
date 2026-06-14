import { Component, Input } from '@angular/core';

@Component({
  selector: 'vsp-spinner',
  template: `<span
    [class]="cls"
    [attr.role]="label ? 'status' : null"
    [attr.aria-label]="label"
    [attr.aria-hidden]="label ? null : 'true'"
  ></span>`,
})
export class VspSpinner {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() label?: string;
  get cls(): string {
    return 'ui-spinner' + (this.size === 'sm' ? ' sm' : '') + (this.size === 'lg' ? ' lg' : '');
  }
}

export type IconButtonVariant = 'ghost' | 'subtle' | 'danger';

@Component({
  selector: 'vsp-icon-button',
  template: `<button
    type="button"
    [class]="cls"
    [attr.aria-label]="label"
    [disabled]="disabled || loading"
    [attr.aria-busy]="loading || null"
  >
    @if (loading) {
      <span class="ui-spinner" aria-hidden="true"></span>
    } @else {
      <ng-content />
    }
  </button>`,
})
export class VspIconButton {
  @Input() label?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant?: IconButtonVariant;
  @Input() loading = false;
  @Input() disabled = false;
  get cls(): string {
    return [
      'vsp-icon-btn',
      this.size === 'sm' ? 'vsp-icon-btn-sm' : '',
      this.size === 'lg' ? 'vsp-icon-btn-lg' : '',
      this.variant ? `vsp-icon-btn-${this.variant}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}

@Component({
  selector: 'vsp-progress',
  template: `<div
    [class]="indeterminate ? 'meter indeterminate' : 'meter'"
    [style.height.px]="height"
    role="progressbar"
    [attr.aria-label]="label"
    [attr.aria-valuemin]="indeterminate ? null : 0"
    [attr.aria-valuemax]="indeterminate ? null : max"
    [attr.aria-valuenow]="indeterminate ? null : value"
  >
    @if (indeterminate) {
      <i [style.background]="tone"></i>
    } @else {
      <i [style.width.%]="pct" [style.background]="tone" style="transition: width 0.3s"></i>
    }
  </div>`,
})
export class VspProgress {
  @Input() value = 0;
  @Input() tone?: string;
  @Input() height = 6;
  @Input() max = 100;
  @Input() indeterminate = false;
  @Input() label?: string;
  get pct(): number {
    return Math.min(100, Math.max(0, (this.value / this.max) * 100));
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
