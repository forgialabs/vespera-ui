import { Component, EventEmitter, Input, Output } from '@angular/core';

export type NativeSelectOption =
  | string
  | { value: string; label: string; sub?: string; disabled?: boolean };

const val = (o: NativeSelectOption): string => (typeof o === 'string' ? o : o.value);
const lbl = (o: NativeSelectOption): string => (typeof o === 'string' ? o : o.label);
const subOf = (o: NativeSelectOption): string | undefined =>
  typeof o === 'object' ? o.sub : undefined;

@Component({
  selector: 'vsp-radio',
  template: `<label class="ui-opt" [style.opacity]="disabled ? 0.5 : 1">
    <input
      type="radio"
      [name]="name"
      [value]="value"
      [checked]="checked"
      [disabled]="disabled"
      (change)="disabled ? null : select.emit()"
      style="position: absolute; width: 1px; height: 1px; opacity: 0; margin: 0"
    />
    <span [class]="dotCls"></span>
    <span>
      <span>{{ label }}</span>
      @if (sub) {
        <span class="ui-opt-sub">{{ sub }}</span>
      }
    </span>
  </label>`,
})
export class VspRadio {
  @Input() checked = false;
  @Input() label?: string;
  @Input() sub?: string;
  @Input() name?: string;
  @Input() value?: string;
  @Input() disabled = false;
  @Output() select = new EventEmitter<void>();
  get dotCls(): string {
    return this.checked ? 'ui-radio-dot on' : 'ui-radio-dot';
  }
}

@Component({
  selector: 'vsp-radio-group',
  imports: [VspRadio],
  template: `<div
    role="radiogroup"
    [style.flex-direction]="orientation === 'horizontal' ? 'row' : 'column'"
    [style.gap.px]="orientation === 'horizontal' ? 18 : 12"
    [style.flex-wrap]="orientation === 'horizontal' ? 'wrap' : null"
    style="display: flex"
  >
    @for (o of options; track val(o)) {
      <vsp-radio
        [name]="name"
        [label]="lbl(o)"
        [sub]="subOf(o)"
        [value]="val(o)"
        [disabled]="disabled || disOf(o)"
        [checked]="value === val(o)"
        (select)="pick(val(o))"
      />
    }
  </div>`,
})
export class VspRadioGroup {
  @Input() value?: string;
  @Output() valueChange = new EventEmitter<string>();
  @Input() options: NativeSelectOption[] = [];
  @Input() name = 'vsp-radio';
  @Input() disabled = false;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  val = val;
  lbl = lbl;
  subOf = subOf;
  disOf(o: NativeSelectOption): boolean {
    return typeof o === 'object' && !!o.disabled;
  }
  pick(v: string): void {
    this.value = v;
    this.valueChange.emit(v);
  }
}

@Component({
  selector: 'vsp-slider',
  template: `<input
    type="range"
    class="ui-slider"
    [id]="id"
    [value]="value"
    [min]="min"
    [max]="max"
    [step]="step"
    [disabled]="disabled"
    [attr.aria-label]="ariaLabel"
    (input)="onInput($event)"
  />`,
})
export class VspSlider {
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() disabled = false;
  @Input() id?: string;
  @Input('aria-label') ariaLabel?: string;
  onInput(e: Event): void {
    this.value = Number((e.target as HTMLInputElement).value);
    this.valueChange.emit(this.value);
  }
}

@Component({
  selector: 'vsp-native-select',
  template: `<select class="ui-select" [value]="value" (change)="onChange($event)">
    @for (o of options; track val(o)) {
      <option [value]="val(o)">{{ lbl(o) }}</option>
    }
  </select>`,
})
export class VspNativeSelect {
  @Input() value?: string;
  @Output() valueChange = new EventEmitter<string>();
  @Input() options: NativeSelectOption[] = [];
  val = val;
  lbl = lbl;
  onChange(e: Event): void {
    this.value = (e.target as HTMLSelectElement).value;
    this.valueChange.emit(this.value);
  }
}
