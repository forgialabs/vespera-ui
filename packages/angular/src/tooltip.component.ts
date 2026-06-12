import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'vsp-tooltip',
  template: `<span
    #el
    style="display: inline-flex"
    (mouseenter)="enter()"
    (mouseleave)="show = false"
    (focusin)="enter()"
    (focusout)="show = false"
  >
    <ng-content />
    @if (show) {
      <div
        class="ui-tip"
        [style.left.px]="pos.x"
        [style.top.px]="pos.y"
        [style.transform]="transform"
      >
        {{ label }}
      </div>
    }
  </span>`,
})
export class VspTooltip {
  @Input() label?: string;
  @Input() side: 'top' | 'bottom' = 'top';
  @ViewChild('el') el!: ElementRef<HTMLElement>;
  show = false;
  pos = { x: 0, y: 0 };
  get transform(): string {
    return this.side === 'bottom' ? 'translateX(-50%)' : 'translate(-50%,-100%)';
  }
  enter(): void {
    const r = this.el.nativeElement.getBoundingClientRect();
    this.pos = { x: r.left + r.width / 2, y: this.side === 'bottom' ? r.bottom + 8 : r.top - 8 };
    this.show = true;
  }
}
