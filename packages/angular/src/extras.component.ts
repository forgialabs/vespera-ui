import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vsp-number-stepper',
  template: `<div class="ui-stepper">
    <button
      type="button"
      aria-label="Decrease"
      [disabled]="min != null && value <= min"
      (click)="set(value - step)"
    >
      −
    </button>
    <span class="val"
      >{{ value }}
      @if (unit) {
        <i>{{ unit }}</i>
      }
    </span>
    <button
      type="button"
      aria-label="Increase"
      [disabled]="max != null && value >= max"
      (click)="set(value + step)"
    >
      +
    </button>
  </div>`,
})
export class VspNumberStepper {
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();
  @Input() min?: number;
  @Input() max?: number;
  @Input() step = 1;
  @Input() unit?: string;
  set(v: number): void {
    let n = v;
    if (this.min != null && n < this.min) n = this.min;
    if (this.max != null && n > this.max) n = this.max;
    this.value = n;
    this.valueChange.emit(n);
  }
}

@Component({
  selector: 'vsp-copy-button',
  template: `<button type="button" [class]="cls" (click)="copy()">
    @if (done) {
      <span style="color: var(--success); display: inline-flex">
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg> </span
      >Copied
    } @else {
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6" />
      </svg>
      {{ label }}
    }
  </button>`,
})
export class VspCopyButton {
  @Input() text = '';
  @Input() label = 'Copy';
  @Input() size = 'sm';
  done = false;
  get cls(): string {
    return 'btn btn-ghost' + (this.size === 'sm' ? ' btn-sm' : '');
  }
  async copy(): Promise<void> {
    try {
      await navigator.clipboard?.writeText(this.text);
    } catch {
      /* clipboard unavailable */
    }
    this.done = true;
    setTimeout(() => (this.done = false), 1400);
  }
}

@Component({
  selector: 'vsp-inline-edit',
  template: `@if (editing) {
      <input
        #inp
        autofocus
        class="ui-input"
        [value]="draft"
        style="height: 32px; max-width: 240px"
        (input)="draft = inp.value"
        (blur)="commit()"
        (keydown.enter)="commit()"
        (keydown.escape)="cancel()"
      />
    } @else {
      <span
        class="ui-inline"
        role="button"
        tabindex="0"
        (click)="start()"
        (keydown.enter)="start()"
      >
        <span [style.color]="value ? 'var(--text)' : 'var(--text-faint)'">{{
          value || placeholder
        }}</span>
        <span class="pen" style="display: inline-flex">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" />
          </svg>
        </span>
      </span>
    }`,
})
export class VspInlineEdit {
  @Input() value = '';
  @Input() placeholder = 'Empty';
  @Output() save = new EventEmitter<string>();
  editing = false;
  draft = '';
  start(): void {
    this.draft = this.value;
    this.editing = true;
  }
  commit(): void {
    this.editing = false;
    if (this.draft !== this.value) this.save.emit(this.draft);
  }
  cancel(): void {
    this.draft = this.value;
    this.editing = false;
  }
}
