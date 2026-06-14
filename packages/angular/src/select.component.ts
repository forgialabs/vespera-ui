import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

export type SelectValue = string | number;
export interface SelectOption {
  value: SelectValue;
  label: string;
  /** Optional color swatch shown before the label. */
  swatch?: string;
}
export type SelectOptionInput = SelectValue | SelectOption;

function normalize(o: SelectOptionInput): SelectOption {
  return typeof o === 'object' ? o : { value: o, label: String(o) };
}

/* ---------------- anchored, in-place floating panel ---------------- */

/**
 * Floating panel that tracks its trigger. Renders in place — `.ui-menu` is
 * positioned `fixed` from the anchor's rect, so it escapes overflow as long as
 * the component lives inside `.vsp-root`. Project the panel body as content.
 */
@Component({
  selector: 'vsp-sel-panel',
  template: `@if (open && rect) {
    <div
      #panel
      [class]="menuClass"
      style="position: fixed; z-index: 330"
      [style.top.px]="rect.bottom + 6"
      [style.left.px]="rect.left"
      [style.width]="auto ? 'auto' : (width ?? rect.width) + 'px'"
      [style.padding]="auto ? '0' : null"
      [style.maxHeight]="auto ? null : maxH + 'px'"
    >
      <ng-content />
    </div>
  }`,
})
export class VspSelPanel implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() anchor: HTMLElement | null = null;
  @Input() width?: number;
  @Input() menuClass = 'ui-menu ui-combo';
  /** Hug the content (auto width, no padding/max-height) — used by the date pickers. */
  @Input() auto = false;
  @Output() close = new EventEmitter<void>();
  @ViewChild('panel') panel?: ElementRef<HTMLElement>;

  rect: DOMRect | null = null;
  private cleanup: (() => void) | null = null;

  get maxH(): number {
    return Math.max(220, window.innerHeight - (this.rect?.bottom ?? 0) - 16);
  }

  private place = (): void => {
    if (this.anchor) this.rect = this.anchor.getBoundingClientRect();
  };

  ngOnChanges(c: SimpleChanges): void {
    if (c['open']) {
      if (this.open) this.activate();
      else this.deactivate();
    }
  }

  private activate(): void {
    this.place();
    const onDoc = (e: MouseEvent): void => {
      const t = e.target as Node;
      if (!this.panel?.nativeElement.contains(t) && !this.anchor?.contains(t)) this.close.emit();
    };
    const onEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') this.close.emit();
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', this.place);
    window.addEventListener('scroll', this.place, true);
    this.cleanup = () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', this.place);
      window.removeEventListener('scroll', this.place, true);
    };
  }

  private deactivate(): void {
    this.cleanup?.();
    this.cleanup = null;
    this.rect = null;
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

/* ---------------- search + list ---------------- */

@Component({
  selector: 'vsp-combo-list',
  template: `
    <div class="ui-combo-search">
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        #search
        [value]="q"
        [placeholder]="searchPlaceholder ?? 'Search…'"
        (input)="onInput($event)"
        (keydown)="onKey($event)"
      />
    </div>
    <div class="ui-combo-list">
      @if (loading) {
        <div class="ui-combo-loading">
          <span class="ui-spinner" aria-hidden="true"></span> Loading…
        </div>
      } @else if (items.length === 0) {
        <div class="ui-combo-empty">{{ emptyText ?? 'No matches for “' + q + '”' }}</div>
      }
      @for (o of loading ? [] : items; track o.value; let i = $index) {
        <div
          [class]="'ui-combo-item' + (i === activeIdx ? ' active' : '')"
          (mouseenter)="activeIdxChange.emit(i)"
          (click)="pick.emit(o)"
        >
          @if (o.swatch) {
            <span
              [style.background]="o.swatch"
              style="width: 9px; height: 9px; border-radius: 3px; flex-shrink: 0"
            ></span>
          }
          <span>{{ o.label }}</span>
          @if (isSel(o)) {
            <svg
              class="tick"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          }
        </div>
      }
    </div>
    <ng-content select="[footer]" />
  `,
})
export class VspComboList implements AfterViewInit {
  @Input() q = '';
  @Input() items: SelectOption[] = [];
  @Input() activeIdx = 0;
  @Input() isSel: (o: SelectOption) => boolean = () => false;
  @Input() searchPlaceholder?: string;
  @Input() loading = false;
  @Input() emptyText?: string;
  @Output() qChange = new EventEmitter<string>();
  @Output() activeIdxChange = new EventEmitter<number>();
  @Output() pick = new EventEmitter<SelectOption>();
  @ViewChild('search') search?: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    setTimeout(() => this.search?.nativeElement.focus(), 30);
  }

  onInput(e: Event): void {
    this.qChange.emit((e.target as HTMLInputElement).value);
    this.activeIdxChange.emit(0);
  }

  onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIdxChange.emit(Math.min(this.items.length - 1, this.activeIdx + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIdxChange.emit(Math.max(0, this.activeIdx - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const it = this.items[this.activeIdx];
      if (it) this.pick.emit(it);
    }
  }
}

/* ---------------- Select (themed drop-in, auto-searches at ≥8 options) ---------------- */

@Component({
  selector: 'vsp-select',
  imports: [VspSelPanel, VspComboList],
  template: `
    <button
      #anchor
      type="button"
      [id]="id"
      [disabled]="disabled"
      [attr.aria-invalid]="invalid || null"
      [class]="'ui-selectbtn' + (open ? ' open' : '') + (invalid ? ' invalid' : '')"
      (click)="open = !open"
    >
      <span [class]="'val' + (sel ? '' : ' ph')">{{ sel ? sel.label : placeholder }}</span>
    </button>
    @if (name) {
      <input type="hidden" [name]="name" [value]="cur ?? ''" />
    }
    <vsp-sel-panel [open]="open" [anchor]="anchor" (close)="open = false">
      @if (open) {
        @if (useSearch) {
          <vsp-combo-list
            [q]="q"
            [items]="items"
            [activeIdx]="active"
            [isSel]="isSelFn"
            [emptyText]="emptyText"
            (qChange)="q = $event"
            (activeIdxChange)="active = $event"
            (pick)="choose($event)"
          />
        } @else {
          <div class="ui-combo-list">
            @if (items.length === 0) {
              <div class="ui-combo-empty">{{ emptyText ?? 'No options' }}</div>
            }
            @for (o of items; track o.value) {
              <div [class]="'ui-combo-item' + (sameVal(o) ? ' active' : '')" (click)="choose(o)">
                @if (o.swatch) {
                  <span
                    [style.background]="o.swatch"
                    style="width: 9px; height: 9px; border-radius: 3px; flex-shrink: 0"
                  ></span>
                }
                <span>{{ o.label }}</span>
                @if (sameVal(o)) {
                  <svg
                    class="tick"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                }
              </div>
            }
          </div>
        }
      }
    </vsp-sel-panel>
  `,
})
export class VspSelect {
  @Input() options: SelectOptionInput[] = [];
  @Input() value?: SelectValue;
  @Output() valueChange = new EventEmitter<SelectValue>();
  @Input() placeholder = 'Select…';
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() emptyText?: string;
  @Input() id?: string;
  @Input() name?: string;
  @Input() searchable?: boolean;

  open = false;
  q = '';
  active = 0;

  get opts(): SelectOption[] {
    return this.options.map(normalize);
  }
  get cur(): SelectValue | undefined {
    return this.value ?? this.opts[0]?.value;
  }
  get sel(): SelectOption | undefined {
    return this.opts.find((o) => String(o.value) === String(this.cur));
  }
  get useSearch(): boolean {
    return this.searchable ?? this.opts.length >= 8;
  }
  get items(): SelectOption[] {
    return this.useSearch
      ? this.opts.filter((o) => o.label.toLowerCase().includes(this.q.toLowerCase()))
      : this.opts;
  }
  isSelFn = (o: SelectOption): boolean => String(o.value) === String(this.cur);
  sameVal(o: SelectOption): boolean {
    return String(o.value) === String(this.cur);
  }
  choose(o: SelectOption): void {
    this.value = o.value;
    this.valueChange.emit(o.value);
    this.open = false;
    this.q = '';
  }
}

/* ---------------- Combobox (searchable single select) ---------------- */

@Component({
  selector: 'vsp-combobox',
  imports: [VspSelPanel, VspComboList],
  template: `
    <button
      #anchor
      type="button"
      [id]="id"
      [disabled]="disabled"
      [attr.aria-invalid]="invalid || null"
      [class]="'ui-trigger' + (open ? ' open' : '') + (invalid ? ' invalid' : '')"
      (click)="open = !open"
    >
      <span [class]="'val' + (sel ? '' : ' ph')">{{ sel ? sel.label : placeholder }}</span>
      @if (clearable && sel && !disabled) {
        <span
          role="button"
          tabindex="-1"
          style="display: grid; place-items: center; color: var(--text-faint)"
          (click)="clear($event)"
          (keydown.enter)="set(null)"
        >
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
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </span>
      }
      <svg
        class="chev"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
    @if (name) {
      <input type="hidden" [name]="name" [value]="value ?? ''" />
    }
    <vsp-sel-panel [open]="open" [anchor]="anchor" (close)="open = false">
      @if (open) {
        <vsp-combo-list
          [q]="q"
          [items]="items"
          [activeIdx]="active"
          [isSel]="isSelFn"
          [searchPlaceholder]="searchPlaceholder"
          [loading]="loading"
          [emptyText]="emptyText"
          (qChange)="q = $event"
          (activeIdxChange)="active = $event"
          (pick)="pick($event)"
        />
      }
    </vsp-sel-panel>
  `,
})
export class VspCombobox {
  @Input() options: SelectOptionInput[] = [];
  @Input() value: SelectValue | null = null;
  @Output() valueChange = new EventEmitter<SelectValue | null>();
  @Input() placeholder = 'Select…';
  @Input() searchPlaceholder?: string;
  @Input() clearable = false;
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() loading = false;
  @Input() emptyText?: string;
  @Input() id?: string;
  @Input() name?: string;

  open = false;
  q = '';
  active = 0;

  get opts(): SelectOption[] {
    return this.options.map(normalize);
  }
  get sel(): SelectOption | undefined {
    return this.opts.find((o) => o.value === this.value);
  }
  get items(): SelectOption[] {
    return this.opts.filter((o) => o.label.toLowerCase().includes(this.q.toLowerCase()));
  }
  isSelFn = (o: SelectOption): boolean => o.value === this.value;
  set(v: SelectValue | null): void {
    this.value = v;
    this.valueChange.emit(v);
  }
  clear(e: Event): void {
    e.stopPropagation();
    this.set(null);
  }
  pick(o: SelectOption): void {
    this.set(o.value);
    this.open = false;
    this.q = '';
  }
}

/* ---------------- MultiSelect (searchable, tagged) ---------------- */

@Component({
  selector: 'vsp-multi-select',
  imports: [VspSelPanel, VspComboList],
  template: `
    <div
      #anchor
      role="button"
      [attr.tabindex]="disabled ? -1 : 0"
      [id]="id"
      [attr.aria-disabled]="disabled || null"
      [attr.aria-invalid]="invalid || null"
      [class]="
        'ui-trigger' +
        (open ? ' open' : '') +
        (invalid ? ' invalid' : '') +
        (disabled ? ' disabled' : '')
      "
      style="min-height: var(--ctrl-h)"
      (click)="disabled ? null : (open = !open)"
      (keydown.enter)="toggleOpen($event)"
      (keydown.space)="toggleOpen($event)"
    >
      @if (selOpts.length === 0) {
        <span class="val ph">{{ placeholder }}</span>
      } @else {
        <span class="tags">
          @for (o of selOpts; track o.value) {
            <span class="ui-tag" (click)="$event.stopPropagation()">
              {{ o.label }}
              <button type="button" [attr.aria-label]="'Remove ' + o.label" (click)="remove(o)">
                <svg
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          }
        </span>
      }
      <svg
        class="chev"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
    @if (name) {
      @for (v of value; track v) {
        <input type="hidden" [name]="name" [value]="v" />
      }
    }
    <vsp-sel-panel [open]="open" [anchor]="anchor" (close)="open = false">
      @if (open) {
        <vsp-combo-list
          [q]="q"
          [items]="items"
          [activeIdx]="active"
          [isSel]="isSelFn"
          [searchPlaceholder]="searchPlaceholder"
          [loading]="loading"
          [emptyText]="emptyText"
          (qChange)="q = $event"
          (activeIdxChange)="active = $event"
          (pick)="toggle($event)"
        >
          <div footer class="ui-combo-foot">
            <span class="mono" style="font-size: 11px; color: var(--text-faint)">
              {{ value.length }} selected{{ max ? ' / ' + max : '' }}
            </span>
            <div style="flex: 1"></div>
            @if (value.length > 0) {
              <button type="button" class="btn btn-subtle btn-sm" (click)="set([])">Clear</button>
            }
          </div>
        </vsp-combo-list>
      }
    </vsp-sel-panel>
  `,
})
export class VspMultiSelect {
  @Input() options: SelectOptionInput[] = [];
  @Input() value: SelectValue[] = [];
  @Output() valueChange = new EventEmitter<SelectValue[]>();
  @Input() placeholder = 'Select…';
  @Input() searchPlaceholder?: string;
  @Input() max?: number;
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() loading = false;
  @Input() emptyText?: string;
  @Input() id?: string;
  @Input() name?: string;

  open = false;
  q = '';
  active = 0;

  get opts(): SelectOption[] {
    return this.options.map(normalize);
  }
  get items(): SelectOption[] {
    return this.opts.filter((o) => o.label.toLowerCase().includes(this.q.toLowerCase()));
  }
  get selOpts(): SelectOption[] {
    return this.opts.filter((o) => this.has(o.value));
  }
  has(v: SelectValue): boolean {
    return this.value.includes(v);
  }
  isSelFn = (o: SelectOption): boolean => this.has(o.value);
  set(next: SelectValue[]): void {
    this.value = next;
    this.valueChange.emit(next);
  }
  toggle(o: SelectOption): void {
    if (this.has(o.value)) this.set(this.value.filter((v) => v !== o.value));
    else if (!this.max || this.value.length < this.max) this.set([...this.value, o.value]);
  }
  remove(o: SelectOption): void {
    this.set(this.value.filter((v) => v !== o.value));
  }
  toggleOpen(e: Event): void {
    if (this.disabled) return;
    e.preventDefault();
    this.open = !this.open;
  }
}

/* ---------------- TokenInput (creatable tags) ---------------- */

@Component({
  selector: 'vsp-token-input',
  template: `
    <div
      #root
      class="ui-trigger"
      style="cursor: text; flex-wrap: wrap; align-items: center; gap: 6px; padding-top: 5px; padding-bottom: 5px"
      (click)="focusInput()"
    >
      @for (t of value; track t) {
        <span class="ui-tag" style="max-width: 100%">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{
            t
          }}</span>
          <button type="button" [attr.aria-label]="'Remove ' + t" (click)="remove(t)">
            <svg
              viewBox="0 0 24 24"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </span>
      }
      <input
        [value]="draft"
        [placeholder]="value.length ? '' : placeholder"
        (input)="draft = $any($event.target).value"
        (keydown)="onKey($event)"
        (blur)="add()"
        style="flex: 1 1 80px; min-width: 80px; border: 0; background: transparent; outline: none; font: inherit; font-size: 13.5px; color: var(--text)"
      />
    </div>
  `,
})
export class VspTokenInput {
  @Input() value: string[] = [];
  @Output() valueChange = new EventEmitter<string[]>();
  @Input() placeholder = 'Type and press Enter…';
  @ViewChild('root') root?: ElementRef<HTMLElement>;

  draft = '';

  set(next: string[]): void {
    this.value = next;
    this.valueChange.emit(next);
  }
  add(): void {
    const t = this.draft.trim();
    if (t && !this.value.includes(t)) this.set([...this.value, t]);
    this.draft = '';
  }
  remove(t: string): void {
    this.set(this.value.filter((v) => v !== t));
  }
  focusInput(): void {
    this.root?.nativeElement.querySelector('input')?.focus();
  }
  onKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      this.add();
    } else if (e.key === 'Backspace' && !this.draft && this.value.length) {
      this.set(this.value.slice(0, -1));
    }
  }
}
