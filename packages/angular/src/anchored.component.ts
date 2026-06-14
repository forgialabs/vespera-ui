import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { VspIcon } from './icon.component';

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
    @if (isOpen) {
      <div #layer [class]="layerClass" [style]="layerStyle"><ng-content /></div>
    }`,
})
export class VspAnchored {
  @Input() align: AnchoredAlign = 'start';
  @Input() width?: number;
  @Input() layerClass = 'ui-menu';
  /** Controlled open state. Leave unset for uncontrolled. */
  @Input('open') openInput?: boolean;
  @Output() openChange = new EventEmitter<boolean>();
  @ViewChild('trig') trig!: ElementRef<HTMLElement>;
  @ViewChild('layer') layer?: ElementRef<HTMLElement>;
  internalOpen = false;
  rect: DOMRect | null = null;

  get isOpen(): boolean {
    return this.openInput !== undefined ? this.openInput : this.internalOpen;
  }
  private setOpen(next: boolean): void {
    if (this.openInput === undefined) this.internalOpen = next;
    this.openChange.emit(next);
  }
  toggle(): void {
    const next = !this.isOpen;
    this.setOpen(next);
    if (next) requestAnimationFrame(() => this.place());
  }
  close(): void {
    this.setOpen(false);
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
    if (!this.isOpen) return;
    const t = e.target as Node;
    if (!this.layer?.nativeElement.contains(t) && !this.trig?.nativeElement.contains(t))
      this.close();
  }
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen) this.close();
  }
  @HostListener('window:resize')
  onResize(): void {
    if (this.isOpen) this.place();
  }
}

export interface MenuItem {
  label?: string;
  kbd?: string;
  /** Optional leading icon name (see `vsp-icon`). */
  icon?: string;
  danger?: boolean;
  heading?: boolean;
  sep?: boolean;
  onClick?: () => void;
}

@Component({
  selector: 'vsp-dropdown-menu',
  imports: [VspAnchored, VspIcon],
  template: `<vsp-anchored
    #a
    [align]="align"
    [width]="width"
    [open]="open"
    (openChange)="openChange.emit($event)"
    layerClass="ui-menu"
  >
    <span slot="trigger"><ng-content select="[slot=trigger]" /></span>
    @for (it of items; track $index) {
      @if (it.sep) {
        <div class="ui-menu-sep"></div>
      } @else if (it.heading) {
        <div class="ui-menu-label">{{ it.label }}</div>
      } @else {
        <button type="button" [class]="itemCls(it)" (click)="it.onClick?.(); a.close()">
          @if (it.icon) {
            <vsp-icon [name]="it.icon" [size]="15" />
          }
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
  @Input() open?: boolean;
  @Output() openChange = new EventEmitter<boolean>();
  itemCls(it: MenuItem): string {
    return 'ui-menu-item' + (it.danger ? ' danger' : '');
  }
}

@Component({
  selector: 'vsp-popover',
  imports: [VspAnchored],
  template: `<vsp-anchored
    [align]="align"
    [width]="width"
    [open]="open"
    (openChange)="openChange.emit($event)"
    layerClass="ui-popover"
  >
    <span slot="trigger"><ng-content select="[slot=trigger]" /></span>
    <ng-content />
  </vsp-anchored>`,
})
export class VspPopover {
  @Input() align: AnchoredAlign = 'start';
  @Input() width = 260;
  @Input() open?: boolean;
  @Output() openChange = new EventEmitter<boolean>();
}
