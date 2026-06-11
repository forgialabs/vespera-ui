import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vsp-avatar',
  template: `<span
    class="vsp-avatar"
    [style.width.px]="size"
    [style.height.px]="size"
    [style.fontSize.px]="size * 0.38"
    [style.background]="bg"
    >{{ initials }}</span
  >`,
})
export class VspAvatar {
  @Input() name = '';
  @Input() hue = 0;
  @Input() size = 34;
  get initials(): string {
    return this.name
      .split(' ')
      .map((s) => s.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  get bg(): string {
    return `linear-gradient(140deg, oklch(0.62 0.16 ${this.hue}), oklch(0.55 0.17 ${(this.hue + 50) % 360}))`;
  }
}

export interface Person {
  name: string;
  hue?: number;
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
        <vsp-avatar [name]="p.name" [hue]="p.hue ?? 0" [size]="size" />
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
