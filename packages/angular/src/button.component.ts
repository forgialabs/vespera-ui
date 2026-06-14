import { Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'ghost' | 'subtle' | 'outline' | 'danger';

@Component({
  selector: 'vsp-button',
  template: `<button
    [class]="cls"
    [disabled]="disabled || loading"
    [attr.aria-busy]="loading || null"
  >
    @if (loading) {
      <span class="ui-spinner" aria-hidden="true"></span>
    }
    @if (loading && loadingText != null) {
      {{ loadingText }}
    } @else {
      <ng-content />
    }
  </button>`,
})
export class VspButton {
  @Input() variant: ButtonVariant = 'ghost';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading = false;
  @Input() loadingText?: string;
  @Input() fullWidth = false;
  @Input() disabled = false;

  get cls(): string {
    return [
      'btn',
      `btn-${this.variant}`,
      this.size === 'sm' ? 'btn-sm' : '',
      this.size === 'lg' ? 'btn-lg' : '',
      this.fullWidth ? 'btn-block' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
