import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

export interface CommandItem {
  label: string;
  meta?: string;
  keywords?: string;
  /** Optional leading icon as an SVG path `d` string. */
  icon?: string;
  onRun?: () => void;
}
export interface CommandGroup {
  label: string;
  items: CommandItem[];
}
type FlatCmd = CommandItem & { group: string; idx: number };

const haystack = (it: CommandItem): string =>
  [it.label, it.keywords ?? '', it.meta ?? ''].join(' ').toLowerCase();

/**
 * A ⌘K-style command palette. Renders in place — `.ui-overlay` is
 * `position: fixed`, so as long as the component lives inside `.vsp-root` it
 * covers the viewport and inherits the theme tokens (no portal needed).
 */
@Component({
  selector: 'vsp-command-palette',
  template: `@if (open) {
    <div class="ui-overlay ui-cmd-wrap" role="presentation" (mousedown)="onBackdrop($event)">
      <div class="ui-cmd" role="dialog" aria-modal="true">
        <div class="ui-cmd-input">
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
            #input
            [value]="q"
            placeholder="Type a command or search…"
            (input)="onInput($event)"
            (keydown)="onKey($event)"
          />
          <kbd class="ui-kbd">ESC</kbd>
        </div>
        <div class="ui-cmd-list vsp-scroll">
          @if (flat.length === 0) {
            <div
              style="padding: 28px 12px; text-align: center; color: var(--text-faint); font-size: 13px"
            >
              No results for “{{ q }}”
            </div>
          }
          @for (g of groupOrder; track g) {
            <div>
              <div class="ui-cmd-group">{{ g }}</div>
              @for (it of itemsOf(g); track it.idx) {
                <div
                  [class]="'ui-cmd-item' + (it.idx === active ? ' active' : '')"
                  (mouseenter)="active = it.idx"
                  (click)="run(it)"
                >
                  @if (it.icon) {
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
                      <path [attr.d]="it.icon" />
                    </svg>
                  }
                  <span>{{ it.label }}</span>
                  @if (it.meta) {
                    <span class="ui-cmd-meta">{{ it.meta }}</span>
                  }
                </div>
              }
            </div>
          }
        </div>
        <div class="ui-cmd-foot">
          <span class="k"> <kbd class="ui-kbd">↑</kbd> <kbd class="ui-kbd">↓</kbd> navigate </span>
          <span class="k"> <kbd class="ui-kbd">↵</kbd> select </span>
          <span class="k" style="margin-left: auto">Vespera Command</span>
        </div>
      </div>
    </div>
  }`,
})
export class VspCommandPalette implements OnChanges {
  @Input() open = false;
  @Input() groups: CommandGroup[] = [];
  @Output() close = new EventEmitter<void>();
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  q = '';
  active = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.q = '';
      this.active = 0;
      setTimeout(() => this.input?.nativeElement.focus(), 30);
    }
  }

  get flat(): FlatCmd[] {
    const query = this.q.toLowerCase();
    const out: FlatCmd[] = [];
    for (const g of this.groups) {
      for (const it of g.items) {
        if (!query || haystack(it).includes(query)) {
          out.push({ ...it, group: g.label, idx: out.length });
        }
      }
    }
    return out;
  }

  get groupOrder(): string[] {
    const order: string[] = [];
    const seen = new Set<string>();
    for (const it of this.flat) {
      if (!seen.has(it.group)) {
        seen.add(it.group);
        order.push(it.group);
      }
    }
    return order;
  }

  itemsOf(g: string): FlatCmd[] {
    return this.flat.filter((it) => it.group === g);
  }

  onInput(e: Event): void {
    this.q = (e.target as HTMLInputElement).value;
    this.active = 0;
  }

  run(it: FlatCmd | undefined): void {
    it?.onRun?.();
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open) this.close.emit();
  }

  onBackdrop(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.close.emit();
  }

  onKey(e: KeyboardEvent): void {
    const flat = this.flat;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.active = Math.min(flat.length - 1, this.active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.active = Math.max(0, this.active - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.run(flat[this.active]);
    }
  }
}
