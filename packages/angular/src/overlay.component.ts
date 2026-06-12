import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export type DialogTone = 'pos' | 'neg' | 'warn' | 'info';
const DIALOG_TONE: Record<DialogTone, string> = {
  pos: 'var(--success)',
  neg: 'var(--danger)',
  warn: 'var(--warning)',
  info: 'var(--accent)',
};

/**
 * A modal dialog. Renders in place — `.ui-overlay` is `position: fixed`, so as
 * long as the component lives inside `.vsp-root` the overlay covers the viewport
 * and inherits the theme tokens (no portal needed). Project content into the
 * default slot for the body, `slot="icon"` for the header icon, and
 * `slot="footer"` for the footer.
 */
@Component({
  selector: 'vsp-dialog',
  template: `@if (open) {
    <div class="ui-overlay" role="presentation" (mousedown)="onBackdrop($event)">
      <div class="ui-dialog" [style.maxWidth.px]="maxWidth" role="dialog" aria-modal="true">
        <div class="ui-dialog-head">
          <span
            #ic
            [style.display]="ic.childElementCount ? 'grid' : 'none'"
            [style.background]="'color-mix(in oklab, ' + color + ' 13%, transparent)'"
            [style.color]="color"
            style="width: 42px; height: 42px; border-radius: var(--r-sm); place-items: center; margin-bottom: 14px"
          >
            <ng-content select="[slot=icon]" />
          </span>
          <div class="ui-dialog-title">{{ title }}</div>
          @if (desc) {
            <div class="ui-dialog-desc">{{ desc }}</div>
          }
        </div>
        <div
          #body
          [style.display]="body.childElementCount ? 'block' : 'none'"
          class="ui-dialog-body"
        >
          <ng-content />
        </div>
        <div
          #foot
          [style.display]="foot.childElementCount ? 'flex' : 'none'"
          class="ui-dialog-foot"
        >
          <ng-content select="[slot=footer]" />
        </div>
      </div>
    </div>
  }`,
})
export class VspDialog {
  @Input() open = false;
  @Input() title?: string;
  @Input() desc?: string;
  @Input() maxWidth = 460;
  @Input() tone?: DialogTone;
  @Output() close = new EventEmitter<void>();

  get color(): string {
    return this.tone ? DIALOG_TONE[this.tone] : 'var(--accent)';
  }
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open) this.close.emit();
  }
  onBackdrop(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.close.emit();
  }
}

/** A side drawer. Like `vsp-dialog`, renders in place inside `.vsp-root`. */
@Component({
  selector: 'vsp-sheet',
  template: `@if (open) {
    <div class="ui-overlay" role="presentation" (mousedown)="onBackdrop($event)">
      <div class="ui-sheet" role="dialog" aria-modal="true">
        <div class="ui-sheet-head">
          <span
            #ic
            [style.display]="ic.childElementCount ? 'grid' : 'none'"
            style="width: 38px; height: 38px; border-radius: var(--r-sm); place-items: center; background: color-mix(in oklab, var(--accent) 13%, transparent); color: var(--accent); flex-shrink: 0"
          >
            <ng-content select="[slot=icon]" />
          </span>
          <div style="flex: 1; min-width: 0">
            <div style="font-size: 16px; font-weight: 700; letter-spacing: -0.01em">
              {{ title }}
            </div>
            @if (desc) {
              <div style="font-size: 12.5px; color: var(--text-dim); margin-top: 3px">
                {{ desc }}
              </div>
            }
          </div>
          <button
            type="button"
            class="vsp-icon-btn"
            style="border: 0; background: transparent; width: 32px; height: 32px"
            aria-label="Close"
            (click)="close.emit()"
          >
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
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="ui-sheet-body vsp-scroll"><ng-content /></div>
        <div
          #foot
          [style.display]="foot.childElementCount ? 'block' : 'none'"
          class="ui-sheet-foot"
        >
          <ng-content select="[slot=footer]" />
        </div>
      </div>
    </div>
  }`,
})
export class VspSheet {
  @Input() open = false;
  @Input() title?: string;
  @Input() desc?: string;
  @Output() close = new EventEmitter<void>();
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open) this.close.emit();
  }
  onBackdrop(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.close.emit();
  }
}
