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
  template: `<div [class]="invalid ? 'ui-otp invalid' : 'ui-otp'">
    @for (i of indices; track i) {
      <input
        #otp
        inputmode="numeric"
        maxlength="1"
        [value]="value[i] ?? ''"
        [disabled]="disabled"
        [attr.aria-invalid]="invalid || null"
        (input)="set(i, otp.value)"
        (paste)="onPaste(i, $event)"
        (keydown)="onKey(i, $event)"
      />
    }
  </div>`,
})
export class VspOTPInput {
  @Input() length = 6;
  @Input() value = '';
  @Input() disabled = false;
  @Input() invalid = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() complete = new EventEmitter<string>();
  @ViewChildren('otp') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  get indices(): number[] {
    return Array.from({ length: this.length }, (_, i) => i);
  }
  private chars(): string[] {
    return Array.from({ length: this.length }, (_, k) => this.value[k] ?? '');
  }
  private emit(next: string[]): void {
    this.value = next.join('');
    this.valueChange.emit(this.value);
    if (this.value.length === this.length) this.complete.emit(this.value);
  }
  set(i: number, raw: string): void {
    const clean = raw.replace(/\D/g, '');
    const next = this.chars();
    next[i] = clean.slice(-1);
    this.emit(next);
    if (clean && i < this.length - 1) this.inputs.get(i + 1)?.nativeElement.focus();
  }
  onPaste(i: number, e: ClipboardEvent): void {
    const text = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
    if (!text) return;
    e.preventDefault();
    const next = this.chars();
    for (let j = 0; j < text.length && i + j < this.length; j++) next[i + j] = text[j]!;
    this.emit(next);
    this.inputs.get(Math.min(i + text.length, this.length - 1))?.nativeElement.focus();
  }
  onKey(i: number, e: KeyboardEvent): void {
    if (e.key === 'Backspace' && !this.value[i] && i > 0)
      this.inputs.get(i - 1)?.nativeElement.focus();
  }
}
