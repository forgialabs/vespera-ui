import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vsp-switch',
  template: `<button
    type="button"
    [disabled]="disabled"
    [class]="cls"
    [attr.aria-pressed]="checked"
    aria-label="Toggle"
    (click)="toggle()"
  ></button>`,
})
export class VspSwitch {
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  @Input() size?: 'sm';
  @Input() disabled = false;
  get cls(): string {
    return ['ui-switch', this.size === 'sm' && 'sm', this.checked && 'on']
      .filter(Boolean)
      .join(' ');
  }
  toggle(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}

@Component({
  selector: 'vsp-checkbox',
  template: `<label class="ui-opt" [style.opacity]="disabled ? 0.5 : 1">
    <input
      type="checkbox"
      [checked]="checked"
      [disabled]="disabled"
      (change)="toggle()"
      style="position: absolute; width: 1px; height: 1px; opacity: 0; margin: 0"
    />
    <span
      [id]="id"
      role="checkbox"
      [attr.aria-checked]="indeterminate ? 'mixed' : checked"
      [attr.aria-invalid]="invalid || null"
      [class]="checkCls"
    ></span>
    <span>
      <span>{{ label }}</span>
      @if (sub) {
        <span class="ui-opt-sub">{{ sub }}</span>
      }
    </span>
  </label>`,
})
export class VspCheckbox {
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  @Input() label?: string;
  @Input() sub?: string;
  @Input() disabled = false;
  @Input() indeterminate = false;
  @Input() invalid = false;
  @Input() id?: string;
  get checkCls(): string {
    return (
      'ui-check' +
      (this.checked || this.indeterminate ? ' on' : '') +
      (this.indeterminate ? ' mixed' : '') +
      (this.invalid ? ' invalid' : '')
    );
  }
  toggle(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
