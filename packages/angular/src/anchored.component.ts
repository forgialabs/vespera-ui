import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

export type AnchoredAlign = 'start' | 'end';

/**
 * Positioning base for menus and popovers: anchors a layer to a trigger. The
 * layer is `position: fixed`, so it renders in place (inside `.vsp-root`) and is
 * positioned against the trigger's viewport rect. Click-outside and Escape close
 * it. Project the trigger with `slot="trigger"`; the default slot is the layer.
 */
@Component({
  selector: 'vsp-anchored',
  template: `<span #trig style="display: inline-flex" (click)="toggle()">
      <ng-content select="[slot=trigger]" />
    </span>
    @if (open) {
      <div #layer [class]="layerClass" [style]="layerStyle"><ng-content /></div>
    }`,
})
export class VspAnchored {
  @Input() align: AnchoredAlign = 'start';
  @Input() width?: number;
  @Input() layerClass = 'ui-menu';
  @ViewChild('trig') trig!: ElementRef<HTMLElement>;
  @ViewChild('layer') layer?: ElementRef<HTMLElement>;
  open = false;
  rect: DOMRect | null = null;

  toggle(): void {
    this.open = !this.open;
    if (this.open) requestAnimationFrame(() => this.place());
  }
  close(): void {
    this.open = false;
  }
  place(): void {
    if (this.trig) this.rect = this.trig.nativeElement.getBoundingClientRect();
  }
  get layerStyle(): string {
    const r = this.rect;
    if (!r) return '';
    let s = `position:fixed;top:${r.bottom + 6}px;min-width:${this.width ?? r.width}px;z-index:320;`;
    s += this.align === 'end' ? `right:${window.innerWidth - r.right}px` : `left:${r.left}px`;
    return s;
  }
  @HostListener('document:mousedown', ['$event'])
  onDoc(e: MouseEvent): void {
    if (!this.open) return;
    const t = e.target as Node;
    if (!this.layer?.nativeElement.contains(t) && !this.trig?.nativeElement.contains(t))
      this.close();
  }
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open) this.close();
  }
  @HostListener('window:resize')
  onResize(): void {
    if (this.open) this.place();
  }
}

export interface MenuItem {
  label?: string;
  kbd?: string;
  danger?: boolean;
  heading?: boolean;
  sep?: boolean;
  onClick?: () => void;
}

@Component({
  selector: 'vsp-dropdown-menu',
  imports: [VspAnchored],
  template: `<vsp-anchored #a [align]="align" [width]="width" layerClass="ui-menu">
    <span slot="trigger"><ng-content select="[slot=trigger]" /></span>
    @for (it of items; track $index) {
      @if (it.sep) {
        <div class="ui-menu-sep"></div>
      } @else if (it.heading) {
        <div class="ui-menu-label">{{ it.label }}</div>
      } @else {
        <button type="button" [class]="itemCls(it)" (click)="it.onClick?.(); a.close()">
          {{ it.label }}
          @if (it.kbd) {
            <kbd class="ui-kbd">{{ it.kbd }}</kbd>
          }
        </button>
      }
    }
  </vsp-anchored>`,
})
export class VspDropdownMenu {
  @Input() items: MenuItem[] = [];
  @Input() align: AnchoredAlign = 'end';
  @Input() width?: number;
  itemCls(it: MenuItem): string {
    return 'ui-menu-item' + (it.danger ? ' danger' : '');
  }
}

@Component({
  selector: 'vsp-popover',
  imports: [VspAnchored],
  template: `<vsp-anchored [align]="align" [width]="width" layerClass="ui-popover">
    <span slot="trigger"><ng-content select="[slot=trigger]" /></span>
    <ng-content />
  </vsp-anchored>`,
})
export class VspPopover {
  @Input() align: AnchoredAlign = 'start';
  @Input() width = 260;
}
