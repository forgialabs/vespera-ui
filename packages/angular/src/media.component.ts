import { Component, EventEmitter, Input, Output } from '@angular/core';

export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';
const AVATAR_STATUS: Record<AvatarStatus, string> = {
  online: 'var(--success)',
  offline: 'var(--text-faint)',
  away: 'var(--warning)',
  busy: 'var(--danger)',
};

@Component({
  selector: 'vsp-avatar',
  template: `<span style="position: relative; display: inline-flex; flex-shrink: 0">
    <span
      class="vsp-avatar"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.fontSize.px]="size * 0.38"
      [style.borderRadius]="radius"
      [style.background]="bg"
      style="overflow: hidden"
    >
      @if (src) {
        <img [src]="src" [alt]="alt ?? name" style="width: 100%; height: 100%; object-fit: cover" />
      } @else {
        {{ initials }}
      }
    </span>
    @if (status) {
      <span
        [attr.aria-label]="status"
        [style.width.px]="dot"
        [style.height.px]="dot"
        [style.background]="statusColor"
        style="position: absolute; right: 0; bottom: 0; border-radius: 50%; border: 2px solid var(--surface-1)"
      ></span>
    }
  </span>`,
})
export class VspAvatar {
  @Input() name = '';
  @Input() hue = 0;
  @Input() size = 34;
  @Input() src?: string;
  @Input() alt?: string;
  @Input() status?: AvatarStatus;
  @Input() shape: 'circle' | 'square' = 'circle';
  get initials(): string {
    return this.name
      .split(' ')
      .map((s) => s.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  get radius(): string {
    return this.shape === 'square' ? 'var(--r-sm)' : '50%';
  }
  get dot(): number {
    return Math.max(8, Math.round(this.size * 0.28));
  }
  get statusColor(): string {
    return this.status ? AVATAR_STATUS[this.status] : '';
  }
  get bg(): string {
    return this.src
      ? 'var(--surface-3)'
      : `linear-gradient(140deg, oklch(0.62 0.16 ${this.hue}), oklch(0.55 0.17 ${(this.hue + 50) % 360}))`;
  }
}

export interface Person {
  name: string;
  hue?: number;
  src?: string;
}

@Component({
  selector: 'vsp-avatar-group',
  imports: [VspAvatar],
  template: `<div style="display: flex; align-items: center">
    @for (p of shown; track $index) {
      <span
        [style.marginLeft.px]="$index ? -10 : 0"
        [style.zIndex]="shown.length - $index"
        style="border: 2px solid var(--surface-1); border-radius: 50%; position: relative"
      >
        <vsp-avatar [name]="p.name" [hue]="p.hue ?? 0" [src]="p.src" [size]="size" />
      </span>
    }
    @if (extra > 0) {
      <span
        [style.width.px]="size"
        [style.height.px]="size"
        [style.fontSize.px]="size * 0.34"
        style="margin-left: -10px; border-radius: 50%; display: grid; place-items: center; background: var(--surface-3); border: 2px solid var(--surface-1); font-weight: 700; color: var(--text-dim)"
        >+{{ extra }}</span
      >
    }
  </div>`,
})
export class VspAvatarGroup {
  @Input() people: Person[] = [];
  @Input() max = 4;
  @Input() size = 32;
  get shown(): Person[] {
    return this.people.slice(0, this.max);
  }
  get extra(): number {
    return this.people.length - this.shown.length;
  }
}

@Component({
  selector: 'vsp-segmented',
  template: `<div class="ui-seg">
    @for (o of options; track o) {
      <button type="button" [class.on]="value === o" (click)="pick(o)">{{ o }}</button>
    }
  </div>`,
})
export class VspSegmented {
  @Input() value?: string;
  @Output() valueChange = new EventEmitter<string>();
  @Input() options: string[] = [];
  pick(o: string): void {
    this.value = o;
    this.valueChange.emit(o);
  }
}
