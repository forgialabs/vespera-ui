import { Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'ghost' | 'subtle' | 'outline' | 'danger';

@Component({
  selector: 'vsp-button',
  template: `<button [class]="cls" [disabled]="disabled || loading">
    @if (loading) {
      <span class="ui-spinner" aria-hidden="true"></span>
    }
    <ng-content />
  </button>`,
})
export class VspButton {
  @Input() variant: ButtonVariant = 'ghost';
  @Input() size?: 'sm';
  @Input() loading = false;
  @Input() disabled = false;

  get cls(): string {
    return ['btn', `btn-${this.variant}`, this.size === 'sm' ? 'btn-sm' : '']
      .filter(Boolean)
      .join(' ');
  }
}
