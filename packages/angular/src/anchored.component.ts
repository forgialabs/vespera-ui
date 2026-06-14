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
  disabled?: boolean;
  /** Render as a checkable item — shows a tick and keeps the menu open on select. */
  type?: 'checkbox' | 'radio';
  checked?: boolean;
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
        <button
          type="button"
          [class]="itemCls(it)"
          [attr.role]="role(it)"
          [disabled]="it.disabled"
          [attr.aria-checked]="it.type ? !!it.checked : null"
          (click)="select(it, a)"
          (keydown)="onKey($event)"
        >
          @if (it.type) {
            <span class="ui-menu-check">
              @if (it.checked) {
                <vsp-icon name="check" [size]="16" />
              }
            </span>
          } @else if (it.icon) {
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
  role(it: MenuItem): string {
    return it.type === 'checkbox'
      ? 'menuitemcheckbox'
      : it.type === 'radio'
        ? 'menuitemradio'
        : 'menuitem';
  }
  select(it: MenuItem, a: VspAnchored): void {
    it.onClick?.();
    if (!it.type) a.close();
  }
  onKey(e: KeyboardEvent): void {
    const k = e.key;
    if (k !== 'ArrowDown' && k !== 'ArrowUp' && k !== 'Home' && k !== 'End') return;
    e.preventDefault();
    const parent = (e.currentTarget as HTMLElement).parentElement;
    if (!parent) return;
    const els = Array.from(
      parent.querySelectorAll<HTMLButtonElement>('[role^="menuitem"]:not([disabled])'),
    );
    const i = els.indexOf(e.currentTarget as HTMLButtonElement);
    const n = els.length;
    const next =
      k === 'Home'
        ? els[0]
        : k === 'End'
          ? els[n - 1]
          : k === 'ArrowDown'
            ? els[(i + 1) % n]
            : els[(i - 1 + n) % n];
    next?.focus();
  }
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
