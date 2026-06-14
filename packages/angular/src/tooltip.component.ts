import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'vsp-tooltip',
  template: `<span
    #el
    style="display: inline-flex"
    (mouseenter)="enter()"
    (mouseleave)="leave()"
    (focusin)="enter()"
    (focusout)="leave()"
  >
    <ng-content />
    @if (show) {
      <div
        class="ui-tip"
        role="tooltip"
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
  @Input() side: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() delay = 0;
  @Input() disabled = false;
  @ViewChild('el') el!: ElementRef<HTMLElement>;
  show = false;
  pos = { x: 0, y: 0 };
  private timer: ReturnType<typeof setTimeout> | null = null;
  private static readonly TRANSFORM: Record<string, string> = {
    top: 'translate(-50%,-100%)',
    bottom: 'translateX(-50%)',
    left: 'translate(-100%,-50%)',
    right: 'translateY(-50%)',
  };
  get transform(): string {
    return VspTooltip.TRANSFORM[this.side]!;
  }
  private place(): void {
    const r = this.el.nativeElement.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (this.side === 'bottom') this.pos = { x: cx, y: r.bottom + 8 };
    else if (this.side === 'left') this.pos = { x: r.left - 8, y: cy };
    else if (this.side === 'right') this.pos = { x: r.right + 8, y: cy };
    else this.pos = { x: cx, y: r.top - 8 };
  }
  enter(): void {
    if (this.disabled) return;
    this.place();
    if (this.delay > 0) this.timer = setTimeout(() => (this.show = true), this.delay);
    else this.show = true;
  }
  leave(): void {
    if (this.timer != null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.show = false;
  }
}
