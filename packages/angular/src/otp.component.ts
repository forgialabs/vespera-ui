import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'vsp-otp-input',
  template: `<div class="ui-otp">
    @for (i of indices; track i) {
      <input
        #otp
        inputmode="numeric"
        maxlength="1"
        [value]="value[i] ?? ''"
        (input)="set(i, otp.value)"
        (keydown)="onKey(i, $event)"
      />
    }
  </div>`,
})
export class VspOTPInput {
  @Input() length = 6;
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @ViewChildren('otp') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  get indices(): number[] {
    return Array.from({ length: this.length }, (_, i) => i);
  }
  set(i: number, raw: string): void {
    const clean = raw.replace(/\D/g, '');
    const chars = Array.from({ length: this.length }, (_, k) => this.value[k] ?? '');
    chars[i] = clean.slice(-1);
    this.value = chars.join('');
    this.valueChange.emit(this.value);
    if (clean && i < this.length - 1) this.inputs.get(i + 1)?.nativeElement.focus();
  }
  onKey(i: number, e: KeyboardEvent): void {
    if (e.key === 'Backspace' && !this.value[i] && i > 0)
      this.inputs.get(i - 1)?.nativeElement.focus();
  }
}
