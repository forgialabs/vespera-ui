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
