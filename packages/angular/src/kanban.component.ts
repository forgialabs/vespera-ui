import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { VspBlock } from './blocks.component';
import { VspBadge, type BadgeTone } from './badge.component';
import { VspAvatar } from './media.component';

export interface KanbanCard {
  id: string;
  title: string;
  tag: string;
  tone: BadgeTone;
}
export interface KanbanColumn {
  name: string;
  /** CSS colour for the column's status dot. */
  tone: string;
  cards: KanbanCard[];
}
interface DragState {
  card: KanbanCard;
  from: number;
  origIndex: number;
  w: number;
  offX: number;
  offY: number;
}
interface DropTarget {
  col: number;
  index: number;
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  {
    name: 'Triage',
    tone: 'var(--text-faint)',
    cards: [
      { id: 'k1', title: 'Cobalt payment failed', tag: 'Billing', tone: 'neg' },
      { id: 'k2', title: 'Verify SSO config', tag: 'Security', tone: 'warn' },
    ],
  },
  {
    name: 'In progress',
    tone: 'var(--accent)',
    cards: [
      { id: 'k3', title: 'Migrate Halcyon seats', tag: 'Accounts', tone: 'info' },
      { id: 'k4', title: 'Q2 expansion review', tag: 'Revenue', tone: 'info' },
      { id: 'k5', title: 'Webhook retry logic', tag: 'Product', tone: 'warn' },
    ],
  },
  {
    name: 'Done',
    tone: 'var(--success)',
    cards: [
      { id: 'k6', title: 'Ship usage billing', tag: 'Product', tone: 'pos' },
      { id: 'k7', title: 'Reconcile invoices', tag: 'Finance', tone: 'pos' },
    ],
  },
];

/** A lightweight kanban — drag cards to reorder or move between columns. */
@Component({
  selector: 'vsp-kanban-block',
  imports: [VspBlock, VspBadge, VspAvatar],
  template: `<vsp-block
    title="Operations board"
    desc="A lightweight kanban — drag a card to reorder it or move it between columns."
  >
    <div style="padding: 14px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px">
      @for (col of cols; track col.name; let ci = $index) {
        <div #colEl>
          <div
            style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 0 2px"
          >
            <span
              style="width: 8px; height: 8px; border-radius: 99px"
              [style.background]="col.tone"
            ></span>
            <b style="font-size: 12.5px">{{ col.name }}</b>
            <span class="mono" style="font-size: 11px; color: var(--text-faint)">{{
              col.cards.length
            }}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px; min-height: 64px">
            @for (card of items(col); track card.id; let i = $index) {
              @if (showPh(ci) && target!.index === i) {
                <div
                  style="border: 1.6px dashed color-mix(in oklab, var(--accent) 50%, var(--border)); background: color-mix(in oklab, var(--accent) 8%, transparent); border-radius: var(--r-md); height: 56px"
                ></div>
              }
              <div
                data-kcard
                class="card"
                style="padding: 13px; cursor: grab; touch-action: none"
                (pointerdown)="startDrag($event, card, ci)"
              >
                <div
                  style="font-size: 13px; font-weight: 600; margin-bottom: 9px; line-height: 1.4"
                >
                  {{ card.title }}
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between">
                  <vsp-badge [tone]="card.tone">{{ card.tag }}</vsp-badge>
                  <vsp-avatar name="A Q" [hue]="250" [size]="22" />
                </div>
              </div>
            }
            @if (showPh(ci) && target!.index >= items(col).length) {
              <div
                style="border: 1.6px dashed color-mix(in oklab, var(--accent) 50%, var(--border)); background: color-mix(in oklab, var(--accent) 8%, transparent); border-radius: var(--r-md); height: 56px"
              ></div>
            }
            @if (items(col).length === 0 && !showPh(ci)) {
              <div
                style="border: 1.5px dashed var(--border); border-radius: var(--r-sm); padding: 18px 0; text-align: center; font-size: 12px; color: var(--text-faint)"
              >
                Drop here
              </div>
            }
          </div>
        </div>
      }
    </div>
    @if (drag) {
      <div
        [style.left.px]="pt.x - drag.offX"
        [style.top.px]="pt.y - drag.offY"
        [style.width.px]="drag.w"
        style="position: fixed; z-index: 600; pointer-events: none; transform: rotate(2.5deg) scale(1.03); opacity: 0.96"
      >
        <div
          class="card"
          style="padding: 13px; box-shadow: var(--shadow-lg); border-color: color-mix(in oklab, var(--accent) 40%, var(--border))"
        >
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 9px; line-height: 1.4">
            {{ drag.card.title }}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between">
            <vsp-badge [tone]="drag.card.tone">{{ drag.card.tag }}</vsp-badge>
            <vsp-avatar name="A Q" [hue]="250" [size]="22" />
          </div>
        </div>
      </div>
    }
  </vsp-block>`,
})
export class VspKanbanBlock {
  @Input() columns: KanbanColumn[] = DEFAULT_COLUMNS;
  @Output() change = new EventEmitter<KanbanColumn[]>();
  @ViewChildren('colEl') colEls!: QueryList<ElementRef<HTMLElement>>;

  cols: KanbanColumn[] = DEFAULT_COLUMNS.map((c) => ({ ...c, cards: [...c.cards] }));
  drag: DragState | null = null;
  pt = { x: 0, y: 0 };
  target: DropTarget | null = null;

  private dragData: DragState | null = null;
  private targetData: DropTarget | null = null;

  ngOnInit(): void {
    this.cols = this.columns.map((c) => ({ ...c, cards: [...c.cards] }));
  }

  items(col: KanbanColumn): KanbanCard[] {
    return col.cards.filter((c) => !(this.drag && c.id === this.drag.card.id));
  }
  showPh(ci: number): boolean {
    return !!this.drag && !!this.target && this.target.col === ci;
  }

  startDrag(e: PointerEvent, card: KanbanCard, ci: number): void {
    if (e.button !== 0) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const origIndex = this.cols[ci].cards.findIndex((c) => c.id === card.id);
    const d: DragState = {
      card,
      from: ci,
      origIndex,
      w: rect.width,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
    };
    const home = { col: ci, index: origIndex };
    this.dragData = d;
    this.targetData = home;
    this.drag = d;
    this.pt = { x: e.clientX, y: e.clientY };
    this.target = home;
    e.preventDefault();
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
  }

  private onMove = (e: PointerEvent): void => {
    const d = this.dragData;
    if (!d) return;
    this.pt = { x: e.clientX, y: e.clientY };
    let found: DropTarget | null = null;
    this.colEls.forEach((ref, ci) => {
      const el = ref.nativeElement;
      const r = el.getBoundingClientRect();
      if (
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top - 60 &&
        e.clientY <= r.bottom + 80
      ) {
        const cards = Array.from(el.querySelectorAll('[data-kcard]'));
        let idx = cards.length;
        for (let i = 0; i < cards.length; i++) {
          const cr = cards[i].getBoundingClientRect();
          if (e.clientY < cr.top + cr.height / 2) {
            idx = i;
            break;
          }
        }
        found = { col: ci, index: idx };
      }
    });
    if (!found) found = { col: d.from, index: d.origIndex };
    this.targetData = found;
    this.target = found;
  };

  private onUp = (): void => {
    const dd = this.dragData;
    const tg = this.targetData;
    if (dd && tg) {
      const next = this.cols.map((c) => ({
        ...c,
        cards: c.cards.filter((x) => x.id !== dd.card.id),
      }));
      next[tg.col].cards.splice(tg.index, 0, dd.card);
      this.cols = next;
      this.change.emit(next);
    }
    this.dragData = null;
    this.targetData = null;
    this.drag = null;
    this.target = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
  };
}
