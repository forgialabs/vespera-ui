// Registry of live demos rendered inside isolated iframes (see app/embed/[demo]/page.tsx
// and Preview.tsx). Isolating each interactive demo in its own document gives it
// a single `.vsp-root`, so overlays (dropdowns, dialogs, tooltips, the kanban drag
// ghost, …) portal correctly and stay *inside their frame* instead of escaping to
// the first `.vsp-root` on the page. `minH` reserves vertical room so opened
// overlays aren't clipped by the frame.
import type { ComponentType } from 'react';
import {
  ButtonExample,
  SelectExample,
  OverlayExample,
  DatePickerExample,
} from './examples';
import {
  CommandExample,
  SheetExample,
  DateRangeExample,
  EventCalendarExample,
  SideNavExample,
} from './examples-more';
import {
  OrdersBlockExample,
  KanbanBlockExample,
  ApiKeysBlockExample,
  AuditLogBlockExample,
  SystemStatusBlockExample,
  TeamRolesBlockExample,
  DashboardTemplate,
} from './templates';
import { BackgroundDemo } from './foundations-demos';

export interface Demo {
  Comp: ComponentType;
  /** Minimum stage height (px) so opened overlays have room and aren't clipped. */
  minH: number;
}

export const DEMOS: Record<string, Demo> = {
  // Component-guide demos that render overlays / portals / fixed elements.
  button: { Comp: ButtonExample, minH: 200 },
  select: { Comp: SelectExample, minH: 400 },
  overlay: { Comp: OverlayExample, minH: 440 },
  datepicker: { Comp: DatePickerExample, minH: 440 },
  command: { Comp: CommandExample, minH: 460 },
  sheet: { Comp: SheetExample, minH: 320 },
  daterange: { Comp: DateRangeExample, minH: 460 },
  eventcalendar: { Comp: EventCalendarExample, minH: 580 },
  sidenav: { Comp: SideNavExample, minH: 360 },
  // Blocks & templates.
  orders: { Comp: OrdersBlockExample, minH: 540 },
  kanban: { Comp: KanbanBlockExample, minH: 520 },
  apikeys: { Comp: ApiKeysBlockExample, minH: 360 },
  auditlog: { Comp: AuditLogBlockExample, minH: 420 },
  systemstatus: { Comp: SystemStatusBlockExample, minH: 360 },
  teamroles: { Comp: TeamRolesBlockExample, minH: 380 },
  dashboard: { Comp: DashboardTemplate, minH: 720 },
  // Foundations.
  background: { Comp: BackgroundDemo, minH: 440 },
};

export type DemoName = keyof typeof DEMOS;
