import { Component, EventEmitter, Input, Output } from '@angular/core';

export type SelectOption = string | { value: string; label: string; sub?: string };

const val = (o: SelectOption): string => (typeof o === 'string' ? o : o.value);
const lbl = (o: SelectOption): string => (typeof o === 'string' ? o : o.label);
const subOf = (o: SelectOption): string | undefined => (typeof o === 'object' ? o.sub : undefined);

@Component({
  selector: 'vsp-radio',
  template: `<label class="ui-opt">
    <input
      type="radio"
      [name]="name"
      [value]="value"
      [checked]="checked"
      (change)="select.emit()"
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
  @Output() select = new EventEmitter<void>();
  get dotCls(): string {
    return this.checked ? 'ui-radio-dot on' : 'ui-radio-dot';
  }
}

@Component({
  selector: 'vsp-radio-group',
  imports: [VspRadio],
  template: `<div style="display: flex; flex-direction: column; gap: 12px">
    @for (o of options; track val(o)) {
      <vsp-radio
        [name]="name"
        [label]="lbl(o)"
        [sub]="subOf(o)"
        [value]="val(o)"
        [checked]="value === val(o)"
        (select)="pick(val(o))"
      />
    }
  </div>`,
})
export class VspRadioGroup {
  @Input() value?: string;
  @Output() valueChange = new EventEmitter<string>();
  @Input() options: SelectOption[] = [];
  @Input() name = 'vsp-radio';
  val = val;
  lbl = lbl;
  subOf = subOf;
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
    [value]="value"
    [min]="min"
    [max]="max"
    [step]="step"
    (input)="onInput($event)"
  />`,
})
export class VspSlider {
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
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
  @Input() options: SelectOption[] = [];
  val = val;
  lbl = lbl;
  onChange(e: Event): void {
    this.value = (e.target as HTMLSelectElement).value;
    this.valueChange.emit(this.value);
  }
}
