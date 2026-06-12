import type { Component } from 'svelte';

export const Button: Component<{
  variant?: 'primary' | 'ghost' | 'subtle' | 'outline' | 'danger';
  size?: 'sm';
  loading?: boolean;
  disabled?: boolean;
  children?: unknown;
}>;
export const IconButton: Component<{ label?: string; children?: unknown }>;
export const Badge: Component<{
  tone?: 'pos' | 'neg' | 'warn' | 'info' | 'muted';
  dot?: boolean;
  children?: unknown;
}>;
export const Tag: Component<{ children?: unknown; onremove?: () => void }>;
export const Kbd: Component<{ children?: unknown }>;
export const Divider: Component<{ vertical?: boolean }>;
export const Spinner: Component<{ size?: 'lg' }>;
export const Card: Component<{ pad?: boolean; children?: unknown }>;
export const CardHead: Component<{ title?: string; desc?: string; right?: unknown }>;
export const Alert: Component<{
  tone?: 'info' | 'pos' | 'warn' | 'neg';
  title?: string;
  icon?: unknown;
  action?: unknown;
  children?: unknown;
}>;
export const Field: Component<{
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children?: unknown;
}>;
export const Input: Component<{ value?: string; invalid?: boolean }>;
export const Textarea: Component<{ value?: string }>;

export type SelectOption = string | { value: string; label: string; sub?: string };
export const NativeSelect: Component<{ value?: string; options?: SelectOption[] }>;
export const Switch: Component<{ checked?: boolean; size?: 'sm'; disabled?: boolean }>;
export const Checkbox: Component<{
  checked?: boolean;
  label?: string;
  sub?: string;
  disabled?: boolean;
}>;
export const Radio: Component<{
  checked?: boolean;
  label?: string;
  sub?: string;
  name?: string;
  value?: string;
  onselect?: () => void;
}>;
export const RadioGroup: Component<{ value?: string; options?: SelectOption[]; name?: string }>;
export const Slider: Component<{ value?: number; min?: number; max?: number; step?: number }>;
export const Progress: Component<{ value?: number; tone?: string; height?: number }>;
export const Skeleton: Component<{ w?: string | number; h?: string | number; r?: number }>;
export const Avatar: Component<{ name: string; hue?: number; size?: number }>;
export interface Person {
  name: string;
  hue?: number;
}
export const AvatarGroup: Component<{ people?: Person[]; max?: number; size?: number }>;
export const Segmented: Component<{ value?: string; options?: string[] }>;
export type TabItem = string | { value: string; label: string; count?: number };
export const Tabs: Component<{ value?: string; tabs?: TabItem[]; right?: unknown }>;
export const Breadcrumb: Component<{ items?: string[] }>;
export const Pagination: Component<{ page?: number; pages?: number }>;
export const Stepper: Component<{ steps?: string[]; current?: number }>;
export const CircularProgress: Component<{
  value?: number;
  size?: number;
  thickness?: number;
  color?: string;
  label?: string;
}>;
export const Stat: Component<{
  label?: string;
  value?: string;
  delta?: string;
  deltaDir?: 'up' | 'down';
  tone?: string;
  icon?: unknown;
}>;
export type TimelineTone = 'pos' | 'neg' | 'warn' | 'info';
export interface TimelineItem {
  title: string;
  time?: string;
  body?: string;
  tone?: TimelineTone;
}
export const Timeline: Component<{ items?: TimelineItem[] }>;
export const DescriptionList: Component<{ items?: [string, string][] }>;
export const Banner: Component<{
  tone?: 'info' | 'warn' | 'accent';
  dismissible?: boolean;
  icon?: unknown;
  action?: unknown;
  children?: unknown;
  ondismiss?: () => void;
}>;
export const EmptyState: Component<{
  title?: string;
  desc?: string;
  compact?: boolean;
  icon?: unknown;
  action?: unknown;
}>;
export interface AccordionItem {
  title: string;
  body: string;
}
export const Accordion: Component<{
  items?: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: number[];
}>;
export const Sparkline: Component<{
  data?: number[];
  color?: string;
  w?: number;
  h?: number;
  fill?: boolean;
}>;
export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}
export const Donut: Component<{ data?: DonutDatum[]; size?: number; thickness?: number }>;
export const StatCard: Component<{
  label?: string;
  value?: string;
  delta?: string;
  deltaDir?: 'up' | 'down';
  spark?: number[];
  sparkColor?: string;
  icon?: unknown;
}>;
export const NumberStepper: Component<{
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}>;
export const CopyButton: Component<{ text: string; label?: string; size?: 'sm' }>;
export const InlineEdit: Component<{
  value?: string;
  placeholder?: string;
  onsave?: (value: string) => void;
}>;
export interface TreeNodeData {
  id?: string;
  label: string;
  badge?: string;
  children?: TreeNodeData[];
}
export const Tree: Component<{ data?: TreeNodeData[]; defaultExpanded?: string[] }>;
export const OTPInput: Component<{ length?: number; value?: string }>;
export const AreaChart: Component<{
  series?: number[][];
  labels?: string[];
  width?: number;
  height?: number;
  color?: string;
  color2?: string;
  dual?: boolean;
}>;
export const BarChart: Component<{
  data?: number[];
  labels?: string[];
  width?: number;
  height?: number;
  color?: string;
}>;
export type DialogTone = 'pos' | 'neg' | 'warn' | 'info';
export const Dialog: Component<{
  open?: boolean;
  title?: string;
  desc?: string;
  maxWidth?: number;
  tone?: DialogTone;
  icon?: unknown;
  footer?: unknown;
  children?: unknown;
  onclose?: () => void;
}>;
export const Sheet: Component<{
  open?: boolean;
  title?: string;
  desc?: string;
  icon?: unknown;
  footer?: unknown;
  children?: unknown;
  onclose?: () => void;
}>;
export type AnchoredAlign = 'start' | 'end';
export const Anchored: Component<{
  align?: AnchoredAlign;
  width?: number;
  layerClass?: string;
  trigger?: unknown;
  children?: unknown;
}>;
export interface MenuItem {
  label?: string;
  kbd?: string;
  danger?: boolean;
  heading?: boolean;
  sep?: boolean;
  onClick?: () => void;
}
export const DropdownMenu: Component<{
  items?: MenuItem[];
  align?: AnchoredAlign;
  width?: number;
  trigger?: unknown;
}>;
export const Popover: Component<{
  align?: AnchoredAlign;
  width?: number;
  trigger?: unknown;
  children?: unknown;
}>;
export const Tooltip: Component<{ label?: string; side?: 'top' | 'bottom'; children?: unknown }>;
export type ToastTone = 'info' | 'pos' | 'neg' | 'warn';
export interface ToastOptions {
  title?: string;
  body?: string;
  tone?: ToastTone;
  duration?: number;
}
export const ToastHost: Component<Record<string, never>>;
export function toast(opts: ToastOptions | string): void;
export function dismissToast(id: string): void;
export interface CommandItem {
  label: string;
  meta?: string;
  keywords?: string;
  icon?: string;
  onRun?: () => void;
}
export interface CommandGroup {
  label: string;
  items: CommandItem[];
}
export const CommandPalette: Component<{
  open?: boolean;
  groups?: CommandGroup[];
  onclose?: () => void;
}>;
export type SelectValue = string | number;
export interface SelectOption {
  value: SelectValue;
  label: string;
  swatch?: string;
}
export type SelectOptionInput = SelectValue | SelectOption;
export const Select: Component<{
  options?: SelectOptionInput[];
  value?: SelectValue;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  onchange?: (value: SelectValue) => void;
}>;
export const Combobox: Component<{
  options?: SelectOptionInput[];
  value?: SelectValue | null;
  placeholder?: string;
  searchPlaceholder?: string;
  clearable?: boolean;
  onchange?: (value: SelectValue | null) => void;
}>;
export const MultiSelect: Component<{
  options?: SelectOptionInput[];
  value?: SelectValue[];
  placeholder?: string;
  searchPlaceholder?: string;
  max?: number;
  onchange?: (value: SelectValue[]) => void;
}>;
export const TokenInput: Component<{
  value?: string[];
  placeholder?: string;
  onchange?: (value: string[]) => void;
}>;
export const FileDropzone: Component<{
  hint?: string;
  accept?: string;
  multiple?: boolean;
  onfiles?: (files: File[]) => void;
}>;
export interface MonthView {
  m: number;
  y: number;
}
export type RangeEdge = 'start' | 'end' | false;
export interface DateRange {
  start: Date | null;
  end: Date | null;
}
export function fmtDate(d: Date | null | undefined): string;
export const Calendar: Component<{
  view?: MonthView;
  isSelected?: (d: Date) => boolean;
  isInRange?: (d: Date) => boolean;
  isRangeEnd?: (d: Date) => RangeEdge;
  onpick?: (d: Date) => void;
}>;
export const DatePicker: Component<{
  value?: Date | null;
  placeholder?: string;
  onchange?: (date: Date) => void;
}>;
export const DateRangePicker: Component<{
  value?: DateRange;
  placeholder?: string;
  onchange?: (range: DateRange) => void;
}>;
export type EventTone = 'info' | 'success' | 'warning' | 'danger' | 'violet';
export interface CalendarEvent {
  id?: string;
  d: number;
  title: string;
  tone: EventTone;
  time: string;
  hour?: number;
}
export const EventCalendar: Component<{
  initialEvents?: CalendarEvent[];
  onchange?: (events: CalendarEvent[]) => void;
}>;
