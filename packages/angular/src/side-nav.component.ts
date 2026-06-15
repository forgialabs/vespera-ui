import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VspIcon } from './icon.component';

/* ===================== Setting row ===================== */

/** A labelled row (title + optional description) with a trailing control slot. */
@Component({
  selector: 'vsp-setting-row',
  template: `<div [class]="last ? 'ui-setrow last' : 'ui-setrow'">
    <div class="ui-setrow-main">
      <div class="ui-setrow-title">{{ title }}</div>
      @if (desc) {
        <div class="ui-setrow-desc">{{ desc }}</div>
      }
    </div>
    <ng-content />
  </div>`,
})
export class VspSettingRow {
  @Input() title?: string;
  @Input() desc?: string;
  @Input() last = false;
}

/* ===================== Vertical tabs ===================== */

export type VerticalTabItem =
  | string
  | { value: string; label: string; icon?: string; badge?: string | number };

/** Vertical tab strip — a settings-style left rail. */
@Component({
  selector: 'vsp-vertical-tabs',
  imports: [VspIcon],
  template: `<div class="ui-vtabs">
    @for (t of tabs; track id(t)) {
      <button type="button" [class]="cls(t)" (click)="pick(id(t))">
        @if (ico(t)) {
          <vsp-icon [name]="ico(t)!" [size]="16" />
        }
        {{ lbl(t) }}
        @if (bdg(t) != null) {
          <span class="ui-nav-badge">{{ bdg(t) }}</span>
        }
      </button>
    }
  </div>`,
})
export class VspVerticalTabs {
  @Input() tabs: VerticalTabItem[] = [];
  @Input() value?: string;
  @Output() valueChange = new EventEmitter<string>();
  id(t: VerticalTabItem): string {
    return typeof t === 'string' ? t : t.value;
  }
  lbl(t: VerticalTabItem): string {
    return typeof t === 'string' ? t : t.label;
  }
  ico(t: VerticalTabItem): string | undefined {
    return typeof t === 'object' ? t.icon : undefined;
  }
  bdg(t: VerticalTabItem): string | number | undefined {
    return typeof t === 'object' ? t.badge : undefined;
  }
  cls(t: VerticalTabItem): string {
    return 'ui-vtab' + (this.value === this.id(t) ? ' on' : '');
  }
  pick(v: string): void {
    this.value = v;
    this.valueChange.emit(v);
  }
}

/* ===================== Nav item ===================== */

/** A sidebar nav row — renders as an `<a>` when `href` is set, else a `<button>`. */
@Component({
  selector: 'vsp-nav-item',
  imports: [VspIcon],
  template: `@if (href && !disabled) {
      <a [href]="href" [class]="cls" [attr.aria-current]="active ? 'page' : null">
        @if (icon) {
          <vsp-icon [name]="icon" [size]="16" />
        }
        <span [style.flex]="sub ? 'none' : 1">{{ label }}<ng-content /></span>
        @if (badge != null) {
          <span class="ui-nav-badge">{{ badge }}</span>
        }
      </a>
    } @else {
      <button type="button" [disabled]="disabled" [class]="cls">
        @if (icon) {
          <vsp-icon [name]="icon" [size]="16" />
        }
        <span [style.flex]="sub ? 'none' : 1">{{ label }}<ng-content /></span>
        @if (badge != null) {
          <span class="ui-nav-badge">{{ badge }}</span>
        }
      </button>
    }`,
})
export class VspNavItem {
  @Input() icon?: string;
  @Input() label?: string;
  @Input() active = false;
  @Input() badge?: string | number;
  @Input() sub = false;
  @Input() href?: string;
  @Input() disabled = false;
  get cls(): string {
    return 'ui-nav-item' + (this.active ? ' on' : '') + (this.disabled ? ' disabled' : '');
  }
}

/* ===================== Nav group ===================== */

/** A collapsible sidebar group; nested `vsp-nav-item`s project into the body. */
@Component({
  selector: 'vsp-nav-group',
  imports: [VspIcon],
  template: `<div [class]="open ? 'ui-nav-group open' : 'ui-nav-group'">
    <button
      type="button"
      [class]="open ? 'ui-nav-item open' : 'ui-nav-item'"
      (click)="open = !open"
    >
      @if (icon) {
        <vsp-icon [name]="icon" [size]="16" />
      }
      <span>{{ label }}</span>
      <svg
        class="ui-nav-chev"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
    <div class="ui-nav-sub">
      <div>
        <div class="ui-nav" style="padding-top: 2px"><ng-content /></div>
      </div>
    </div>
  </div>`,
})
export class VspNavGroup {
  @Input() icon?: string;
  @Input() label?: string;
  @Input() set defaultOpen(v: boolean) {
    this.open = v;
  }
  open = false;
}

/* ===================== Input affix ===================== */

/** Text input wrapped with an optional leading icon, prefix, and trailing unit. */
@Component({
  selector: 'vsp-input-affix',
  imports: [VspIcon],
  template: `<div [class]="wrapClass ? 'ui-affix ' + wrapClass : 'ui-affix'">
    @if (leadingIcon) {
      <vsp-icon [name]="leadingIcon" [size]="16" />
    }
    @if (prefix) {
      <span class="unit">{{ prefix }}</span>
    }
    <input
      [value]="value"
      [attr.placeholder]="placeholder"
      [attr.type]="type"
      [disabled]="disabled"
      (input)="onInput($event)"
    />
    @if (unit) {
      <span class="unit">{{ unit }}</span>
    }
  </div>`,
})
export class VspInputAffix {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() leadingIcon?: string;
  @Input() prefix?: string;
  @Input() unit?: string;
  @Input() wrapClass?: string;
  @Input() placeholder?: string;
  @Input() type = 'text';
  @Input() disabled = false;
  onInput(e: Event): void {
    this.value = (e.target as HTMLInputElement).value;
    this.valueChange.emit(this.value);
  }
}
