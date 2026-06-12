import { NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface TreeNodeData {
  id?: string;
  label: string;
  badge?: string;
  children?: TreeNodeData[];
}

@Component({
  selector: 'vsp-tree',
  imports: [NgTemplateOutlet],
  template: `<div class="ui-tree">
      @for (n of data; track $index) {
        <ng-container *ngTemplateOutlet="nodeTpl; context: { $implicit: n }" />
      }
    </div>

    <ng-template #nodeTpl let-n>
      <div>
        <div
          [class]="rowCls(n)"
          role="button"
          tabindex="0"
          (click)="activate(n)"
          (keydown.enter)="activate(n)"
        >
          @if (hasKids(n)) {
            <svg
              class="tw-chev"
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
          } @else {
            <span style="width: 16px; flex-shrink: 0"></span>
          }
          <svg
            class="tw-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            @if (hasKids(n)) {
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            } @else {
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6" />
            }
          </svg>
          <span
            style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
            >{{ n.label }}</span
          >
          @if (n.badge != null) {
            <span class="mono" style="font-size: 11px; color: var(--text-faint)">{{
              n.badge
            }}</span>
          }
        </div>
        @if (hasKids(n) && expanded.has(id(n))) {
          <div class="ui-tree-children">
            @for (c of n.children; track $index) {
              <ng-container *ngTemplateOutlet="nodeTpl; context: { $implicit: c }" />
            }
          </div>
        }
      </div>
    </ng-template>`,
})
export class VspTree implements OnInit {
  @Input() data: TreeNodeData[] = [];
  @Input() defaultExpanded: string[] = [];
  expanded = new Set<string>();
  selected: string | null = null;

  ngOnInit(): void {
    this.expanded = new Set(this.defaultExpanded);
  }
  id(n: TreeNodeData): string {
    return n.id ?? n.label;
  }
  hasKids(n: TreeNodeData): boolean {
    return (n.children ?? []).length > 0;
  }
  rowCls(n: TreeNodeData): string {
    const i = this.id(n);
    return (
      'ui-tree-row' + (this.expanded.has(i) ? ' open' : '') + (this.selected === i ? ' sel' : '')
    );
  }
  activate(n: TreeNodeData): void {
    const i = this.id(n);
    if (this.hasKids(n)) {
      const next = new Set(this.expanded);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      this.expanded = next;
    }
    this.selected = i;
  }
}
