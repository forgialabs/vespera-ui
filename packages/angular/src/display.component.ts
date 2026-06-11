import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vsp-tag',
  template: `<span class="ui-tag">
    <ng-content />
    <button type="button" aria-label="Remove" (click)="remove.emit()">×</button>
  </span>`,
})
export class VspTag {
  @Output() remove = new EventEmitter<void>();
}

@Component({
  selector: 'vsp-kbd',
  template: `<kbd class="ui-kbd"><ng-content /></kbd>`,
})
export class VspKbd {}

@Component({
  selector: 'vsp-divider',
  template: `<hr [class]="cls" />`,
})
export class VspDivider {
  @Input() vertical = false;
  get cls(): string {
    return this.vertical ? 'ui-divider v' : 'ui-divider';
  }
}
