import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vsp-field',
  template: `<div class="ui-field">
    @if (label) {
      <label class="ui-label" [attr.for]="htmlFor">
        <span
          >{{ label }}
          @if (required) {
            <span class="req"> *</span>
          }
        </span>
      </label>
    }
    <ng-content />
    @if (error || hint) {
      <span [class]="hintCls">{{ error || hint }}</span>
    }
  </div>`,
})
export class VspField {
  @Input() label?: string;
  @Input() required = false;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() htmlFor?: string;
  get hintCls(): string {
    return this.error ? 'ui-hint err' : 'ui-hint';
  }
}

@Component({
  selector: 'vsp-input',
  template: `<input [class]="cls" [value]="value" (input)="onInput($event)" />`,
})
export class VspInput {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() invalid = false;
  get cls(): string {
    return this.invalid ? 'ui-input invalid' : 'ui-input';
  }
  onInput(e: Event): void {
    this.value = (e.target as HTMLInputElement).value;
    this.valueChange.emit(this.value);
  }
}

@Component({
  selector: 'vsp-textarea',
  template: `<textarea class="ui-textarea" [value]="value" (input)="onInput($event)"></textarea>`,
})
export class VspTextarea {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  onInput(e: Event): void {
    this.value = (e.target as HTMLTextAreaElement).value;
    this.valueChange.emit(this.value);
  }
}
