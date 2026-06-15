/**
 * @vespera-ui/vue — Vue 3 components for the Vespera design system.
 *
 * Thin wrappers over `@vespera-ui/css`: they emit the same `.vsp-`/`ui-` classes
 * as `@vespera-ui/react`, so theming via `.vsp-root` data-attributes works
 * identically. Import the CSS once and wrap your app in a themed root.
 */
import {
  defineComponent,
  h,
  ref,
  computed,
  useId,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  Teleport,
  type PropType,
  type Component,
} from 'vue';

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

export type ButtonVariant = 'primary' | 'ghost' | 'subtle' | 'outline' | 'danger';
export type BadgeTone = 'pos' | 'neg' | 'warn' | 'info' | 'muted';
export type AlertTone = 'info' | 'pos' | 'warn' | 'neg';

export const Button = defineComponent({
  name: 'VspButton',
  props: {
    variant: { type: String as PropType<ButtonVariant>, default: 'ghost' },
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
    loading: Boolean,
    loadingText: { type: String, default: undefined },
    fullWidth: Boolean,
    disabled: Boolean,
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          class: cx(
            'btn',
            `btn-${props.variant}`,
            props.size === 'sm' && 'btn-sm',
            props.size === 'lg' && 'btn-lg',
            props.fullWidth && 'btn-block',
          ),
          disabled: props.disabled || props.loading,
          'aria-busy': props.loading || undefined,
          ...attrs,
        },
        [
          props.loading
            ? h('span', { class: 'ui-spinner', 'aria-hidden': 'true' })
            : slots.leading?.(),
          props.loading && props.loadingText != null ? props.loadingText : slots.default?.(),
          props.loading ? null : slots.trailing?.(),
        ],
      );
  },
});

export type IconButtonVariant = 'ghost' | 'subtle' | 'danger';

export const IconButton = defineComponent({
  name: 'VspIconButton',
  props: {
    label: { type: String, default: undefined },
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
    variant: { type: String as PropType<IconButtonVariant>, default: undefined },
    loading: Boolean,
    disabled: Boolean,
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          class: cx(
            'vsp-icon-btn',
            props.size === 'sm' && 'vsp-icon-btn-sm',
            props.size === 'lg' && 'vsp-icon-btn-lg',
            props.variant && `vsp-icon-btn-${props.variant}`,
          ),
          type: 'button',
          'aria-label': props.label,
          disabled: props.disabled || props.loading,
          'aria-busy': props.loading || undefined,
          ...attrs,
        },
        [
          props.loading
            ? h('span', { class: 'ui-spinner', 'aria-hidden': 'true' })
            : slots.default?.(),
        ],
      );
  },
});

export const Badge = defineComponent({
  name: 'VspBadge',
  props: {
    tone: { type: String as PropType<BadgeTone>, default: 'muted' },
    dot: Boolean,
  },
  setup(props, { slots }) {
    return () =>
      h('span', { class: cx('badge', `badge-${props.tone}`) }, [
        props.dot ? h('i') : null,
        slots.default?.(),
      ]);
  },
});

export const Tag = defineComponent({
  name: 'VspTag',
  emits: ['remove'],
  setup(props, { slots, emit }) {
    return () =>
      h('span', { class: 'ui-tag' }, [
        slots.default?.(),
        h('button', { type: 'button', 'aria-label': 'Remove', onClick: () => emit('remove') }, '×'),
      ]);
  },
});

export const Kbd = defineComponent({
  name: 'VspKbd',
  setup(_, { slots }) {
    return () => h('kbd', { class: 'ui-kbd' }, slots.default?.());
  },
});

export const Divider = defineComponent({
  name: 'VspDivider',
  props: { vertical: Boolean },
  setup(props) {
    return () => h('hr', { class: cx('ui-divider', props.vertical && 'v') });
  },
});

export const Spinner = defineComponent({
  name: 'VspSpinner',
  props: {
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
    label: { type: String, default: undefined },
  },
  setup(props) {
    return () =>
      h('span', {
        class: cx('ui-spinner', props.size === 'sm' && 'sm', props.size === 'lg' && 'lg'),
        role: props.label ? 'status' : undefined,
        'aria-label': props.label,
        'aria-hidden': props.label ? undefined : 'true',
      });
  },
});

export const Card = defineComponent({
  name: 'VspCard',
  props: { pad: Boolean },
  setup(props, { slots, attrs }) {
    return () =>
      h('div', { class: cx('card', props.pad && 'card-pad'), ...attrs }, slots.default?.());
  },
});

export const CardHead = defineComponent({
  name: 'VspCardHead',
  props: {
    title: { type: String, default: undefined },
    desc: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'card-head' }, [
        h('div', { style: { minWidth: 0 } }, [
          h('div', { class: 'ttl' }, props.title),
          props.desc
            ? h('div', { class: 'eyebrow', style: { marginTop: '3px' } }, props.desc)
            : null,
        ]),
        slots.right ? h('div', { class: 'vsp-top-spacer' }) : null,
        slots.right?.(),
      ]);
  },
});

export const Alert = defineComponent({
  name: 'VspAlert',
  props: {
    tone: { type: String as PropType<AlertTone>, default: 'info' },
    title: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: cx('ui-alert', props.tone) }, [
        slots.icon?.(),
        h('div', { style: { flex: 1 } }, [
          props.title ? h('div', { class: 'ui-alert-title' }, props.title) : null,
          slots.default ? h('div', { class: 'ui-alert-body' }, slots.default()) : null,
        ]),
        slots.action?.(),
      ]);
  },
});

export const Field = defineComponent({
  name: 'VspField',
  props: {
    label: { type: String, default: undefined },
    required: Boolean,
    hint: { type: String, default: undefined },
    error: { type: String, default: undefined },
    htmlFor: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'ui-field' }, [
        props.label
          ? h('label', { class: 'ui-label', for: props.htmlFor }, [
              h('span', null, [
                props.label,
                props.required ? h('span', { class: 'req' }, ' *') : null,
              ]),
            ])
          : null,
        slots.default?.(),
        props.error || props.hint
          ? h('span', { class: cx('ui-hint', props.error && 'err') }, props.error || props.hint)
          : null,
      ]);
  },
});

export const Input = defineComponent({
  name: 'VspInput',
  props: {
    modelValue: { type: String, default: '' },
    invalid: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('input', {
        class: cx('ui-input', props.invalid && 'invalid'),
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        ...attrs,
      });
  },
});

export const Textarea = defineComponent({
  name: 'VspTextarea',
  props: { modelValue: { type: String, default: '' } },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h('textarea', {
        class: 'ui-textarea',
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLTextAreaElement).value),
        ...attrs,
      });
  },
});

export const Switch = defineComponent({
  name: 'VspSwitch',
  props: {
    modelValue: Boolean,
    size: { type: String as PropType<'sm'>, default: undefined },
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('button', {
        type: 'button',
        disabled: props.disabled,
        class: cx('ui-switch', props.size === 'sm' && 'sm', props.modelValue && 'on'),
        'aria-pressed': String(props.modelValue),
        onClick: () => emit('update:modelValue', !props.modelValue),
      });
  },
});

export const Checkbox = defineComponent({
  name: 'VspCheckbox',
  props: {
    modelValue: Boolean,
    label: { type: String, default: undefined },
    sub: { type: String, default: undefined },
    disabled: Boolean,
    indeterminate: Boolean,
    invalid: Boolean,
    id: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const toggle = () => {
      if (!props.disabled) emit('update:modelValue', !props.modelValue);
    };
    return () =>
      h(
        'label',
        { class: 'ui-opt', style: { opacity: props.disabled ? 0.5 : 1 }, onClick: toggle },
        [
          h('span', {
            id: props.id,
            role: 'checkbox',
            'aria-checked': props.indeterminate ? 'mixed' : props.modelValue,
            'aria-invalid': props.invalid || undefined,
            class: cx(
              'ui-check',
              (props.modelValue || props.indeterminate) && 'on',
              props.indeterminate && 'mixed',
              props.invalid && 'invalid',
            ),
          }),
          h('span', null, [
            h('span', null, props.label),
            props.sub ? h('span', { class: 'ui-opt-sub' }, props.sub) : null,
          ]),
        ],
      );
  },
});

export type NativeSelectOption =
  | string
  | { value: string; label: string; sub?: string; disabled?: boolean };
const optValue = (o: NativeSelectOption) => (typeof o === 'string' ? o : o.value);
const optLabel = (o: NativeSelectOption) => (typeof o === 'string' ? o : o.label);

export const Radio = defineComponent({
  name: 'VspRadio',
  props: {
    checked: Boolean,
    label: { type: String, default: undefined },
    sub: { type: String, default: undefined },
    disabled: Boolean,
  },
  emits: ['select'],
  setup(props, { emit }) {
    return () =>
      h(
        'label',
        {
          class: 'ui-opt',
          style: { opacity: props.disabled ? 0.5 : 1 },
          onClick: (e: Event) => {
            e.preventDefault();
            if (!props.disabled) emit('select');
          },
        },
        [
          h('span', { class: cx('ui-radio-dot', props.checked && 'on') }),
          h('span', null, [
            h('span', null, props.label),
            props.sub ? h('span', { class: 'ui-opt-sub' }, props.sub) : null,
          ]),
        ],
      );
  },
});

export const RadioGroup = defineComponent({
  name: 'VspRadioGroup',
  props: {
    modelValue: { type: String, default: undefined },
    options: { type: Array as PropType<NativeSelectOption[]>, default: () => [] },
    disabled: Boolean,
    orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: 'vertical' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'div',
        {
          role: 'radiogroup',
          style: {
            display: 'flex',
            flexDirection: props.orientation === 'horizontal' ? 'row' : 'column',
            gap: props.orientation === 'horizontal' ? '18px' : '12px',
            flexWrap: props.orientation === 'horizontal' ? 'wrap' : undefined,
          },
        },
        props.options.map((o) =>
          h(Radio, {
            key: optValue(o),
            label: optLabel(o),
            sub: typeof o === 'object' ? o.sub : undefined,
            disabled: props.disabled || (typeof o === 'object' && o.disabled),
            checked: props.modelValue === optValue(o),
            onSelect: () => emit('update:modelValue', optValue(o)),
          }),
        ),
      );
  },
});

export const Slider = defineComponent({
  name: 'VspSlider',
  props: {
    modelValue: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    disabled: Boolean,
    id: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('input', {
        type: 'range',
        class: 'ui-slider',
        id: props.id,
        value: props.modelValue,
        min: props.min,
        max: props.max,
        step: props.step,
        disabled: props.disabled,
        onInput: (e: Event) =>
          emit('update:modelValue', Number((e.target as HTMLInputElement).value)),
        ...attrs,
      });
  },
});

export const NativeSelect = defineComponent({
  name: 'VspNativeSelect',
  props: {
    modelValue: { type: String, default: undefined },
    options: { type: Array as PropType<NativeSelectOption[]>, default: () => [] },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'select',
        {
          class: 'ui-select',
          value: props.modelValue,
          onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLSelectElement).value),
          ...attrs,
        },
        props.options.map((o) =>
          h('option', { key: optValue(o), value: optValue(o) }, optLabel(o)),
        ),
      );
  },
});

const px = (v: string | number) => (typeof v === 'number' ? `${v}px` : v);

export const Progress = defineComponent({
  name: 'VspProgress',
  props: {
    value: { type: Number, default: 0 },
    tone: { type: String, default: undefined },
    height: { type: Number, default: 6 },
    max: { type: Number, default: 100 },
    indeterminate: Boolean,
    label: { type: String, default: undefined },
  },
  setup(props) {
    return () => {
      const pct = Math.min(100, Math.max(0, (props.value / props.max) * 100));
      return h(
        'div',
        {
          class: cx('meter', props.indeterminate && 'indeterminate'),
          style: { height: px(props.height) },
          role: 'progressbar',
          'aria-label': props.label,
          'aria-valuemin': props.indeterminate ? undefined : 0,
          'aria-valuemax': props.indeterminate ? undefined : props.max,
          'aria-valuenow': props.indeterminate ? undefined : props.value,
        },
        [
          h('i', {
            style: props.indeterminate
              ? { background: props.tone }
              : { width: `${pct}%`, background: props.tone, transition: 'width .3s' },
          }),
        ],
      );
    };
  },
});

export const Skeleton = defineComponent({
  name: 'VspSkeleton',
  props: {
    w: { type: [String, Number] as PropType<string | number>, default: '100%' },
    h: { type: [String, Number] as PropType<string | number>, default: 12 },
    r: { type: Number, default: 7 },
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'skel',
        style: { width: px(props.w), height: px(props.h), borderRadius: px(props.r) },
      });
  },
});

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

export interface Person {
  name: string;
  hue?: number;
  src?: string;
}

export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';
const AVATAR_STATUS: Record<AvatarStatus, string> = {
  online: 'var(--success)',
  offline: 'var(--text-faint)',
  away: 'var(--warning)',
  busy: 'var(--danger)',
};

export const Avatar = defineComponent({
  name: 'VspAvatar',
  props: {
    name: { type: String, required: true },
    hue: { type: Number, default: 0 },
    size: { type: Number, default: 34 },
    src: { type: String, default: undefined },
    alt: { type: String, default: undefined },
    status: { type: String as PropType<AvatarStatus>, default: undefined },
    shape: { type: String as PropType<'circle' | 'square'>, default: 'circle' },
  },
  setup(props) {
    return () => {
      const radius = props.shape === 'square' ? 'var(--r-sm)' : '50%';
      const dot = Math.max(8, Math.round(props.size * 0.28));
      return h('span', { style: { position: 'relative', display: 'inline-flex', flexShrink: 0 } }, [
        h(
          'span',
          {
            class: 'vsp-avatar',
            style: {
              width: px(props.size),
              height: px(props.size),
              fontSize: px(props.size * 0.38),
              borderRadius: radius,
              overflow: 'hidden',
              background: props.src
                ? 'var(--surface-3)'
                : `linear-gradient(140deg, oklch(0.62 0.16 ${props.hue}), oklch(0.55 0.17 ${(props.hue + 50) % 360}))`,
            },
          },
          props.src
            ? [
                h('img', {
                  src: props.src,
                  alt: props.alt ?? props.name,
                  style: { width: '100%', height: '100%', objectFit: 'cover' },
                }),
              ]
            : initialsOf(props.name),
        ),
        props.status
          ? h('span', {
              'aria-label': props.status,
              style: {
                position: 'absolute',
                right: '0',
                bottom: '0',
                width: px(dot),
                height: px(dot),
                borderRadius: '50%',
                background: AVATAR_STATUS[props.status],
                border: '2px solid var(--surface-1)',
              },
            })
          : null,
      ]);
    };
  },
});

export const AvatarGroup = defineComponent({
  name: 'VspAvatarGroup',
  props: {
    people: { type: Array as PropType<Person[]>, default: () => [] },
    max: { type: Number, default: 4 },
    size: { type: Number, default: 32 },
  },
  setup(props) {
    return () => {
      const shown = props.people.slice(0, props.max);
      const extra = props.people.length - shown.length;
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        ...shown.map((p, i) =>
          h(
            'span',
            {
              key: i,
              style: {
                marginLeft: i ? '-10px' : '0',
                border: '2px solid var(--surface-1)',
                borderRadius: '50%',
                position: 'relative',
                zIndex: shown.length - i,
              },
            },
            [h(Avatar, { name: p.name, hue: p.hue ?? 0, src: p.src, size: props.size })],
          ),
        ),
        extra > 0
          ? h(
              'span',
              {
                style: {
                  marginLeft: '-10px',
                  width: px(props.size),
                  height: px(props.size),
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'var(--surface-3)',
                  border: '2px solid var(--surface-1)',
                  fontSize: px(props.size * 0.34),
                  fontWeight: 700,
                  color: 'var(--text-dim)',
                },
              },
              `+${extra}`,
            )
          : null,
      ]);
    };
  },
});

export const Segmented = defineComponent({
  name: 'VspSegmented',
  props: {
    modelValue: { type: String, default: undefined },
    options: { type: Array as PropType<string[]>, default: () => [] },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'div',
        { class: 'ui-seg' },
        props.options.map((o) =>
          h(
            'button',
            {
              key: o,
              type: 'button',
              class: cx(props.modelValue === o && 'on'),
              onClick: () => emit('update:modelValue', o),
            },
            o,
          ),
        ),
      );
  },
});

const ICON_PATHS = { chevL: 'M15 18l-6-6 6-6', chevR: 'M9 18l6-6-6-6', check: 'M20 6L9 17l-5-5' };
const svgIcon = (d: string, size = 14) =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    [h('path', { d })],
  );

export type TabItem = string | { value: string; label: string; count?: number; disabled?: boolean };

export const Tabs = defineComponent({
  name: 'VspTabs',
  props: {
    tabs: { type: Array as PropType<TabItem[]>, default: () => [] },
    modelValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    return () =>
      h('div', { class: 'ui-tabs', style: { alignItems: 'center' } }, [
        ...props.tabs.map((t) => {
          const id = typeof t === 'string' ? t : t.value;
          const label = typeof t === 'string' ? t : t.label;
          const count = typeof t === 'object' ? t.count : undefined;
          const disabled = typeof t === 'object' ? t.disabled : undefined;
          return h(
            'button',
            {
              key: id,
              type: 'button',
              disabled,
              class: cx('ui-tab', props.modelValue === id && 'on'),
              onClick: () => emit('update:modelValue', id),
            },
            [
              label,
              count != null
                ? h('span', { class: 'badge badge-muted', style: { marginLeft: '7px' } }, count)
                : null,
            ],
          );
        }),
        slots.right ? h('div', { style: { flex: 1 } }) : null,
        slots.right?.(),
      ]);
  },
});

export type BreadcrumbItem = string | { label: string; href?: string; icon?: string };
const BC_ELLIPSIS = Symbol('ellipsis');

export const Breadcrumb = defineComponent({
  name: 'VspBreadcrumb',
  props: {
    items: { type: Array as PropType<BreadcrumbItem[]>, default: () => [] },
    maxItems: { type: Number, default: undefined },
  },
  setup(props) {
    return () => {
      const items = props.items;
      const display: (BreadcrumbItem | typeof BC_ELLIPSIS)[] =
        props.maxItems && items.length > props.maxItems
          ? [items[0]!, BC_ELLIPSIS, ...items.slice(items.length - (props.maxItems - 1))]
          : items;
      return h(
        'nav',
        {
          'aria-label': 'Breadcrumb',
          style: { display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px' },
        },
        display.flatMap((it, i) => {
          const last = i === display.length - 1;
          const sep =
            i > 0
              ? h(
                  'span',
                  { key: `s${i}`, style: { color: 'var(--text-faint)', display: 'flex' } },
                  [svgIcon(ICON_PATHS.chevR, 13)],
                )
              : null;
          if (it === BC_ELLIPSIS)
            return [sep, h('span', { key: i, style: { color: 'var(--text-faint)' } }, '…')];
          const obj = typeof it === 'object';
          const label = obj ? it.label : it;
          const color = last ? 'var(--text)' : 'var(--text-dim)';
          const weight = last ? 600 : 500;
          const inner = [obj && it.icon ? blockIcon(it.icon, 14) : null, label];
          const style = {
            color,
            fontWeight: weight,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          };
          const node =
            obj && it.href && !last
              ? h(
                  'a',
                  { key: i, href: it.href, style: { ...style, textDecoration: 'none' } },
                  inner,
                )
              : h('span', { key: i, style }, inner);
          return [sep, node];
        }),
      );
    };
  },
});

export const Pagination = defineComponent({
  name: 'VspPagination',
  props: {
    modelValue: { type: Number, default: 0 },
    pages: { type: Number, default: 1 },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => {
      const page = props.modelValue;
      const nums: (number | '…')[] = [];
      for (let i = 0; i < props.pages; i++) {
        if (i === 0 || i === props.pages - 1 || Math.abs(i - page) <= 1) nums.push(i);
        else if (nums[nums.length - 1] !== '…') nums.push('…');
      }
      return h('div', { style: { display: 'flex', gap: '4px', alignItems: 'center' } }, [
        h(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost btn-sm',
            disabled: page === 0,
            'aria-label': 'Previous page',
            onClick: () => emit('update:modelValue', page - 1),
          },
          [svgIcon(ICON_PATHS.chevL)],
        ),
        ...nums.map((n, i) =>
          n === '…'
            ? h(
                'span',
                {
                  key: `g${i}`,
                  class: 'mono',
                  style: { padding: '0 6px', color: 'var(--text-faint)' },
                },
                '…',
              )
            : h(
                'button',
                {
                  key: n,
                  type: 'button',
                  class: cx('btn', 'btn-sm', n === page ? 'btn-primary' : 'btn-subtle'),
                  style: { minWidth: '32px', padding: 0 },
                  onClick: () => emit('update:modelValue', n),
                },
                n + 1,
              ),
        ),
        h(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost btn-sm',
            disabled: page >= props.pages - 1,
            'aria-label': 'Next page',
            onClick: () => emit('update:modelValue', page + 1),
          },
          [svgIcon(ICON_PATHS.chevR)],
        ),
      ]);
    };
  },
});

export type StepStatus = 'done' | 'active' | 'pending' | 'error';
export type StepperItem = string | { label: string; status?: StepStatus };

export const Stepper = defineComponent({
  name: 'VspStepper',
  props: {
    steps: { type: Array as PropType<StepperItem[]>, default: () => [] },
    current: { type: Number, default: 0 },
    onStepClick: { type: Function as PropType<(i: number) => void>, default: undefined },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: cx('ui-steps', props.orientation === 'vertical' && 'vertical') },
        props.steps.flatMap((s, i) => {
          const obj = typeof s === 'object';
          const label = obj ? s.label : s;
          const status: StepStatus =
            obj && s.status
              ? s.status
              : i < props.current
                ? 'done'
                : i === props.current
                  ? 'active'
                  : 'pending';
          const dot =
            status === 'done' ? svgIcon(ICON_PATHS.check) : status === 'error' ? '!' : i + 1;
          return [
            i > 0
              ? h('div', { key: `b${i}`, class: cx('ui-step-bar', i <= props.current && 'done') })
              : null,
            h(
              props.onStepClick ? 'button' : 'div',
              {
                key: i,
                type: props.onStepClick ? 'button' : undefined,
                class: cx('ui-step', status, props.onStepClick && 'clickable'),
                onClick: props.onStepClick ? () => props.onStepClick!(i) : undefined,
              },
              [
                h('span', { class: 'ui-step-dot' }, [dot]),
                h('span', { class: 'ui-step-label' }, label),
              ],
            ),
          ];
        }),
      );
  },
});

/* ---------------- SideNav family ---------------- */

export const SettingRow = defineComponent({
  name: 'VspSettingRow',
  props: {
    title: { type: String, default: undefined },
    desc: { type: String, default: undefined },
    last: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: cx('ui-setrow', props.last && 'last') }, [
        h('div', { class: 'ui-setrow-main' }, [
          h('div', { class: 'ui-setrow-title' }, props.title ?? slots.title?.()),
          props.desc ? h('div', { class: 'ui-setrow-desc' }, props.desc) : null,
        ]),
        slots.default?.(),
      ]);
  },
});

export type VerticalTabItem =
  | string
  | { value: string; label: string; icon?: string; badge?: string | number };

export const VerticalTabs = defineComponent({
  name: 'VspVerticalTabs',
  props: {
    tabs: { type: Array as PropType<VerticalTabItem[]>, default: () => [] },
    modelValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'div',
        { class: 'ui-vtabs' },
        props.tabs.map((t) => {
          const id = typeof t === 'string' ? t : t.value;
          const label = typeof t === 'string' ? t : t.label;
          const icon = typeof t === 'object' ? t.icon : undefined;
          const badge = typeof t === 'object' ? t.badge : undefined;
          return h(
            'button',
            {
              key: id,
              type: 'button',
              class: cx('ui-vtab', props.modelValue === id && 'on'),
              onClick: () => emit('update:modelValue', id),
            },
            [
              icon ? blockIcon(icon, 16) : null,
              label,
              badge != null ? h('span', { class: 'ui-nav-badge' }, String(badge)) : null,
            ],
          );
        }),
      );
  },
});

export const NavItem = defineComponent({
  name: 'VspNavItem',
  props: {
    icon: { type: String, default: undefined },
    label: { type: String, default: undefined },
    active: { type: Boolean, default: false },
    badge: { type: [String, Number], default: undefined },
    sub: { type: Boolean, default: false },
    href: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () => {
      const className = cx('ui-nav-item', props.active && 'on', props.disabled && 'disabled');
      const inner = [
        props.icon ? blockIcon(props.icon, 16) : slots.icon?.(),
        h('span', { style: { flex: props.sub ? 'none' : 1 } }, props.label ?? slots.default?.()),
        props.badge != null ? h('span', { class: 'ui-nav-badge' }, String(props.badge)) : null,
      ];
      if (props.href && !props.disabled) {
        return h(
          'a',
          {
            href: props.href,
            class: className,
            'aria-current': props.active ? 'page' : undefined,
            onClick: () => emit('click'),
          },
          inner,
        );
      }
      return h(
        'button',
        {
          type: 'button',
          disabled: props.disabled,
          class: className,
          onClick: () => emit('click'),
        },
        inner,
      );
    };
  },
});

export const NavGroup = defineComponent({
  name: 'VspNavGroup',
  props: {
    icon: { type: String, default: undefined },
    label: { type: String, default: undefined },
    defaultOpen: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const open = ref(props.defaultOpen);
    return () =>
      h('div', { class: cx('ui-nav-group', open.value && 'open') }, [
        h(
          'button',
          {
            type: 'button',
            class: cx('ui-nav-item', open.value && 'open'),
            onClick: () => (open.value = !open.value),
          },
          [
            props.icon ? blockIcon(props.icon, 16) : null,
            h('span', {}, props.label),
            svgIconClass(ICON_PATHS.chevR, 16, 'ui-nav-chev'),
          ],
        ),
        h('div', { class: 'ui-nav-sub' }, [
          h('div', {}, [
            h('div', { class: 'ui-nav', style: { paddingTop: '2px' } }, slots.default?.()),
          ]),
        ]),
      ]);
  },
});

export const InputAffix = defineComponent({
  name: 'VspInputAffix',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: '' },
    leadingIcon: { type: String, default: undefined },
    prefix: { type: String, default: undefined },
    unit: { type: String, default: undefined },
    wrapClass: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs, slots }) {
    return () =>
      h('div', { class: cx('ui-affix', props.wrapClass) }, [
        props.leadingIcon ? blockIcon(props.leadingIcon, 16) : slots.leading?.(),
        props.prefix ? h('span', { class: 'unit' }, props.prefix) : null,
        h('input', {
          ...attrs,
          value: props.modelValue,
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        }),
        props.unit ? h('span', { class: 'unit' }, props.unit) : null,
      ]);
  },
});

export const CircularProgress = defineComponent({
  name: 'VspCircularProgress',
  props: {
    value: { type: Number, default: 0 },
    size: { type: Number, default: 76 },
    thickness: { type: Number, default: 7 },
    color: { type: String, default: 'var(--accent)' },
    label: { type: String, default: undefined },
  },
  setup(props) {
    return () => {
      const r = (props.size - props.thickness) / 2;
      const circ = 2 * Math.PI * r;
      return h(
        'div',
        { style: { position: 'relative', width: px(props.size), height: px(props.size) } },
        [
          h(
            'svg',
            { width: props.size, height: props.size, style: { transform: 'rotate(-90deg)' } },
            [
              h('circle', {
                cx: props.size / 2,
                cy: props.size / 2,
                r,
                fill: 'none',
                stroke: 'var(--surface-3)',
                'stroke-width': props.thickness,
              }),
              h('circle', {
                cx: props.size / 2,
                cy: props.size / 2,
                r,
                fill: 'none',
                stroke: props.color,
                'stroke-width': props.thickness,
                'stroke-linecap': 'round',
                'stroke-dasharray': circ,
                'stroke-dashoffset': circ * (1 - Math.min(100, props.value) / 100),
                style: { transition: 'stroke-dashoffset .5s cubic-bezier(.3,.7,.3,1)' },
              }),
            ],
          ),
          h(
            'div',
            {
              class: 'tnum',
              style: {
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: px(props.size * 0.24),
              },
            },
            props.label ?? `${Math.round(props.value)}%`,
          ),
        ],
      );
    };
  },
});

export const Stat = defineComponent({
  name: 'VspStat',
  props: {
    label: { type: String, default: undefined },
    value: { type: String, default: undefined },
    delta: { type: String, default: undefined },
    deltaDir: { type: String as PropType<'up' | 'down'>, default: 'up' },
    tone: { type: String, default: 'var(--accent)' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        { class: 'card card-pad', style: { display: 'flex', alignItems: 'center', gap: '13px' } },
        [
          slots.icon
            ? h(
                'span',
                {
                  style: {
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--r-sm)',
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    background: `color-mix(in oklab, ${props.tone} 14%, transparent)`,
                    color: props.tone,
                  },
                },
                slots.icon(),
              )
            : null,
          h('div', { style: { minWidth: 0 } }, [
            h('div', { class: 'eyebrow' }, props.label),
            h(
              'div',
              { style: { display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '3px' } },
              [
                h(
                  'span',
                  {
                    class: 'tnum',
                    style: { fontSize: '22px', fontWeight: 800, letterSpacing: '-.02em' },
                  },
                  props.value,
                ),
                props.delta != null
                  ? h(
                      'span',
                      {
                        class: cx('badge', props.deltaDir === 'up' ? 'badge-pos' : 'badge-neg'),
                        style: { padding: '1px 6px' },
                      },
                      [
                        svgIcon(
                          props.deltaDir === 'up'
                            ? 'M12 19V5M5 12l7-7 7 7'
                            : 'M12 5v14M5 12l7 7 7-7',
                          10,
                        ),
                        props.delta,
                      ],
                    )
                  : null,
              ],
            ),
          ]),
        ],
      );
  },
});

const clockSvg = (size = 14) =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    [h('circle', { cx: 12, cy: 12, r: 9 }), h('path', { d: 'M12 7v5l3 2' })],
  );

const TL_TONE: Record<string, string> = {
  pos: 'var(--success)',
  neg: 'var(--danger)',
  warn: 'var(--warning)',
  info: 'var(--accent)',
};

export interface TimelineItem {
  title: string;
  time?: string;
  body?: string;
  tone?: 'pos' | 'neg' | 'warn' | 'info';
  active?: boolean;
}

export const Timeline = defineComponent({
  name: 'VspTimeline',
  props: {
    items: { type: Array as PropType<TimelineItem[]>, default: () => [] },
    orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: 'vertical' },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: cx('ui-tl', props.orientation === 'horizontal' && 'horizontal') },
        props.items.map((it, i) => {
          const c = it.tone ? TL_TONE[it.tone] : undefined;
          return h('div', { key: i, class: cx('ui-tl-item', it.active && 'active') }, [
            h(
              'span',
              {
                class: 'ui-tl-dot',
                style: c
                  ? {
                      background: `color-mix(in oklab, ${c} 14%, transparent)`,
                      color: c,
                      borderColor: `color-mix(in oklab, ${c} 30%, transparent)`,
                    }
                  : undefined,
              },
              [clockSvg()],
            ),
            h('div', { class: 'ui-tl-body' }, [
              h(
                'div',
                {
                  style: { display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' },
                },
                [
                  h('span', { style: { fontWeight: 600, fontSize: '13.5px' } }, it.title),
                  it.time
                    ? h('span', { class: 'eyebrow', style: { marginLeft: 'auto' } }, it.time)
                    : null,
                ],
              ),
              it.body
                ? h(
                    'div',
                    { style: { fontSize: '12.5px', color: 'var(--text-dim)', marginTop: '3px' } },
                    it.body,
                  )
                : null,
            ]),
          ]);
        }),
      );
  },
});

export const DescriptionList = defineComponent({
  name: 'VspDescriptionList',
  props: { items: { type: Array as PropType<[string, string][]>, default: () => [] } },
  setup(props) {
    return () =>
      h(
        'dl',
        { class: 'ui-dl' },
        props.items.flatMap(([k, v], i) => {
          const last = i === props.items.length - 1 ? 'last' : '';
          return [
            h('dt', { key: `k${i}`, class: last }, k),
            h('dd', { key: `v${i}`, class: last }, v),
          ];
        }),
      );
  },
});

const BANNER_ICON: Record<string, string> = {
  info: 'M12 3l1.6 5L19 9.6l-5 1.6L12 16l-1.6-4.8L5 9.6l5.4-1.6z',
  warn: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9',
  accent: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  pos: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  neg: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};
const X_PATH = 'M18 6L6 18M6 6l12 12';
const INBOX_PATH =
  'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z';

export const Banner = defineComponent({
  name: 'VspBanner',
  props: {
    tone: {
      type: String as PropType<'info' | 'warn' | 'accent' | 'pos' | 'neg'>,
      default: 'info',
    },
    dismissible: Boolean,
  },
  emits: ['dismiss'],
  setup(props, { slots, emit }) {
    return () =>
      h('div', { class: cx('ui-banner', props.tone) }, [
        slots.icon ? slots.icon() : svgIcon(BANNER_ICON[props.tone]!, 18),
        h('div', { style: { flex: 1, fontSize: '13px', fontWeight: 500 } }, slots.default?.()),
        slots.action?.(),
        props.dismissible
          ? h(
              'button',
              {
                type: 'button',
                class: 'ui-banner-x',
                'aria-label': 'Dismiss',
                onClick: () => emit('dismiss'),
              },
              [svgIcon(X_PATH, 15)],
            )
          : null,
      ]);
  },
});

export const EmptyState = defineComponent({
  name: 'VspEmptyState',
  props: {
    title: { type: String, default: undefined },
    desc: { type: String, default: undefined },
    compact: Boolean,
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          style: {
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            padding: props.compact ? '32px 20px' : '56px 24px',
          },
        },
        [
          h('div', { style: { maxWidth: '340px' } }, [
            h(
              'span',
              {
                style: {
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 18px',
                  background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
                  color: 'var(--accent)',
                  border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
                },
              },
              slots.icon ? slots.icon() : [svgIcon(INBOX_PATH, 26)],
            ),
            h('div', { style: { fontSize: '17px', fontWeight: 700 } }, props.title),
            props.desc
              ? h(
                  'p',
                  {
                    style: {
                      margin: '7px 0 0',
                      color: 'var(--text-dim)',
                      fontSize: '13.5px',
                      lineHeight: 1.6,
                    },
                  },
                  props.desc,
                )
              : null,
            slots.action
              ? h(
                  'div',
                  {
                    style: {
                      marginTop: '20px',
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center',
                    },
                  },
                  slots.action(),
                )
              : null,
          ]),
        ],
      );
  },
});

export interface AccordionItem {
  title: string;
  body: string;
}

export const Accordion = defineComponent({
  name: 'VspAccordion',
  props: {
    items: { type: Array as PropType<AccordionItem[]>, default: () => [] },
    multiple: Boolean,
    defaultOpen: { type: Array as PropType<number[]>, default: () => [] },
    open: { type: Array as PropType<number[]>, default: undefined },
  },
  emits: ['update:open', 'openChange'],
  setup(props, { emit }) {
    const internal = ref(new Set<number>(props.defaultOpen));
    const openSet = computed(() =>
      props.open !== undefined ? new Set<number>(props.open) : internal.value,
    );
    const toggle = (i: number) => {
      const s = openSet.value;
      const n = new Set<number>(props.multiple ? s : []);
      if (s.has(i)) n.delete(i);
      else n.add(i);
      if (props.open === undefined) internal.value = n;
      emit('update:open', [...n]);
      emit('openChange', [...n]);
    };
    return () =>
      h(
        'div',
        { class: 'ui-acc' },
        props.items.map((it, i) =>
          h('div', { key: i, class: cx('ui-acc-item', openSet.value.has(i) && 'open') }, [
            h('button', { type: 'button', class: 'ui-acc-head', onClick: () => toggle(i) }, [
              it.title,
              h(
                'svg',
                {
                  class: 'chev',
                  viewBox: '0 0 24 24',
                  width: 17,
                  height: 17,
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 2,
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                },
                [h('path', { d: ICON_PATHS.chevR })],
              ),
            ]),
            h('div', { class: 'ui-acc-bodywrap' }, [
              h('div', null, [h('div', { class: 'ui-acc-body' }, it.body)]),
            ]),
          ]),
        ),
      );
  },
});

type Pt = [number, number];
/** Smooth (cubic) SVG path through points. */
export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  return d;
}

export const Sparkline = defineComponent({
  name: 'VspSparkline',
  props: {
    data: { type: Array as PropType<number[]>, default: () => [] },
    color: { type: String, default: 'var(--accent)' },
    w: { type: Number, default: 110 },
    h: { type: Number, default: 34 },
    fill: { type: Boolean, default: true },
  },
  setup(props) {
    const gid = 'spk' + useId().replace(/[^a-zA-Z0-9]/g, '');
    return () => {
      const data = props.data;
      const min = Math.min(...data);
      const max = Math.max(...data);
      const rng = max - min || 1;
      const pts: Pt[] = data.map((v, i) => [
        (i / (data.length - 1)) * props.w,
        props.h - 3 - ((v - min) / rng) * (props.h - 6),
      ]);
      const d = smoothPath(pts);
      const last = pts[pts.length - 1] ?? [0, 0];
      return h(
        'svg',
        {
          width: props.w,
          height: props.h,
          viewBox: `0 0 ${props.w} ${props.h}`,
          style: { display: 'block', overflow: 'visible' },
        },
        [
          props.fill
            ? h('defs', null, [
                h('linearGradient', { id: gid, x1: '0', x2: '0', y1: '0', y2: '1' }, [
                  h('stop', { offset: '0', 'stop-color': props.color, 'stop-opacity': '0.28' }),
                  h('stop', { offset: '1', 'stop-color': props.color, 'stop-opacity': '0' }),
                ]),
              ])
            : null,
          props.fill
            ? h('path', {
                d: `${d} L ${props.w} ${props.h} L 0 ${props.h} Z`,
                fill: `url(#${gid})`,
              })
            : null,
          h('path', {
            d,
            fill: 'none',
            stroke: props.color,
            'stroke-width': '2',
            'stroke-linecap': 'round',
          }),
          h('circle', { cx: last[0], cy: last[1], r: '2.6', fill: props.color }),
        ],
      );
    };
  },
});

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export const Donut = defineComponent({
  name: 'VspDonut',
  props: {
    data: { type: Array as PropType<DonutDatum[]>, default: () => [] },
    size: { type: Number, default: 168 },
    thickness: { type: Number, default: 22 },
    centerLabel: { type: String, default: undefined },
    valueFormat: { type: Function as PropType<(n: number) => string>, default: undefined },
  },
  setup(props, { slots }) {
    const hover = ref<number | null>(null);
    return () => {
      const total = props.data.reduce((s, d) => s + d.value, 0) || 1;
      const fmt = props.valueFormat ?? ((n: number) => niceNum(n));
      const r = (props.size - props.thickness) / 2;
      const c = props.size / 2;
      const circ = 2 * Math.PI * r;
      let acc = 0;
      const segs = props.data.map((d, i) => {
        const len = (d.value / total) * circ;
        const seg = h('circle', {
          key: i,
          cx: c,
          cy: c,
          r,
          fill: 'none',
          stroke: d.color,
          'stroke-width': props.thickness,
          'stroke-dasharray': `${len - 2.5} ${circ - len + 2.5}`,
          'stroke-dashoffset': -acc,
          'stroke-linecap': 'round',
          opacity: hover.value == null || hover.value === i ? 1 : 0.3,
          style: { transition: 'opacity .15s', cursor: 'pointer' },
          onMouseenter: () => (hover.value = i),
          onMouseleave: () => (hover.value = null),
        });
        acc += len;
        return seg;
      });
      const hv = hover.value;
      const center =
        hv != null
          ? h('div', null, [
              h(
                'div',
                { style: { fontSize: '19px', fontWeight: 800, letterSpacing: '-0.02em' } },
                fmt(props.data[hv]!.value),
              ),
              h(
                'div',
                { style: { fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' } },
                props.data[hv]!.label,
              ),
            ])
          : (slots.center?.() ?? props.centerLabel);
      return h('div', { style: { display: 'flex', alignItems: 'center', gap: '22px' } }, [
        h(
          'div',
          {
            style: {
              position: 'relative',
              width: px(props.size),
              height: px(props.size),
              flexShrink: 0,
            },
          },
          [
            center != null
              ? h(
                  'div',
                  {
                    style: {
                      position: 'absolute',
                      inset: 0,
                      display: 'grid',
                      placeItems: 'center',
                      textAlign: 'center',
                    },
                  },
                  center,
                )
              : null,
            h(
              'svg',
              {
                width: props.size,
                height: props.size,
                style: { transform: 'rotate(-90deg)', display: 'block' },
              },
              [
                h('circle', {
                  cx: c,
                  cy: c,
                  r,
                  fill: 'none',
                  stroke: 'var(--surface-3)',
                  'stroke-width': props.thickness,
                }),
                ...segs,
              ],
            ),
          ],
        ),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 } },
          props.data.map((d, i) =>
            h(
              'div',
              {
                key: i,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  opacity: hover.value == null || hover.value === i ? 1 : 0.45,
                  transition: 'opacity .15s',
                },
                onMouseenter: () => (hover.value = i),
                onMouseleave: () => (hover.value = null),
              },
              [
                h('i', {
                  style: {
                    width: '9px',
                    height: '9px',
                    borderRadius: '3px',
                    background: d.color,
                    flexShrink: 0,
                  },
                }),
                h('span', { style: { color: 'var(--text-dim)', flex: 1 } }, d.label),
                h(
                  'span',
                  { class: 'mono tnum', style: { fontWeight: 600 } },
                  `${Math.round((d.value / total) * 100)}%`,
                ),
              ],
            ),
          ),
        ),
      ]);
    };
  },
});

export const StatCard = defineComponent({
  name: 'VspStatCard',
  props: {
    label: { type: String, default: undefined },
    value: { type: String, default: undefined },
    delta: { type: String, default: undefined },
    deltaDir: { type: String as PropType<'up' | 'down'>, default: 'up' },
    spark: { type: Array as PropType<number[]>, default: undefined },
    sparkColor: { type: String, default: 'var(--accent)' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'card card-pad vsp-rise',
          style: { display: 'flex', flexDirection: 'column', gap: '14px' },
        },
        [
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
            [
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, [
                h(
                  'span',
                  {
                    style: {
                      width: '34px',
                      height: '34px',
                      borderRadius: 'var(--r-sm)',
                      display: 'grid',
                      placeItems: 'center',
                      background: 'color-mix(in oklab, var(--accent) 13%, transparent)',
                      color: 'var(--accent)',
                    },
                  },
                  slots.icon?.(),
                ),
                h('span', { class: 'eyebrow' }, props.label),
              ]),
              props.delta != null
                ? h(
                    'span',
                    { class: cx('badge', props.deltaDir === 'up' ? 'badge-pos' : 'badge-neg') },
                    [
                      svgIcon(
                        props.deltaDir === 'up' ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7',
                        11,
                      ),
                      props.delta,
                    ],
                  )
                : null,
            ],
          ),
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '12px',
              },
            },
            [
              h(
                'div',
                {
                  class: 'tnum',
                  style: {
                    fontSize: '30px',
                    fontWeight: 800,
                    letterSpacing: '-.02em',
                    lineHeight: 1,
                  },
                },
                props.value,
              ),
              props.spark ? h(Sparkline, { data: props.spark, color: props.sparkColor }) : null,
            ],
          ),
        ],
      );
  },
});

const ICON_CHECK = 'M20 6L9 17l-5-5';
const ICON_DOC = 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6';
const ICON_PENCIL = 'M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z';

export const NumberStepper = defineComponent({
  name: 'VspNumberStepper',
  props: {
    modelValue: { type: Number, default: 0 },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    step: { type: Number, default: 1 },
    unit: { type: String, default: undefined },
    disabled: Boolean,
    id: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const clamp = (v: number) => {
      let n = v;
      if (props.min != null && n < props.min) n = props.min;
      if (props.max != null && n > props.max) n = props.max;
      return n;
    };
    const set = (v: number) => emit('update:modelValue', clamp(v));
    return () =>
      h('div', { class: cx('ui-stepper', props.disabled && 'disabled') }, [
        h(
          'button',
          {
            type: 'button',
            'aria-label': 'Decrease',
            disabled: props.disabled || (props.min != null && props.modelValue <= props.min),
            onClick: () => set(props.modelValue - props.step),
          },
          '−',
        ),
        h('span', { class: 'val' }, [
          h('input', {
            id: props.id,
            class: 'ui-stepper-input',
            type: 'text',
            inputmode: 'decimal',
            value: String(props.modelValue),
            disabled: props.disabled,
            'aria-label': 'Value',
            onInput: (e: Event) => {
              const raw = (e.target as HTMLInputElement).value;
              const n = Number(raw);
              if (raw !== '' && raw !== '-' && Number.isFinite(n)) emit('update:modelValue', n);
            },
            onBlur: () => set(props.modelValue),
          }),
          props.unit ? h('i', null, props.unit) : null,
        ]),
        h(
          'button',
          {
            type: 'button',
            'aria-label': 'Increase',
            disabled: props.disabled || (props.max != null && props.modelValue >= props.max),
            onClick: () => set(props.modelValue + props.step),
          },
          '+',
        ),
      ]);
  },
});

export const CopyButton = defineComponent({
  name: 'VspCopyButton',
  props: {
    text: { type: String, required: true },
    label: { type: String, default: 'Copy' },
    size: { type: String as PropType<'sm'>, default: 'sm' },
  },
  setup(props) {
    const done = ref(false);
    const copy = async () => {
      try {
        await navigator.clipboard?.writeText(props.text);
      } catch {
        /* clipboard unavailable */
      }
      done.value = true;
      setTimeout(() => (done.value = false), 1400);
    };
    return () =>
      h(
        'button',
        {
          type: 'button',
          class: cx('btn', 'btn-ghost', props.size === 'sm' && 'btn-sm'),
          onClick: copy,
        },
        [
          done.value
            ? h('span', { style: { color: 'var(--success)', display: 'inline-flex' } }, [
                svgIcon(ICON_CHECK, 15),
              ])
            : svgIcon(ICON_DOC, 15),
          done.value ? 'Copied' : props.label,
        ],
      );
  },
});

export const InlineEdit = defineComponent({
  name: 'VspInlineEdit',
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: 'Empty' },
  },
  emits: ['save'],
  setup(props, { emit }) {
    const editing = ref(false);
    const draft = ref(props.value);
    const commit = () => {
      editing.value = false;
      if (draft.value !== props.value) emit('save', draft.value);
    };
    return () =>
      editing.value
        ? h('input', {
            class: 'ui-input',
            value: draft.value,
            style: { height: '32px', maxWidth: '240px' },
            onVnodeMounted: (vn: { el: unknown }) => (vn.el as HTMLInputElement)?.focus(),
            onInput: (e: Event) => (draft.value = (e.target as HTMLInputElement).value),
            onBlur: commit,
            onKeydown: (e: KeyboardEvent) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') {
                draft.value = props.value;
                editing.value = false;
              }
            },
          })
        : h(
            'span',
            {
              class: 'ui-inline',
              onClick: () => {
                draft.value = props.value;
                editing.value = true;
              },
            },
            [
              h(
                'span',
                { style: { color: props.value ? 'var(--text)' : 'var(--text-faint)' } },
                props.value || props.placeholder,
              ),
              h('span', { class: 'pen', style: { display: 'inline-flex' } }, [
                svgIcon(ICON_PENCIL, 14),
              ]),
            ],
          );
  },
});

const svgIconClass = (d: string, size: number, cls: string) =>
  h(
    'svg',
    {
      class: cls,
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    [h('path', { d })],
  );

const ICON_LAYERS = 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5';

export interface TreeNodeData {
  id?: string;
  label: string;
  badge?: string;
  children?: TreeNodeData[];
}
const treeNodeId = (n: TreeNodeData) => n.id ?? n.label;

const VspTreeNode: Component = defineComponent({
  name: 'VspTreeNode',
  props: {
    node: { type: Object as PropType<TreeNodeData>, required: true },
    expanded: { type: Object as PropType<Set<string>>, required: true },
    selected: { type: String as PropType<string | null>, default: null },
    toggle: { type: Function as PropType<(id: string) => void>, required: true },
    select: { type: Function as PropType<(id: string) => void>, required: true },
  },
  setup(props) {
    return () => {
      const node = props.node;
      const id = treeNodeId(node);
      const kids = node.children ?? [];
      const hasKids = kids.length > 0;
      const open = props.expanded.has(id);
      return h('div', null, [
        h(
          'div',
          {
            class: cx('ui-tree-row', open && 'open', props.selected === id && 'sel'),
            onClick: () => {
              if (hasKids) props.toggle(id);
              props.select(id);
            },
          },
          [
            hasKids
              ? svgIconClass(ICON_PATHS.chevR, 16, 'tw-chev')
              : h('span', { style: { width: '16px', flexShrink: 0 } }),
            svgIconClass(hasKids ? ICON_LAYERS : ICON_DOC, 16, 'tw-icon'),
            h(
              'span',
              {
                style: {
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              },
              node.label,
            ),
            node.badge != null
              ? h(
                  'span',
                  { class: 'mono', style: { fontSize: '11px', color: 'var(--text-faint)' } },
                  node.badge,
                )
              : null,
          ],
        ),
        hasKids && open
          ? h(
              'div',
              { class: 'ui-tree-children' },
              kids.map((c, i) =>
                h(VspTreeNode, {
                  key: i,
                  node: c,
                  expanded: props.expanded,
                  selected: props.selected,
                  toggle: props.toggle,
                  select: props.select,
                }),
              ),
            )
          : null,
      ]);
    };
  },
});

export const Tree = defineComponent({
  name: 'VspTree',
  props: {
    data: { type: Array as PropType<TreeNodeData[]>, default: () => [] },
    defaultExpanded: { type: Array as PropType<string[]>, default: () => [] },
    expanded: { type: Array as PropType<string[]>, default: undefined },
    selected: { type: String as PropType<string | null>, default: undefined },
  },
  emits: ['update:expanded', 'update:selected', 'select'],
  setup(props, { emit }) {
    const expInternal = ref(new Set<string>(props.defaultExpanded));
    const selInternal = ref<string | null>(null);
    const expandedSet = computed(() =>
      props.expanded !== undefined ? new Set<string>(props.expanded) : expInternal.value,
    );
    const selectedId = computed(() =>
      props.selected !== undefined ? props.selected : selInternal.value,
    );
    const toggle = (id: string) => {
      const n = new Set(expandedSet.value);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      if (props.expanded === undefined) expInternal.value = n;
      emit('update:expanded', [...n]);
    };
    const select = (id: string) => {
      if (props.selected === undefined) selInternal.value = id;
      emit('update:selected', id);
      emit('select', id);
    };
    return () =>
      h(
        'div',
        { class: 'ui-tree' },
        props.data.map((n, i) =>
          h(VspTreeNode, {
            key: i,
            node: n,
            expanded: expandedSet.value,
            selected: selectedId.value,
            toggle,
            select,
          }),
        ),
      );
  },
});

export const OTPInput = defineComponent({
  name: 'VspOTPInput',
  props: {
    length: { type: Number, default: 6 },
    modelValue: { type: String, default: '' },
    disabled: Boolean,
    invalid: Boolean,
  },
  emits: ['update:modelValue', 'complete'],
  setup(props, { emit }) {
    const refs: (HTMLInputElement | null)[] = [];
    const chars = () => Array.from({ length: props.length }, (_, k) => props.modelValue[k] ?? '');
    const emitNext = (next: string[]) => {
      const joined = next.join('');
      emit('update:modelValue', joined);
      if (joined.length === props.length) emit('complete', joined);
    };
    const set = (i: number, ch: string) => {
      const next = chars();
      next[i] = ch.slice(-1);
      emitNext(next);
      if (ch && i < props.length - 1) refs[i + 1]?.focus();
    };
    const onPaste = (i: number, e: ClipboardEvent) => {
      const text = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
      if (!text) return;
      e.preventDefault();
      const next = chars();
      for (let j = 0; j < text.length && i + j < props.length; j++) next[i + j] = text[j]!;
      emitNext(next);
      refs[Math.min(i + text.length, props.length - 1)]?.focus();
    };
    const onKey = (i: number, e: KeyboardEvent) => {
      if (e.key === 'Backspace' && !props.modelValue[i] && i > 0) refs[i - 1]?.focus();
    };
    return () =>
      h(
        'div',
        { class: cx('ui-otp', props.invalid && 'invalid') },
        Array.from({ length: props.length }, (_, i) =>
          h('input', {
            key: i,
            ref: (el: unknown) => {
              refs[i] = el as HTMLInputElement | null;
            },
            inputmode: 'numeric',
            maxlength: 1,
            value: props.modelValue[i] ?? '',
            disabled: props.disabled,
            'aria-invalid': props.invalid || undefined,
            onInput: (e: Event) => set(i, (e.target as HTMLInputElement).value.replace(/\D/g, '')),
            onPaste: (e: ClipboardEvent) => onPaste(i, e),
            onKeydown: (e: KeyboardEvent) => onKey(i, e),
          }),
        ),
      );
  },
});

export function niceNum(n: number): string {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'k';
  return String(n);
}

export const AreaChart = defineComponent({
  name: 'VspAreaChart',
  props: {
    series: { type: Array as PropType<number[][]>, default: () => [] },
    labels: { type: Array as PropType<string[]>, default: undefined },
    width: { type: Number, default: 760 },
    height: { type: Number, default: 260 },
    color: { type: String, default: 'var(--accent)' },
    color2: { type: String, default: 'var(--accent-2)' },
    dual: Boolean,
  },
  setup(props) {
    const gid = 'ac' + useId().replace(/[^a-zA-Z0-9]/g, '');
    const txt = (x: number, y: number, anchor: string, val: string) =>
      h(
        'text',
        {
          x,
          y,
          'text-anchor': anchor,
          'font-size': '10',
          fill: 'var(--text-faint)',
          'font-family': 'var(--font-mono)',
        },
        val,
      );
    return () => {
      const w = props.width;
      const height = props.height;
      const padL = 38;
      const padB = 26;
      const padT = 12;
      const padR = 8;
      const innerW = Math.max(10, w - padL - padR);
      const innerH = height - padB - padT;
      const s0 = props.series[0] ?? [];
      const s1 = props.series[1];
      const all = props.dual && s1 ? [...s0, ...s1] : s0;
      const max = Math.max(...all, 0) * 1.12;
      const rng = max || 1;
      const sx = (i: number, len: number) => padL + (i / Math.max(1, len - 1)) * innerW;
      const sy = (v: number) => padT + innerH - (v / rng) * innerH;
      const mkPts = (arr: number[]): Pt[] => arr.map((v, i) => [sx(i, arr.length), sy(v)]);
      const lines = (props.dual && s1 ? [s0, s1] : [s0]).map(mkPts);
      const yTicks = 4;
      const grid = Array.from({ length: yTicks + 1 }, (_, i) => {
        const y = sy((max / yTicks) * i);
        return h('g', { key: 'g' + i }, [
          h('line', {
            x1: padL,
            x2: w - padR,
            y1: y,
            y2: y,
            stroke: 'var(--grid-line)',
            'stroke-width': '1',
          }),
          txt(padL - 8, y + 3.5, 'end', niceNum(Math.round((max / yTicks) * i))),
        ]);
      });
      const lbls = props.labels
        ? props.labels.map((lb, i) =>
            i % Math.ceil(props.labels!.length / 7) === 0
              ? txt(sx(i, props.labels!.length), height - 8, 'middle', lb)
              : null,
          )
        : [];
      const lineEls = lines.map((pts, li) => {
        const stroke = li === 0 ? props.color : props.color2;
        const lastPt = pts[pts.length - 1];
        const firstPt = pts[0];
        return h('g', { key: 'ln' + li }, [
          li === 0 && firstPt && lastPt
            ? h('path', {
                d: `${smoothPath(pts)} L ${lastPt[0]} ${padT + innerH} L ${firstPt[0]} ${padT + innerH} Z`,
                fill: `url(#${gid})`,
              })
            : null,
          h('path', {
            d: smoothPath(pts),
            fill: 'none',
            stroke,
            'stroke-width': '2.4',
            'stroke-linecap': 'round',
            'stroke-dasharray': li === 1 ? '5 5' : undefined,
            style: { opacity: li === 1 ? 0.7 : 1 },
          }),
        ]);
      });
      return h('svg', { width: w, height, style: { display: 'block' } }, [
        h('defs', null, [
          h('linearGradient', { id: gid, x1: '0', x2: '0', y1: '0', y2: '1' }, [
            h('stop', { offset: '0', 'stop-color': props.color, 'stop-opacity': '0.22' }),
            h('stop', { offset: '1', 'stop-color': props.color, 'stop-opacity': '0' }),
          ]),
        ]),
        ...grid,
        ...lbls,
        ...lineEls,
      ]);
    };
  },
});

const BAR_PALETTE = [
  'var(--accent)',
  'var(--accent-2)',
  'var(--success)',
  'var(--warning)',
  'var(--danger)',
];

export const BarChart = defineComponent({
  name: 'VspBarChart',
  props: {
    data: { type: Array as PropType<number[] | number[][]>, default: () => [] },
    labels: { type: Array as PropType<string[]>, default: undefined },
    width: { type: Number, default: 620 },
    height: { type: Number, default: 240 },
    color: { type: String, default: undefined },
    colors: { type: Array as PropType<string[]>, default: undefined },
    seriesLabels: { type: Array as PropType<string[]>, default: undefined },
    horizontal: Boolean,
    stacked: Boolean,
    valueFormat: { type: Function as PropType<(n: number) => string>, default: undefined },
    showValues: Boolean,
  },
  setup(props) {
    const hover = ref<number | null>(null);
    return () => {
      const series: number[][] = Array.isArray(props.data[0])
        ? (props.data as number[][])
        : [props.data as number[]];
      const nSeries = series.length;
      const nCats = series.reduce((m, s) => Math.max(m, s.length), 0);
      const colorAt = (s: number) =>
        props.colors?.[s] ??
        (s === 0 && props.color ? props.color : BAR_PALETTE[s % BAR_PALETTE.length]!);
      const fmt = props.valueFormat ?? ((n: number) => niceNum(n));
      const w = props.width;
      const height = props.height;
      const catTotal = (i: number) => series.reduce((s, arr) => s + (arr[i] ?? 0), 0);
      const max =
        ((props.stacked
          ? Math.max(...Array.from({ length: nCats }, (_, i) => catTotal(i)), 0)
          : Math.max(...series.flat(), 0)) || 1) * 1.15;
      const padL = props.horizontal ? 60 : 34;
      const padB = 26;
      const padT = 10;
      const padR = 10;
      const valAxis = props.horizontal ? Math.max(10, w - padL - padR) : height - padB - padT;
      const catAxis = props.horizontal ? height - padT - padB : Math.max(10, w - padL - padR);
      const band = catAxis / nCats;
      const ticks = [0, 0.25, 0.5, 0.75, 1];
      const barRect = (cs: number, thick: number, vStart: number, vLen: number) =>
        props.horizontal
          ? {
              x: padL + (vStart / max) * valAxis,
              y: padT + cs,
              width: (vLen / max) * valAxis,
              height: thick,
            }
          : {
              x: padL + cs,
              y: padT + valAxis - ((vStart + vLen) / max) * valAxis,
              width: thick,
              height: (vLen / max) * valAxis,
            };
      const rectEl = (
        r: { x: number; y: number; width: number; height: number },
        fill: string,
        active: boolean,
      ) =>
        h('rect', {
          x: r.x,
          y: r.y,
          width: Math.max(0, r.width),
          height: Math.max(0, r.height),
          rx: '4',
          fill: active ? fill : `color-mix(in oklab, ${fill} 80%, transparent)`,
          style: { transition: 'fill .15s' },
        });
      const barEls: ReturnType<typeof h>[] = [];
      for (let i = 0; i < nCats; i++) {
        const active = hover.value === i;
        if (props.stacked) {
          let acc = 0;
          series.forEach((arr, s) => {
            const v = arr[i] ?? 0;
            barEls.push(
              rectEl(barRect(i * band + band * 0.18, band * 0.64, acc, v), colorAt(s), active),
            );
            acc += v;
          });
        } else {
          const sub = (band * 0.64) / nSeries;
          series.forEach((arr, s) => {
            const v = arr[i] ?? 0;
            barEls.push(
              rectEl(
                barRect(i * band + band * 0.18 + s * sub, sub * 0.86, 0, v),
                colorAt(s),
                active,
              ),
            );
          });
        }
      }
      const grid = ticks.map((f, i) => {
        const p = props.horizontal ? padL + f * valAxis : padT + valAxis - f * valAxis;
        return h('g', { key: 'g' + i }, [
          h('line', {
            x1: props.horizontal ? p : padL,
            x2: props.horizontal ? p : padL + catAxis,
            y1: props.horizontal ? padT : p,
            y2: props.horizontal ? padT + catAxis : p,
            stroke: 'var(--grid-line)',
          }),
          h(
            'text',
            {
              x: props.horizontal ? p : padL - 8,
              y: props.horizontal ? height - 8 : p + 3.5,
              'text-anchor': props.horizontal ? 'middle' : 'end',
              'font-size': '10',
              fill: 'var(--text-faint)',
              'font-family': 'var(--font-mono)',
            },
            fmt(Math.round(max * f)),
          ),
        ]);
      });
      const cats = Array.from({ length: nCats }, (_, i) => {
        const center = i * band + band / 2;
        return h(
          'g',
          {
            key: 'c' + i,
            onMouseenter: () => (hover.value = i),
            onMouseleave: () => (hover.value = null),
          },
          [
            h('rect', {
              x: props.horizontal ? padL : padL + i * band,
              y: props.horizontal ? padT + i * band : padT,
              width: props.horizontal ? valAxis : band,
              height: props.horizontal ? band : valAxis,
              fill: 'transparent',
            }),
            props.labels?.[i] != null
              ? h(
                  'text',
                  {
                    x: props.horizontal ? padL - 8 : padL + center,
                    y: props.horizontal ? padT + center + 3.5 : height - 8,
                    'text-anchor': props.horizontal ? 'end' : 'middle',
                    'font-size': '10',
                    fill: 'var(--text-faint)',
                    'font-family': 'var(--font-mono)',
                  },
                  props.labels[i],
                )
              : null,
          ],
        );
      });
      const svg = h('svg', { width: w, height, style: { display: 'block' } }, [
        ...grid,
        ...barEls,
        ...cats,
      ]);
      const tip =
        hover.value != null
          ? h(
              'div',
              {
                class: 'ui-chart-tip',
                style: {
                  position: 'absolute',
                  left: `${props.horizontal ? padL + 8 : padL + hover.value * band + band / 2}px`,
                  top: `${props.horizontal ? padT + hover.value * band + band / 2 : padT + 4}px`,
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'none',
                },
              },
              [
                props.labels?.[hover.value] != null
                  ? h('div', { class: 'ui-chart-tip-label' }, props.labels[hover.value])
                  : null,
                ...series.map((arr, s) =>
                  h('div', { key: s, class: 'ui-chart-tip-row' }, [
                    h('i', { style: { background: colorAt(s) } }),
                    props.seriesLabels?.[s] ? h('span', null, props.seriesLabels[s]) : null,
                    h('b', null, fmt(arr[hover.value!] ?? 0)),
                  ]),
                ),
              ],
            )
          : null;
      const legend =
        nSeries > 1 && props.seriesLabels
          ? h(
              'div',
              { class: 'ui-chart-legend' },
              props.seriesLabels.map((lb, s) =>
                h('span', { key: s }, [h('i', { style: { background: colorAt(s) } }), lb]),
              ),
            )
          : null;
      return h('div', { style: { position: 'relative' } }, [svg, tip, legend]);
    };
  },
});

/** The overlay portal target — the nearest .vsp-root, so overlays inherit theme tokens. */
export function getPortalTarget(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector<HTMLElement>('.vsp-root') ?? document.body;
}

export type DialogTone = 'pos' | 'neg' | 'warn' | 'info';
const DIALOG_TONE: Record<DialogTone, string> = {
  pos: 'var(--success)',
  neg: 'var(--danger)',
  warn: 'var(--warning)',
  info: 'var(--accent)',
};

const FOCUSABLE_SEL =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Trap Tab focus inside `nodeRef` while open; restore focus to the prior element on close. */
function useFocusTrap(isOpen: () => boolean, nodeRef: { value: HTMLElement | null }): void {
  let prev: HTMLElement | null = null;
  let cleanup: (() => void) | null = null;
  watch(isOpen, (o) => {
    if (o) {
      prev = document.activeElement as HTMLElement | null;
      nextTick(() => {
        const node = nodeRef.value;
        if (!node) return;
        const list = () =>
          Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SEL)).filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
          );
        (list()[0] ?? node).focus();
        const onKey = (e: KeyboardEvent) => {
          if (e.key !== 'Tab') return;
          const els = list();
          if (!els.length) {
            e.preventDefault();
            return;
          }
          const first = els[0]!;
          const last = els[els.length - 1]!;
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        };
        node.addEventListener('keydown', onKey);
        cleanup = () => node.removeEventListener('keydown', onKey);
      });
    } else {
      cleanup?.();
      cleanup = null;
      prev?.focus?.();
      prev = null;
    }
  });
  onBeforeUnmount(() => cleanup?.());
}

export const Dialog = defineComponent({
  name: 'VspDialog',
  props: {
    open: Boolean,
    title: { type: String, default: undefined },
    desc: { type: String, default: undefined },
    maxWidth: { type: Number, default: 460 },
    tone: { type: String as PropType<DialogTone>, default: undefined },
    closeOnOverlayClick: { type: Boolean, default: true },
    closeOnEsc: { type: Boolean, default: true },
  },
  emits: ['close'],
  setup(props, { slots, emit }) {
    const dialogRef = ref<HTMLElement | null>(null);
    const onKey = (e: KeyboardEvent) => {
      if (props.open && props.closeOnEsc && e.key === 'Escape') emit('close');
    };
    onMounted(() => window.addEventListener('keydown', onKey));
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
    useFocusTrap(() => props.open, dialogRef);
    return () => {
      if (!props.open) return null;
      const target = getPortalTarget();
      if (!target) return null;
      const color = props.tone ? DIALOG_TONE[props.tone] : 'var(--accent)';
      return h(Teleport, { to: target }, [
        h(
          'div',
          {
            class: 'ui-overlay',
            onMousedown: (e: MouseEvent) => {
              if (props.closeOnOverlayClick && e.target === e.currentTarget) emit('close');
            },
          },
          [
            h(
              'div',
              {
                ref: dialogRef,
                tabindex: -1,
                class: 'ui-dialog',
                style: { maxWidth: px(props.maxWidth) },
                role: 'dialog',
                'aria-modal': 'true',
              },
              [
                h('div', { class: 'ui-dialog-head' }, [
                  slots.icon
                    ? h(
                        'span',
                        {
                          style: {
                            width: '42px',
                            height: '42px',
                            borderRadius: 'var(--r-sm)',
                            display: 'grid',
                            placeItems: 'center',
                            marginBottom: '14px',
                            background: `color-mix(in oklab, ${color} 13%, transparent)`,
                            color,
                          },
                        },
                        slots.icon(),
                      )
                    : null,
                  h('div', { class: 'ui-dialog-title' }, props.title),
                  props.desc ? h('div', { class: 'ui-dialog-desc' }, props.desc) : null,
                ]),
                slots.default ? h('div', { class: 'ui-dialog-body' }, slots.default()) : null,
                slots.footer ? h('div', { class: 'ui-dialog-foot' }, slots.footer()) : null,
              ],
            ),
          ],
        ),
      ]);
    };
  },
});

export const Sheet = defineComponent({
  name: 'VspSheet',
  props: {
    open: Boolean,
    title: { type: String, default: undefined },
    desc: { type: String, default: undefined },
    side: { type: String as PropType<'right' | 'left' | 'top' | 'bottom'>, default: 'right' },
    closeOnOverlayClick: { type: Boolean, default: true },
    closeOnEsc: { type: Boolean, default: true },
  },
  emits: ['close'],
  setup(props, { slots, emit }) {
    const sheetRef = ref<HTMLElement | null>(null);
    const onKey = (e: KeyboardEvent) => {
      if (props.open && props.closeOnEsc && e.key === 'Escape') emit('close');
    };
    onMounted(() => window.addEventListener('keydown', onKey));
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
    useFocusTrap(() => props.open, sheetRef);
    return () => {
      if (!props.open) return null;
      const target = getPortalTarget();
      if (!target) return null;
      return h(Teleport, { to: target }, [
        h(
          'div',
          {
            class: 'ui-overlay',
            'data-sheet-side': props.side,
            onMousedown: (e: MouseEvent) => {
              if (props.closeOnOverlayClick && e.target === e.currentTarget) emit('close');
            },
          },
          [
            h(
              'div',
              {
                ref: sheetRef,
                tabindex: -1,
                class: 'ui-sheet',
                'data-side': props.side,
                role: 'dialog',
                'aria-modal': 'true',
              },
              [
                h('div', { class: 'ui-sheet-head' }, [
                  slots.icon
                    ? h(
                        'span',
                        {
                          style: {
                            width: '38px',
                            height: '38px',
                            borderRadius: 'var(--r-sm)',
                            display: 'grid',
                            placeItems: 'center',
                            background: 'color-mix(in oklab, var(--accent) 13%, transparent)',
                            color: 'var(--accent)',
                            flexShrink: 0,
                          },
                        },
                        slots.icon(),
                      )
                    : null,
                  h('div', { style: { flex: 1, minWidth: 0 } }, [
                    h(
                      'div',
                      { style: { fontSize: '16px', fontWeight: 700, letterSpacing: '-.01em' } },
                      props.title,
                    ),
                    props.desc
                      ? h(
                          'div',
                          {
                            style: {
                              fontSize: '12.5px',
                              color: 'var(--text-dim)',
                              marginTop: '3px',
                            },
                          },
                          props.desc,
                        )
                      : null,
                  ]),
                  h(
                    'button',
                    {
                      type: 'button',
                      class: 'vsp-icon-btn',
                      style: {
                        border: 0,
                        background: 'transparent',
                        width: '32px',
                        height: '32px',
                      },
                      'aria-label': 'Close',
                      onClick: () => emit('close'),
                    },
                    [svgIcon('M18 6L6 18M6 6l12 12', 16)],
                  ),
                ]),
                h('div', { class: 'ui-sheet-body vsp-scroll' }, slots.default?.()),
                slots.footer ? h('div', { class: 'ui-sheet-foot' }, slots.footer()) : null,
              ],
            ),
          ],
        ),
      ]);
    };
  },
});

export type AnchoredAlign = 'start' | 'end';

export const Anchored = defineComponent({
  name: 'VspAnchored',
  props: {
    align: { type: String as PropType<AnchoredAlign>, default: 'start' },
    width: { type: Number, default: undefined },
    layerClass: { type: String, default: 'ui-menu' },
    open: { type: Boolean, default: undefined },
  },
  emits: ['update:open', 'openChange'],
  setup(props, { slots, emit }) {
    const internalOpen = ref(false);
    const controlled = () => props.open !== undefined;
    const open = computed(() => (controlled() ? !!props.open : internalOpen.value));
    const rect = ref<DOMRect | null>(null);
    const layerSize = ref<{ w: number; h: number } | null>(null);
    const triggerRef = ref<HTMLElement | null>(null);
    const layerRef = ref<HTMLElement | null>(null);
    let cleanup: (() => void) | null = null;
    const place = () => {
      if (triggerRef.value) rect.value = triggerRef.value.getBoundingClientRect();
    };
    const measure = () => {
      if (!layerRef.value) return;
      const r = layerRef.value.getBoundingClientRect();
      layerSize.value = { w: Math.round(r.width), h: Math.round(r.height) };
    };
    const setOpen = (next: boolean) => {
      if (!controlled()) internalOpen.value = next;
      emit('update:open', next);
      emit('openChange', next);
    };
    const close = () => setOpen(false);
    const toggle = () => {
      const next = !open.value;
      setOpen(next);
      if (next) nextTick(place);
    };
    watch(open, (o) => {
      if (o) {
        place();
        nextTick(measure);
        const onDoc = (e: MouseEvent) => {
          const t = e.target as Node;
          if (!layerRef.value?.contains(t) && !triggerRef.value?.contains(t)) close();
        };
        const onEsc = (e: KeyboardEvent) => {
          if (e.key === 'Escape') close();
        };
        document.addEventListener('mousedown', onDoc);
        window.addEventListener('keydown', onEsc);
        window.addEventListener('resize', place);
        cleanup = () => {
          document.removeEventListener('mousedown', onDoc);
          window.removeEventListener('keydown', onEsc);
          window.removeEventListener('resize', place);
        };
      } else {
        cleanup?.();
        cleanup = null;
        layerSize.value = null;
      }
    });
    onBeforeUnmount(() => cleanup?.());
    return () => {
      const r = rect.value;
      const style: Record<string, string | number> = {};
      if (r) {
        const MARGIN = 8;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const lw = layerSize.value?.w ?? props.width ?? r.width;
        const lh = layerSize.value?.h ?? 0;
        let top = r.bottom + 6;
        if (lh && top + lh > vh - MARGIN && r.top - 6 - lh >= MARGIN) top = r.top - 6 - lh;
        let left = props.align === 'end' ? r.right - lw : r.left;
        left = Math.max(MARGIN, Math.min(left, vw - MARGIN - lw));
        if (lh) top = Math.max(MARGIN, Math.min(top, vh - MARGIN - lh));
        style.position = 'fixed';
        style.top = `${top}px`;
        style.left = `${left}px`;
        style.minWidth = `${props.width ?? r.width}px`;
        style.maxHeight = `calc(100vh - ${MARGIN * 2}px)`;
        style.overflowY = 'auto';
        style.zIndex = 320;
        if (!layerSize.value) style.visibility = 'hidden';
      }
      const target = open.value && r ? getPortalTarget() : null;
      return [
        h(
          'span',
          { ref: triggerRef, onClick: toggle, style: { display: 'inline-flex' } },
          slots.trigger?.(),
        ),
        target
          ? h(Teleport, { to: target }, [
              h(
                'div',
                { ref: layerRef, class: props.layerClass, style },
                slots.default?.({ close }),
              ),
            ])
          : null,
      ];
    };
  },
});

export interface MenuItem {
  label?: string;
  kbd?: string;
  /** Optional leading icon name (see `blockIcon`). */
  icon?: string;
  danger?: boolean;
  heading?: boolean;
  sep?: boolean;
  disabled?: boolean;
  /** Render as a checkable item — shows a tick and keeps the menu open on select. */
  type?: 'checkbox' | 'radio';
  checked?: boolean;
  /** Nested items — renders a submenu that flies out to the side. */
  items?: MenuItem[];
  onClick?: () => void;
}

function menuKeydown(e: KeyboardEvent): void {
  const k = e.key;
  if (k !== 'ArrowDown' && k !== 'ArrowUp' && k !== 'Home' && k !== 'End') return;
  e.preventDefault();
  const parent = (e.currentTarget as HTMLElement).parentElement;
  if (!parent) return;
  const items = Array.from(
    parent.querySelectorAll<HTMLButtonElement>(':scope > [role^="menuitem"]:not([disabled])'),
  );
  const i = items.indexOf(e.currentTarget as HTMLButtonElement);
  const n = items.length;
  const next =
    k === 'Home'
      ? items[0]
      : k === 'End'
        ? items[n - 1]
        : k === 'ArrowDown'
          ? items[(i + 1) % n]
          : items[(i - 1 + n) % n];
  next?.focus();
}

function renderMenuItems(items: MenuItem[], close: () => void): ReturnType<typeof h>[] {
  return items.map((it, i) => {
    if (it.sep) return h('div', { key: i, class: 'ui-menu-sep' });
    if (it.heading) return h('div', { key: i, class: 'ui-menu-label' }, it.label);
    if (it.items && it.items.length) return h(SubMenuItem, { key: i, item: it, onClose: close });
    const role =
      it.type === 'checkbox'
        ? 'menuitemcheckbox'
        : it.type === 'radio'
          ? 'menuitemradio'
          : 'menuitem';
    return h(
      'button',
      {
        key: i,
        type: 'button',
        role,
        disabled: it.disabled,
        'aria-checked': it.type ? !!it.checked : undefined,
        class: cx('ui-menu-item', it.danger && 'danger'),
        onClick: () => {
          it.onClick?.();
          if (!it.type) close();
        },
        onKeydown: menuKeydown,
      },
      [
        it.type
          ? h('span', { class: 'ui-menu-check' }, [
              it.checked ? svgIcon('M20 6L9 17l-5-5', 16) : null,
            ])
          : it.icon
            ? blockIcon(it.icon, 15)
            : null,
        it.label,
        it.kbd ? h('kbd', { class: 'ui-kbd' }, it.kbd) : null,
      ],
    );
  });
}

const SubMenuItem = defineComponent({
  name: 'VspSubMenuItem',
  props: {
    item: { type: Object as PropType<MenuItem>, required: true },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const open = ref(false);
    const elRef = ref<HTMLElement | null>(null);
    const rect = ref<DOMRect | null>(null);
    let timer: number | null = null;
    const cancel = () => {
      if (timer != null) {
        window.clearTimeout(timer);
        timer = null;
      }
    };
    const openNow = () => {
      cancel();
      if (elRef.value) rect.value = elRef.value.getBoundingClientRect();
      open.value = true;
    };
    const closeSoon = () => {
      cancel();
      timer = window.setTimeout(() => (open.value = false), 130);
    };
    onBeforeUnmount(cancel);
    return () => [
      h(
        'button',
        {
          ref: elRef,
          type: 'button',
          role: 'menuitem',
          'aria-haspopup': 'menu',
          'aria-expanded': open.value,
          disabled: props.item.disabled,
          class: cx('ui-menu-item', 'ui-menu-parent', props.item.danger && 'danger'),
          onMouseenter: openNow,
          onMouseleave: closeSoon,
          onClick: openNow,
          onKeydown: (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              openNow();
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              open.value = false;
            } else menuKeydown(e);
          },
        },
        [
          props.item.icon ? blockIcon(props.item.icon, 15) : null,
          props.item.label,
          svgIconClass('M9 18l6-6-6-6', 14, 'ui-menu-sub-arrow'),
        ],
      ),
      open.value && rect.value
        ? h(Teleport, { to: getPortalTarget() }, [
            h(
              'div',
              {
                class: 'ui-menu',
                role: 'menu',
                style: {
                  position: 'fixed',
                  left: `${rect.value.right - 4}px`,
                  top: `${rect.value.top - 6}px`,
                  zIndex: 340,
                },
                onMouseenter: openNow,
                onMouseleave: closeSoon,
              },
              renderMenuItems(props.item.items ?? [], () => emit('close')),
            ),
          ])
        : null,
    ];
  },
});

export const DropdownMenu = defineComponent({
  name: 'VspDropdownMenu',
  props: {
    items: { type: Array as PropType<MenuItem[]>, default: () => [] },
    align: { type: String as PropType<AnchoredAlign>, default: 'end' },
    width: { type: Number, default: undefined },
    open: { type: Boolean, default: undefined },
  },
  emits: ['update:open', 'openChange'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        Anchored,
        {
          align: props.align,
          width: props.width,
          open: props.open,
          'onUpdate:open': (v: boolean) => emit('update:open', v),
          onOpenChange: (v: boolean) => emit('openChange', v),
        },
        {
          trigger: () => slots.trigger?.(),
          default: ({ close }: { close: () => void }) => renderMenuItems(props.items, close),
        },
      );
  },
});

export const Popover = defineComponent({
  name: 'VspPopover',
  props: {
    align: { type: String as PropType<AnchoredAlign>, default: 'start' },
    width: { type: Number, default: 260 },
    open: { type: Boolean, default: undefined },
  },
  emits: ['update:open', 'openChange'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        Anchored,
        {
          align: props.align,
          width: props.width,
          layerClass: 'ui-popover',
          open: props.open,
          'onUpdate:open': (v: boolean) => emit('update:open', v),
          onOpenChange: (v: boolean) => emit('openChange', v),
        },
        { trigger: () => slots.trigger?.(), default: () => slots.default?.() },
      );
  },
});

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
const TIP_TRANSFORM: Record<TooltipSide, string> = {
  top: 'translate(-50%,-100%)',
  bottom: 'translateX(-50%)',
  left: 'translate(-100%,-50%)',
  right: 'translateY(-50%)',
};

export const Tooltip = defineComponent({
  name: 'VspTooltip',
  props: {
    label: { type: String, default: undefined },
    side: { type: String as PropType<TooltipSide>, default: 'top' },
    delay: { type: Number, default: 0 },
    disabled: Boolean,
  },
  setup(props, { slots }) {
    const show = ref(false);
    const pos = ref({ x: 0, y: 0 });
    const elRef = ref<HTMLElement | null>(null);
    let timer: number | null = null;
    const place = () => {
      const el = elRef.value;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      if (props.side === 'bottom') pos.value = { x: cx, y: r.bottom + 8 };
      else if (props.side === 'left') pos.value = { x: r.left - 8, y: cy };
      else if (props.side === 'right') pos.value = { x: r.right + 8, y: cy };
      else pos.value = { x: cx, y: r.top - 8 };
    };
    const enter = () => {
      if (props.disabled) return;
      place();
      if (props.delay > 0) timer = window.setTimeout(() => (show.value = true), props.delay);
      else show.value = true;
    };
    const leave = () => {
      if (timer != null) {
        window.clearTimeout(timer);
        timer = null;
      }
      show.value = false;
    };
    return () => {
      const target = show.value ? getPortalTarget() : null;
      return h(
        'span',
        {
          ref: elRef,
          style: { display: 'inline-flex' },
          onMouseenter: enter,
          onMouseleave: leave,
          onFocusin: enter,
          onFocusout: leave,
        },
        [
          slots.default?.(),
          target
            ? h(Teleport, { to: target }, [
                h(
                  'div',
                  {
                    class: 'ui-tip',
                    role: 'tooltip',
                    style: {
                      left: `${pos.value.x}px`,
                      top: `${pos.value.y}px`,
                      transform: TIP_TRANSFORM[props.side],
                    },
                  },
                  props.label,
                ),
              ])
            : null,
        ],
      );
    };
  },
});

export type ToastTone = 'info' | 'pos' | 'neg' | 'warn';
export interface ToastAction {
  label: string;
  onClick: () => void;
}
export type ToastPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';
export interface ToastOptions {
  title?: string;
  body?: string;
  tone?: ToastTone;
  /** Auto-dismiss after this many ms (default 3600). Pass `Infinity` to persist. */
  duration?: number;
  action?: ToastAction;
}
interface ToastItem extends ToastOptions {
  id: string;
}
const TOAST_ICON: Record<ToastTone, string> = {
  pos: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  neg: 'M18 6L6 18M6 6l12 12',
  warn: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  info: 'M12 3l1.6 5L19 9.6l-5 1.6L12 16l-1.6-4.8L5 9.6l5.4-1.6z',
};
const toastList = ref<ToastItem[]>([]);
let toastCounter = 0;

/** Show a toast. Requires a `<ToastHost />` mounted inside your `.vsp-root`. */
export function toast(opts: ToastOptions | string): void {
  const o: ToastOptions = typeof opts === 'string' ? { title: opts } : opts;
  const item: ToastItem = { id: `toast-${toastCounter++}`, tone: 'info', ...o };
  toastList.value = [...toastList.value, item];
  if (o.duration !== Infinity) {
    setTimeout(() => {
      toastList.value = toastList.value.filter((x) => x.id !== item.id);
    }, o.duration ?? 3600);
  }
}

export const ToastHost = defineComponent({
  name: 'VspToastHost',
  props: {
    position: { type: String as PropType<ToastPosition>, default: 'bottom-right' },
  },
  setup(props) {
    const dismiss = (id: string) => {
      toastList.value = toastList.value.filter((x) => x.id !== id);
    };
    return () => {
      const target = getPortalTarget();
      if (!target) return null;
      return h(Teleport, { to: target }, [
        h(
          'div',
          { class: 'ui-toast-region', 'data-position': props.position },
          toastList.value.map((t) =>
            h('div', { key: t.id, class: cx('ui-toast', t.tone), role: 'status' }, [
              svgIcon(TOAST_ICON[t.tone ?? 'info'], 18),
              h('div', { style: { flex: 1 } }, [
                h('div', { class: 'ui-toast-title' }, t.title),
                t.body ? h('div', { class: 'ui-toast-body' }, t.body) : null,
              ]),
              t.action
                ? h(
                    'button',
                    {
                      type: 'button',
                      class: 'ui-toast-action',
                      onClick: () => {
                        t.action!.onClick();
                        dismiss(t.id);
                      },
                    },
                    t.action.label,
                  )
                : null,
              h(
                'button',
                {
                  type: 'button',
                  class: 'vsp-icon-btn',
                  style: { border: 0, background: 'transparent', width: '26px', height: '26px' },
                  'aria-label': 'Dismiss',
                  onClick: () => dismiss(t.id),
                },
                [svgIcon('M18 6L6 18M6 6l12 12', 15)],
              ),
            ]),
          ),
        ),
      ]);
    };
  },
});

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

const cmdHaystack = (it: CommandItem): string =>
  [it.label, it.keywords ?? '', it.meta ?? ''].join(' ').toLowerCase();

const searchIcon = (size: number) =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    [h('circle', { cx: 11, cy: 11, r: 7 }), h('path', { d: 'm21 21-4.3-4.3' })],
  );

export const CommandPalette = defineComponent({
  name: 'VspCommandPalette',
  props: {
    open: Boolean,
    groups: { type: Array as PropType<CommandGroup[]>, default: () => [] },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const q = ref('');
    const active = ref(0);
    const inputRef = ref<HTMLInputElement | null>(null);

    const onKeydownWin = (e: KeyboardEvent) => {
      if (props.open && e.key === 'Escape') emit('close');
    };
    onMounted(() => window.addEventListener('keydown', onKeydownWin));
    onBeforeUnmount(() => window.removeEventListener('keydown', onKeydownWin));

    watch(
      () => props.open,
      (isOpen) => {
        if (!isOpen) return;
        q.value = '';
        active.value = 0;
        nextTick(() => setTimeout(() => inputRef.value?.focus(), 30));
      },
    );

    return () => {
      if (!props.open) return null;
      const target = getPortalTarget();
      if (!target) return null;

      const query = q.value.toLowerCase();
      const flat: FlatCmd[] = [];
      props.groups.forEach((g) => {
        g.items.forEach((it) => {
          if (!query || cmdHaystack(it).includes(query)) {
            flat.push({ ...it, group: g.label, idx: flat.length });
          }
        });
      });
      const groupOrder: string[] = [];
      const byGroup = new Map<string, FlatCmd[]>();
      flat.forEach((it) => {
        let bucket = byGroup.get(it.group);
        if (!bucket) {
          bucket = [];
          byGroup.set(it.group, bucket);
          groupOrder.push(it.group);
        }
        bucket.push(it);
      });

      const run = (it: FlatCmd | undefined) => {
        it?.onRun?.();
        emit('close');
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          active.value = Math.min(flat.length - 1, active.value + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          active.value = Math.max(0, active.value - 1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          run(flat[active.value]);
        }
      };

      return h(Teleport, { to: target }, [
        h(
          'div',
          {
            class: 'ui-overlay ui-cmd-wrap',
            onMousedown: (e: MouseEvent) => {
              if (e.target === e.currentTarget) emit('close');
            },
          },
          [
            h('div', { class: 'ui-cmd', role: 'dialog', 'aria-modal': 'true' }, [
              h('div', { class: 'ui-cmd-input' }, [
                searchIcon(16),
                h('input', {
                  ref: inputRef,
                  value: q.value,
                  placeholder: 'Type a command or search…',
                  onInput: (e: Event) => {
                    q.value = (e.target as HTMLInputElement).value;
                    active.value = 0;
                  },
                  onKeydown: onKey,
                }),
                h('kbd', { class: 'ui-kbd' }, 'ESC'),
              ]),
              h('div', { class: 'ui-cmd-list vsp-scroll' }, [
                flat.length === 0
                  ? h(
                      'div',
                      {
                        style: {
                          padding: '28px 12px',
                          textAlign: 'center',
                          color: 'var(--text-faint)',
                          fontSize: '13px',
                        },
                      },
                      `No results for “${q.value}”`,
                    )
                  : null,
                ...groupOrder.map((g) =>
                  h('div', { key: g }, [
                    h('div', { class: 'ui-cmd-group' }, g),
                    ...(byGroup.get(g) ?? []).map((it) =>
                      h(
                        'div',
                        {
                          key: it.idx,
                          class: cx('ui-cmd-item', it.idx === active.value && 'active'),
                          onMouseenter: () => (active.value = it.idx),
                          onClick: () => run(it),
                        },
                        [
                          it.icon ? svgIcon(it.icon, 16) : null,
                          h('span', it.label),
                          it.meta ? h('span', { class: 'ui-cmd-meta' }, it.meta) : null,
                        ],
                      ),
                    ),
                  ]),
                ),
              ]),
              h('div', { class: 'ui-cmd-foot' }, [
                h('span', { class: 'k' }, [
                  h('kbd', { class: 'ui-kbd' }, '↑'),
                  h('kbd', { class: 'ui-kbd' }, '↓'),
                  ' navigate',
                ]),
                h('span', { class: 'k' }, [h('kbd', { class: 'ui-kbd' }, '↵'), ' select']),
                h('span', { class: 'k', style: { marginLeft: 'auto' } }, 'Vespera Command'),
              ]),
            ]),
          ],
        ),
      ]);
    };
  },
});

/* ---------------- Select family (Select, Combobox, MultiSelect, TokenInput) ---------------- */

export type SelectValue = string | number;
export interface SelectOption {
  value: SelectValue;
  label: string;
  /** Optional color swatch shown before the label. */
  swatch?: string;
}
export type SelectOptionInput = SelectValue | SelectOption;

const normalizeOption = (o: SelectOptionInput): SelectOption =>
  typeof o === 'object' ? o : { value: o, label: String(o) };

const swatchSpan = (color: string) =>
  h('span', {
    style: { width: '9px', height: '9px', borderRadius: '3px', background: color, flexShrink: 0 },
  });

/** Anchored, portal-rendered floating panel that tracks its trigger on scroll/resize. */
const SelPanel = defineComponent({
  name: 'VspSelPanel',
  props: {
    open: Boolean,
    anchor: { type: Object as PropType<HTMLElement | null>, default: null },
    width: { type: Number, default: undefined },
    menuClass: { type: String, default: 'ui-menu ui-combo' },
    /** Hug the content (auto width, no padding/max-height) — used by the date pickers. */
    auto: Boolean,
  },
  emits: ['close'],
  setup(props, { slots, emit }) {
    const rect = ref<DOMRect | null>(null);
    const panelRef = ref<HTMLElement | null>(null);
    let cleanup: (() => void) | null = null;
    const place = () => {
      if (props.anchor) rect.value = props.anchor.getBoundingClientRect();
    };
    watch(
      () => props.open,
      (o) => {
        if (o) {
          nextTick(place);
          const onDoc = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!panelRef.value?.contains(t) && !props.anchor?.contains(t)) emit('close');
          };
          const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') emit('close');
          };
          document.addEventListener('mousedown', onDoc);
          window.addEventListener('keydown', onEsc);
          window.addEventListener('resize', place);
          window.addEventListener('scroll', place, true);
          cleanup = () => {
            document.removeEventListener('mousedown', onDoc);
            window.removeEventListener('keydown', onEsc);
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
          };
        } else {
          cleanup?.();
          cleanup = null;
          rect.value = null;
        }
      },
    );
    onBeforeUnmount(() => cleanup?.());
    return () => {
      if (!props.open || !rect.value) return null;
      const target = getPortalTarget();
      if (!target) return null;
      const r = rect.value;
      const maxBelow = window.innerHeight - r.bottom - 16;
      return h(Teleport, { to: target }, [
        h(
          'div',
          {
            ref: panelRef,
            class: props.menuClass,
            style: props.auto
              ? {
                  position: 'fixed',
                  top: `${r.bottom + 6}px`,
                  left: `${r.left}px`,
                  zIndex: 330,
                  padding: 0,
                  width: 'auto',
                }
              : {
                  position: 'fixed',
                  top: `${r.bottom + 6}px`,
                  left: `${r.left}px`,
                  width: `${props.width ?? r.width}px`,
                  zIndex: 330,
                  maxHeight: `${Math.max(220, maxBelow)}px`,
                },
          },
          slots.default?.(),
        ),
      ]);
    };
  },
});

/** Search box + filtered option list used inside SelPanel. */
const ComboList = defineComponent({
  name: 'VspComboList',
  props: {
    q: { type: String, default: '' },
    items: { type: Array as PropType<SelectOption[]>, default: () => [] },
    activeIdx: { type: Number, default: 0 },
    isSel: { type: Function as PropType<(o: SelectOption) => boolean>, default: () => false },
    searchPlaceholder: { type: String, default: undefined },
    loading: { type: Boolean, default: false },
    emptyText: { type: String, default: undefined },
  },
  emits: ['update:q', 'update:activeIdx', 'pick'],
  setup(props, { slots, emit }) {
    const inputRef = ref<HTMLInputElement | null>(null);
    onMounted(() => setTimeout(() => inputRef.value?.focus(), 30));
    const onKey = (e: KeyboardEvent) => {
      const items = props.items;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        emit('update:activeIdx', Math.min(items.length - 1, props.activeIdx + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        emit('update:activeIdx', Math.max(0, props.activeIdx - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const it = items[props.activeIdx];
        if (it) emit('pick', it);
      }
    };
    return () => [
      h('div', { class: 'ui-combo-search' }, [
        searchIcon(16),
        h('input', {
          ref: inputRef,
          value: props.q,
          placeholder: props.searchPlaceholder ?? 'Search…',
          onInput: (e: Event) => {
            emit('update:q', (e.target as HTMLInputElement).value);
            emit('update:activeIdx', 0);
          },
          onKeydown: onKey,
        }),
      ]),
      h('div', { class: 'ui-combo-list' }, [
        props.loading
          ? h('div', { class: 'ui-combo-loading' }, [
              h('span', { class: 'ui-spinner', 'aria-hidden': 'true' }),
              'Loading…',
            ])
          : props.items.length === 0
            ? h(
                'div',
                { class: 'ui-combo-empty' },
                props.emptyText ?? `No matches for “${props.q}”`,
              )
            : null,
        ...(props.loading
          ? []
          : props.items.map((o, i) =>
              h(
                'div',
                {
                  key: String(o.value),
                  class: cx('ui-combo-item', i === props.activeIdx && 'active'),
                  onMouseenter: () => emit('update:activeIdx', i),
                  onClick: () => emit('pick', o),
                },
                [
                  o.swatch ? swatchSpan(o.swatch) : null,
                  h('span', o.label),
                  props.isSel(o) ? svgIconClass('M20 6L9 17l-5-5', 14, 'tick') : null,
                ],
              ),
            )),
      ]),
      slots.footer?.(),
    ];
  },
});

const CHEV_DOWN = 'M6 9l6 6 6-6';

export const Select = defineComponent({
  name: 'VspSelect',
  props: {
    options: { type: Array as PropType<SelectOptionInput[]>, default: () => [] },
    modelValue: { type: [String, Number] as PropType<SelectValue>, default: undefined },
    placeholder: { type: String, default: 'Select…' },
    disabled: Boolean,
    invalid: Boolean,
    emptyText: { type: String, default: undefined },
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    searchable: { type: Boolean, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const open = ref(false);
    const q = ref('');
    const active = ref(0);
    const anchor = ref<HTMLButtonElement | null>(null);
    const internal = ref<SelectValue | undefined>(undefined);
    return () => {
      const opts = props.options.map(normalizeOption);
      const cur = props.modelValue ?? internal.value ?? opts[0]?.value;
      const sel = opts.find((o) => String(o.value) === String(cur));
      const useSearch = props.searchable ?? opts.length >= 8;
      const items = useSearch
        ? opts.filter((o) => o.label.toLowerCase().includes(q.value.toLowerCase()))
        : opts;
      const choose = (o: SelectOption) => {
        internal.value = o.value;
        emit('update:modelValue', o.value);
        emit('change', o.value);
        open.value = false;
        q.value = '';
      };
      return [
        h(
          'button',
          {
            type: 'button',
            ref: anchor,
            id: props.id,
            disabled: props.disabled,
            'aria-invalid': props.invalid || undefined,
            class: cx('ui-selectbtn', open.value && 'open', props.invalid && 'invalid'),
            onClick: () => (open.value = !open.value),
          },
          [h('span', { class: cx('val', !sel && 'ph') }, sel ? sel.label : props.placeholder)],
        ),
        props.name ? h('input', { type: 'hidden', name: props.name, value: cur ?? '' }) : null,
        h(
          SelPanel,
          { open: open.value, anchor: anchor.value, onClose: () => (open.value = false) },
          {
            default: () =>
              useSearch
                ? h(ComboList, {
                    q: q.value,
                    'onUpdate:q': (v: string) => (q.value = v),
                    items,
                    activeIdx: active.value,
                    'onUpdate:activeIdx': (v: number) => (active.value = v),
                    isSel: (o: SelectOption) => String(o.value) === String(cur),
                    emptyText: props.emptyText,
                    onPick: choose,
                  })
                : h('div', { class: 'ui-combo-list' }, [
                    items.length === 0
                      ? h('div', { class: 'ui-combo-empty' }, props.emptyText ?? 'No options')
                      : null,
                    ...items.map((o) =>
                      h(
                        'div',
                        {
                          key: String(o.value),
                          class: cx('ui-combo-item', String(o.value) === String(cur) && 'active'),
                          onClick: () => choose(o),
                        },
                        [
                          o.swatch ? swatchSpan(o.swatch) : null,
                          h('span', o.label),
                          String(o.value) === String(cur)
                            ? svgIconClass('M20 6L9 17l-5-5', 14, 'tick')
                            : null,
                        ],
                      ),
                    ),
                  ]),
          },
        ),
      ];
    };
  },
});

export const Combobox = defineComponent({
  name: 'VspCombobox',
  props: {
    options: { type: Array as PropType<SelectOptionInput[]>, default: () => [] },
    modelValue: {
      type: [String, Number] as PropType<SelectValue | null>,
      default: null,
    },
    placeholder: { type: String, default: 'Select…' },
    searchPlaceholder: { type: String, default: undefined },
    clearable: Boolean,
    disabled: Boolean,
    invalid: Boolean,
    loading: Boolean,
    emptyText: { type: String, default: undefined },
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    creatable: Boolean,
  },
  emits: ['update:modelValue', 'change', 'create'],
  setup(props, { emit }) {
    const open = ref(false);
    const q = ref('');
    const active = ref(0);
    const anchor = ref<HTMLButtonElement | null>(null);
    return () => {
      const opts = props.options.map(normalizeOption);
      const sel = opts.find((o) => o.value === props.modelValue);
      const items = opts.filter((o) => o.label.toLowerCase().includes(q.value.toLowerCase()));
      const trimmed = q.value.trim();
      const canCreate =
        props.creatable &&
        !!trimmed &&
        !opts.some((o) => o.label.toLowerCase() === trimmed.toLowerCase());
      const set = (v: SelectValue | null) => {
        emit('update:modelValue', v);
        emit('change', v);
      };
      const pick = (o: SelectOption) => {
        set(o.value);
        open.value = false;
        q.value = '';
      };
      const create = () => {
        emit('create', trimmed);
        open.value = false;
        q.value = '';
      };
      return [
        h(
          'button',
          {
            type: 'button',
            ref: anchor,
            id: props.id,
            disabled: props.disabled,
            'aria-invalid': props.invalid || undefined,
            class: cx('ui-trigger', open.value && 'open', props.invalid && 'invalid'),
            onClick: () => (open.value = !open.value),
          },
          [
            h('span', { class: cx('val', !sel && 'ph') }, sel ? sel.label : props.placeholder),
            props.clearable && sel && !props.disabled
              ? h(
                  'span',
                  {
                    style: { display: 'grid', placeItems: 'center', color: 'var(--text-faint)' },
                    onClick: (e: MouseEvent) => {
                      e.stopPropagation();
                      set(null);
                    },
                  },
                  [svgIcon('M18 6L6 18M6 6l12 12', 14)],
                )
              : null,
            svgIconClass(CHEV_DOWN, 16, 'chev'),
          ],
        ),
        props.name
          ? h('input', { type: 'hidden', name: props.name, value: props.modelValue ?? '' })
          : null,
        h(
          SelPanel,
          { open: open.value, anchor: anchor.value, onClose: () => (open.value = false) },
          {
            default: () =>
              h(
                ComboList,
                {
                  q: q.value,
                  'onUpdate:q': (v: string) => (q.value = v),
                  items,
                  activeIdx: active.value,
                  'onUpdate:activeIdx': (v: number) => (active.value = v),
                  isSel: (o: SelectOption) => o.value === props.modelValue,
                  searchPlaceholder: props.searchPlaceholder,
                  loading: props.loading,
                  emptyText: props.emptyText,
                  onPick: pick,
                },
                canCreate
                  ? {
                      footer: () =>
                        h('button', { type: 'button', class: 'ui-combo-create', onClick: create }, [
                          svgIcon('M12 5v14M5 12h14', 15),
                          `Create “${trimmed}”`,
                        ]),
                    }
                  : undefined,
              ),
          },
        ),
      ];
    };
  },
});

export const MultiSelect = defineComponent({
  name: 'VspMultiSelect',
  props: {
    options: { type: Array as PropType<SelectOptionInput[]>, default: () => [] },
    modelValue: { type: Array as PropType<SelectValue[]>, default: () => [] },
    placeholder: { type: String, default: 'Select…' },
    searchPlaceholder: { type: String, default: undefined },
    max: { type: Number, default: undefined },
    disabled: Boolean,
    invalid: Boolean,
    loading: Boolean,
    emptyText: { type: String, default: undefined },
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const open = ref(false);
    const q = ref('');
    const active = ref(0);
    const anchor = ref<HTMLElement | null>(null);
    return () => {
      const opts = props.options.map(normalizeOption);
      const value = props.modelValue;
      const items = opts.filter((o) => o.label.toLowerCase().includes(q.value.toLowerCase()));
      const has = (v: SelectValue) => value.includes(v);
      const set = (next: SelectValue[]) => {
        emit('update:modelValue', next);
        emit('change', next);
      };
      const toggle = (o: SelectOption) => {
        if (has(o.value)) set(value.filter((v) => v !== o.value));
        else if (!props.max || value.length < props.max) set([...value, o.value]);
      };
      const selOpts = opts.filter((o) => has(o.value));
      return [
        h(
          'div',
          {
            role: 'button',
            tabindex: props.disabled ? -1 : 0,
            ref: anchor,
            id: props.id,
            'aria-disabled': props.disabled || undefined,
            'aria-invalid': props.invalid || undefined,
            class: cx(
              'ui-trigger',
              open.value && 'open',
              props.invalid && 'invalid',
              props.disabled && 'disabled',
            ),
            style: { minHeight: 'var(--ctrl-h)' },
            onClick: () => !props.disabled && (open.value = !open.value),
            onKeydown: (e: KeyboardEvent) => {
              if (!props.disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                open.value = !open.value;
              }
            },
          },
          [
            selOpts.length === 0
              ? h('span', { class: 'val ph' }, props.placeholder)
              : h(
                  'span',
                  { class: 'tags' },
                  selOpts.map((o) =>
                    h(
                      'span',
                      {
                        key: String(o.value),
                        class: 'ui-tag',
                        onClick: (e: MouseEvent) => e.stopPropagation(),
                      },
                      [
                        o.label,
                        h(
                          'button',
                          {
                            type: 'button',
                            'aria-label': `Remove ${o.label}`,
                            onClick: () => set(value.filter((v) => v !== o.value)),
                          },
                          [svgIcon('M18 6L6 18M6 6l12 12', 11)],
                        ),
                      ],
                    ),
                  ),
                ),
            svgIconClass(CHEV_DOWN, 16, 'chev'),
          ],
        ),
        ...(props.name
          ? value.map((v) =>
              h('input', { key: String(v), type: 'hidden', name: props.name, value: v }),
            )
          : []),
        h(
          SelPanel,
          { open: open.value, anchor: anchor.value, onClose: () => (open.value = false) },
          {
            default: () =>
              h(
                ComboList,
                {
                  q: q.value,
                  'onUpdate:q': (v: string) => (q.value = v),
                  items,
                  activeIdx: active.value,
                  'onUpdate:activeIdx': (v: number) => (active.value = v),
                  isSel: (o: SelectOption) => has(o.value),
                  searchPlaceholder: props.searchPlaceholder,
                  loading: props.loading,
                  emptyText: props.emptyText,
                  onPick: toggle,
                },
                {
                  footer: () =>
                    h('div', { class: 'ui-combo-foot' }, [
                      h(
                        'span',
                        {
                          class: 'mono',
                          style: { fontSize: '11px', color: 'var(--text-faint)' },
                        },
                        `${value.length} selected${props.max ? ` / ${props.max}` : ''}`,
                      ),
                      h('div', { style: { flex: 1 } }),
                      value.length > 0
                        ? h(
                            'button',
                            {
                              type: 'button',
                              class: 'btn btn-subtle btn-sm',
                              onClick: () => set([]),
                            },
                            'Clear',
                          )
                        : null,
                    ]),
                },
              ),
          },
        ),
      ];
    };
  },
});

export const TokenInput = defineComponent({
  name: 'VspTokenInput',
  props: {
    modelValue: { type: Array as PropType<string[]>, default: () => [] },
    placeholder: { type: String, default: 'Type and press Enter…' },
    disabled: Boolean,
    invalid: Boolean,
    max: { type: Number, default: undefined },
    id: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const draft = ref('');
    return () => {
      const value = props.modelValue;
      const full = props.max != null && value.length >= props.max;
      const set = (next: string[]) => {
        emit('update:modelValue', next);
        emit('change', next);
      };
      const add = () => {
        const t = draft.value.trim();
        if (t && !value.includes(t) && !full) set([...value, t]);
        draft.value = '';
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          add();
        } else if (e.key === 'Backspace' && !draft.value && value.length) {
          set(value.slice(0, -1));
        }
      };
      return h(
        'div',
        {
          class: cx('ui-trigger', props.invalid && 'invalid', props.disabled && 'disabled'),
          'aria-invalid': props.invalid || undefined,
          style: {
            cursor: props.disabled ? 'not-allowed' : 'text',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px',
            paddingTop: '5px',
            paddingBottom: '5px',
          },
          onClick: (e: MouseEvent) =>
            !props.disabled && (e.currentTarget as HTMLElement).querySelector('input')?.focus(),
        },
        [
          ...value.map((t) =>
            h('span', { key: t, class: 'ui-tag', style: { maxWidth: '100%' } }, [
              h(
                'span',
                {
                  style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                },
                t,
              ),
              h(
                'button',
                {
                  type: 'button',
                  'aria-label': `Remove ${t}`,
                  onClick: () => set(value.filter((v) => v !== t)),
                },
                [svgIcon('M18 6L6 18M6 6l12 12', 11)],
              ),
            ]),
          ),
          h('input', {
            id: props.id,
            value: draft.value,
            disabled: props.disabled || full,
            placeholder: value.length ? '' : props.placeholder,
            onInput: (e: Event) => (draft.value = (e.target as HTMLInputElement).value),
            onKeydown: onKey,
            onBlur: add,
            style: {
              flex: '1 1 80px',
              minWidth: '80px',
              border: 0,
              background: 'transparent',
              outline: 'none',
              font: 'inherit',
              fontSize: '13.5px',
              color: 'var(--text)',
            },
          }),
        ],
      );
    };
  },
});

/* ---------------- FileDropzone ---------------- */

export const FileDropzone = defineComponent({
  name: 'VspFileDropzone',
  props: {
    hint: { type: String, default: 'PNG, JPG or PDF up to 10MB' },
    accept: { type: String, default: undefined },
    multiple: { type: Boolean, default: true },
    maxSize: { type: Number, default: undefined },
    maxFiles: { type: Number, default: undefined },
    disabled: Boolean,
  },
  emits: ['files', 'reject'],
  setup(props, { emit }) {
    const drag = ref(false);
    const inputRef = ref<HTMLInputElement | null>(null);
    const take = (list: FileList | null) => {
      if (!list || !list.length) return;
      let files = Array.from(list);
      const rejected: File[] = [];
      if (props.maxSize != null)
        files = files.filter((f) => {
          if (f.size > props.maxSize!) {
            rejected.push(f);
            return false;
          }
          return true;
        });
      if (props.maxFiles != null && files.length > props.maxFiles) {
        rejected.push(...files.slice(props.maxFiles));
        files = files.slice(0, props.maxFiles);
      }
      if (rejected.length) emit('reject', rejected);
      if (files.length) emit('files', files);
    };
    return () =>
      h(
        'div',
        {
          class: cx('ui-dropzone', drag.value && 'drag', props.disabled && 'disabled'),
          role: 'button',
          tabindex: props.disabled ? -1 : 0,
          'aria-disabled': props.disabled || undefined,
          onClick: () => !props.disabled && inputRef.value?.click(),
          onDragover: (e: DragEvent) => {
            if (props.disabled) return;
            e.preventDefault();
            drag.value = true;
          },
          onDragleave: () => (drag.value = false),
          onDrop: (e: DragEvent) => {
            if (props.disabled) return;
            e.preventDefault();
            drag.value = false;
            take(e.dataTransfer?.files ?? null);
          },
        },
        [
          h('span', { class: 'dz-icon' }, [
            svgIcon('M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3', 21),
          ]),
          h('div', { style: { fontWeight: 600, fontSize: '13.5px' } }, [
            'Drop files or ',
            h('span', { style: { color: 'var(--accent)' } }, 'browse'),
          ]),
          h('div', { style: { fontSize: '12px', color: 'var(--text-faint)' } }, props.hint),
          h('input', {
            ref: inputRef,
            type: 'file',
            accept: props.accept,
            multiple: props.multiple,
            hidden: true,
            onChange: (e: Event) => take((e.target as HTMLInputElement).files),
          }),
        ],
      );
  },
});

/* ---------------- Date pickers (Calendar, DatePicker, DateRangePicker) ---------------- */

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Format a date like "Jan 5, 2026". */
export const fmtDate = (d: Date | null | undefined): string =>
  d ? `${MONTHS[d.getMonth()]!.slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}` : '';

const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const nightsBetween = (a: Date, b: Date) =>
  Math.abs(Math.round((stripTime(b).getTime() - stripTime(a).getTime()) / 86400000));

/**
 * Flexible date matcher used by the pickers' `disabled` prop. Accepts a `Date`,
 * `Date[]`, `{ from, to }`, `{ before }`, `{ after }`, `{ dayOfWeek: [0,6] }`, a
 * `(date) => boolean` predicate, or an array of any of these (any match wins).
 */
export type DateMatcher =
  | Date
  | Date[]
  | { from: Date; to: Date }
  | { before: Date }
  | { after: Date }
  | { dayOfWeek: number[] }
  | ((date: Date) => boolean);

/** True when `d` satisfies the matcher (or any matcher in the array). */
export function matchesDate(d: Date, matcher?: DateMatcher | DateMatcher[]): boolean {
  if (!matcher) return false;
  if (Array.isArray(matcher)) return matcher.some((m) => matchesDate(d, m as DateMatcher));
  if (matcher instanceof Date) return sameDay(d, matcher);
  if (typeof matcher === 'function') return matcher(d);
  const x = stripTime(d);
  if ('from' in matcher && 'to' in matcher)
    return x >= stripTime(matcher.from) && x <= stripTime(matcher.to);
  if ('before' in matcher) return x < stripTime(matcher.before);
  if ('after' in matcher) return x > stripTime(matcher.after);
  if ('dayOfWeek' in matcher) return matcher.dayOfWeek.includes(d.getDay());
  return false;
}

/** A named shortcut shown in the range picker's preset rail. */
export interface RangePreset {
  label: string;
  range: DateRange;
}

interface GridDay {
  dt: Date;
  muted?: boolean;
}

function monthGrid(year: number, month: number): GridDay[] {
  const first = new Date(year, month, 1);
  const days: GridDay[] = [];
  for (let i = first.getDay(); i > 0; i--)
    days.push({ dt: new Date(year, month, 1 - i), muted: true });
  const dim = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= dim; d++) days.push({ dt: new Date(year, month, d) });
  while (days.length < 42) {
    const last = days[days.length - 1]!.dt;
    const nd = new Date(last);
    nd.setDate(nd.getDate() + 1);
    days.push({ dt: nd, muted: true });
  }
  return days;
}

export interface MonthView {
  m: number;
  y: number;
}
export type RangeEdge = 'start' | 'end' | false;
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

const calendarIcon = (size: number) =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      style: { color: 'var(--text-faint)', flexShrink: 0 },
    },
    [
      h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }),
      h('path', { d: 'M16 2v4M8 2v4M3 10h18' }),
    ],
  );

/** The month grid. Usually used via `DatePicker` / `DateRangePicker`. */
export const Calendar = defineComponent({
  name: 'VspCalendar',
  props: {
    view: { type: Object as PropType<MonthView>, required: true },
    isSelected: { type: Function as PropType<(d: Date) => boolean>, default: () => false },
    isInRange: { type: Function as PropType<(d: Date) => boolean>, default: undefined },
    isRangeEnd: { type: Function as PropType<(d: Date) => RangeEdge>, default: undefined },
    isDisabled: { type: Function as PropType<(d: Date) => boolean>, default: undefined },
    min: { type: Object as PropType<Date>, default: undefined },
    max: { type: Object as PropType<Date>, default: undefined },
  },
  emits: ['update:view', 'pick'],
  setup(props, { emit }) {
    return () => {
      const today = stripTime(new Date());
      const days = monthGrid(props.view.y, props.view.m);
      const minD = props.min ? stripTime(props.min) : null;
      const maxD = props.max ? stripTime(props.max) : null;
      const prevDisabled = !!minD && new Date(props.view.y, props.view.m, 1) <= minD;
      const nextDisabled = !!maxD && new Date(props.view.y, props.view.m + 1, 0) >= maxD;
      const dayDisabled = (dt: Date) =>
        !!props.isDisabled?.(dt) ||
        (!!minD && stripTime(dt) < minD) ||
        (!!maxD && stripTime(dt) > maxD);
      const nav = (delta: number) => {
        let m = props.view.m + delta;
        let y = props.view.y;
        if (m < 0) {
          m = 11;
          y--;
        }
        if (m > 11) {
          m = 0;
          y++;
        }
        emit('update:view', { m, y });
      };
      return h('div', { class: 'ui-cal' }, [
        h('div', { class: 'ui-cal-head' }, [
          h(
            'button',
            {
              type: 'button',
              class: 'ui-cal-nav',
              'aria-label': 'Previous month',
              disabled: prevDisabled,
              onClick: () => nav(-1),
            },
            [svgIcon('M15 18l-6-6 6-6', 16)],
          ),
          h('span', { class: 'ttl' }, `${MONTHS[props.view.m]} ${props.view.y}`),
          h(
            'button',
            {
              type: 'button',
              class: 'ui-cal-nav',
              'aria-label': 'Next month',
              disabled: nextDisabled,
              onClick: () => nav(1),
            },
            [svgIcon('M9 18l6-6-6-6', 16)],
          ),
        ]),
        h('div', { class: 'ui-cal-grid' }, [
          ...DOW.map((d) => h('div', { key: d, class: 'ui-cal-dow' }, d)),
          ...days.map(({ dt, muted }, i) => {
            const sel = props.isSelected(dt);
            const range = props.isInRange?.(dt);
            const rEdge = props.isRangeEnd?.(dt);
            const dis = dayDisabled(dt);
            return h(
              'button',
              {
                key: i,
                type: 'button',
                disabled: dis,
                class: cx(
                  'ui-cal-day',
                  muted && 'muted',
                  sameDay(dt, today) && 'today',
                  sel && 'sel',
                  range && !sel && 'inrange',
                  rEdge === 'start' && 'rstart',
                  rEdge === 'end' && 'rend',
                  dis && 'disabled',
                ),
                onClick: () => !dis && emit('pick', stripTime(dt)),
              },
              String(dt.getDate()),
            );
          }),
        ]),
      ]);
    };
  },
});

export const DatePicker = defineComponent({
  name: 'VspDatePicker',
  props: {
    modelValue: { type: Object as PropType<Date | null>, default: null },
    placeholder: { type: String, default: 'Pick a date' },
    min: { type: Object as PropType<Date>, default: undefined },
    max: { type: Object as PropType<Date>, default: undefined },
    disabled: {
      type: [Object, Array, Function] as PropType<DateMatcher | DateMatcher[]>,
      default: undefined,
    },
    multiple: { type: Boolean, default: false },
    values: { type: Array as PropType<Date[]>, default: () => [] },
  },
  emits: ['update:modelValue', 'change', 'update:values'],
  setup(props, { emit }) {
    const open = ref(false);
    const anchor = ref<HTMLButtonElement | null>(null);
    const seed =
      (props.multiple ? props.values[props.values.length - 1] : props.modelValue) ?? new Date();
    const view = ref<MonthView>({ m: seed.getMonth(), y: seed.getFullYear() });
    watch(
      () => [open.value, props.modelValue, props.values] as const,
      ([o]) => {
        const v = props.multiple ? props.values[props.values.length - 1] : props.modelValue;
        if (o && v) view.value = { m: v.getMonth(), y: v.getFullYear() };
      },
    );
    return () => {
      const list = props.values;
      const isDisabled = (d: Date) => matchesDate(d, props.disabled);
      const label = props.multiple
        ? list.length
          ? list.length === 1
            ? fmtDate(list[0])
            : `${list.length} dates`
          : props.placeholder
        : props.modelValue
          ? fmtDate(props.modelValue)
          : props.placeholder;
      const empty = props.multiple ? !list.length : !props.modelValue;
      const pick = (d: Date) => {
        if (props.multiple) {
          const exists = list.some((x) => sameDay(x, d));
          const next = exists
            ? list.filter((x) => !sameDay(x, d))
            : [...list, d].sort((a, b) => a.getTime() - b.getTime());
          emit('update:values', next);
        } else {
          emit('update:modelValue', d);
          emit('change', d);
          open.value = false;
        }
      };
      return h('div', { style: { display: 'contents' } }, [
        h(
          'button',
          {
            type: 'button',
            ref: anchor,
            class: cx('ui-trigger', open.value && 'open'),
            onClick: () => (open.value = !open.value),
          },
          [
            calendarIcon(16),
            h('span', { class: cx('val', empty && 'ph') }, label),
            svgIconClass(CHEV_DOWN, 16, 'chev'),
          ],
        ),
        h(
          SelPanel,
          {
            open: open.value,
            anchor: anchor.value,
            auto: true,
            menuClass: 'ui-menu',
            onClose: () => (open.value = false),
          },
          {
            default: () => {
              const cal = h(Calendar, {
                view: view.value,
                min: props.min,
                max: props.max,
                isDisabled,
                'onUpdate:view': (v: MonthView) => (view.value = v),
                isSelected: (d: Date) =>
                  props.multiple ? list.some((x) => sameDay(x, d)) : sameDay(d, props.modelValue),
                onPick: pick,
              });
              if (!props.multiple) return cal;
              return [
                cal,
                h('div', { class: 'ui-combo-foot' }, [
                  h(
                    'span',
                    { class: 'mono', style: { fontSize: '11px', color: 'var(--text-faint)' } },
                    list.length ? `${list.length} selected` : 'Select dates',
                  ),
                  h('div', { style: { flex: 1 } }),
                  h(
                    'button',
                    {
                      type: 'button',
                      class: 'btn btn-subtle btn-sm',
                      onClick: () => emit('update:values', []),
                    },
                    'Clear',
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      class: 'btn btn-primary btn-sm',
                      onClick: () => (open.value = false),
                    },
                    'Done',
                  ),
                ]),
              ];
            },
          },
        ),
      ]);
    };
  },
});

export const DateRangePicker = defineComponent({
  name: 'VspDateRangePicker',
  props: {
    modelValue: {
      type: Object as PropType<DateRange>,
      default: () => ({ start: null, end: null }),
    },
    placeholder: { type: String, default: 'Pick a range' },
    min: { type: Object as PropType<Date>, default: undefined },
    max: { type: Object as PropType<Date>, default: undefined },
    disabled: {
      type: [Object, Array, Function] as PropType<DateMatcher | DateMatcher[]>,
      default: undefined,
    },
    minNights: { type: Number, default: undefined },
    maxNights: { type: Number, default: undefined },
    presets: { type: Array as PropType<RangePreset[]>, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const open = ref(false);
    const anchor = ref<HTMLButtonElement | null>(null);
    const base = props.modelValue.start ?? new Date();
    const view = ref<MonthView>({ m: base.getMonth(), y: base.getFullYear() });
    return () => {
      const value = props.modelValue;
      const set = (r: DateRange) => {
        emit('update:modelValue', r);
        emit('change', r);
      };
      const pick = (d: Date) => {
        if (!value.start || value.end) set({ start: d, end: null });
        else if (d < value.start) set({ start: d, end: value.start });
        else set({ start: value.start, end: d });
      };
      const inRange = (d: Date) => !!value.start && !!value.end && d > value.start && d < value.end;
      const rangeEnd = (d: Date): RangeEdge => {
        if (sameDay(d, value.start) && value.end) return 'start';
        if (sameDay(d, value.end)) return 'end';
        return false;
      };
      const isDisabled = (d: Date) => {
        if (matchesDate(d, props.disabled)) return true;
        if (value.start && !value.end && !sameDay(d, value.start)) {
          const n = nightsBetween(value.start, d);
          if (props.minNights != null && n < props.minNights) return true;
          if (props.maxNights != null && n > props.maxNights) return true;
        }
        return false;
      };
      const label = value.start
        ? value.end
          ? `${fmtDate(value.start)} – ${fmtDate(value.end)}`
          : `${fmtDate(value.start)} – …`
        : props.placeholder;
      return h('div', { style: { display: 'contents' } }, [
        h(
          'button',
          {
            type: 'button',
            ref: anchor,
            class: cx('ui-trigger', open.value && 'open'),
            onClick: () => (open.value = !open.value),
          },
          [
            calendarIcon(16),
            h('span', { class: cx('val', !value.start && 'ph') }, label),
            svgIconClass(CHEV_DOWN, 16, 'chev'),
          ],
        ),
        h(
          SelPanel,
          {
            open: open.value,
            anchor: anchor.value,
            auto: true,
            menuClass: 'ui-menu',
            onClose: () => (open.value = false),
          },
          {
            default: () => [
              h('div', { class: 'ui-cal-wrap' }, [
                props.presets?.length
                  ? h(
                      'div',
                      { class: 'ui-cal-presets' },
                      props.presets.map((p) =>
                        h(
                          'button',
                          {
                            key: p.label,
                            type: 'button',
                            class: cx(
                              'ui-cal-preset',
                              sameDay(p.range.start, value.start) &&
                                sameDay(p.range.end, value.end) &&
                                'on',
                            ),
                            onClick: () => set(p.range),
                          },
                          p.label,
                        ),
                      ),
                    )
                  : null,
                h(Calendar, {
                  view: view.value,
                  min: props.min,
                  max: props.max,
                  isDisabled,
                  'onUpdate:view': (v: MonthView) => (view.value = v),
                  isSelected: (d: Date) => sameDay(d, value.start) || sameDay(d, value.end),
                  isInRange: inRange,
                  isRangeEnd: rangeEnd,
                  onPick: pick,
                }),
              ]),
              h('div', { class: 'ui-combo-foot' }, [
                h(
                  'span',
                  { class: 'mono', style: { fontSize: '11px', color: 'var(--text-faint)' } },
                  value.start && value.end
                    ? `${nightsBetween(value.start, value.end) + 1} days`
                    : 'Select start & end',
                ),
                h('div', { style: { flex: 1 } }),
                h(
                  'button',
                  {
                    type: 'button',
                    class: 'btn btn-subtle btn-sm',
                    onClick: () => set({ start: null, end: null }),
                  },
                  'Clear',
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    class: 'btn btn-primary btn-sm',
                    onClick: () => (open.value = false),
                  },
                  'Done',
                ),
              ]),
            ],
          },
        ),
      ]);
    };
  },
});

/* ---------------- EventCalendar ---------------- */

const DOW_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export type EventTone = 'info' | 'success' | 'warning' | 'danger' | 'violet';

const EVENT_TONE: Record<EventTone, string> = {
  info: 'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  violet: 'var(--accent-2)',
};

const TONE_OPTIONS = [
  { value: 'info', label: 'Blue' },
  { value: 'success', label: 'Green' },
  { value: 'warning', label: 'Amber' },
  { value: 'danger', label: 'Red' },
  { value: 'violet', label: 'Violet' },
];

export interface CalendarEvent {
  id?: string;
  /** Day of the month (1–31). */
  d: number;
  title: string;
  tone: EventTone;
  /** Display time, e.g. `"10:00"` or `"All day"`. */
  time: string;
  /** Hour (8–18) used to place the event in the week grid. */
  hour?: number;
}
type InternalEvent = Required<Pick<CalendarEvent, 'id' | 'hour'>> & CalendarEvent;
interface Draft {
  days: number[];
  hour: number;
  title: string;
  tone: EventTone;
  time: string;
}

const DEFAULT_EVENTS: CalendarEvent[] = [
  { d: 2, title: 'Q2 board review', tone: 'info', time: '10:00' },
  { d: 5, title: 'Northwind renewal', tone: 'success', time: '09:30' },
  { d: 5, title: 'Webhook deploy', tone: 'warning', time: '14:00' },
  { d: 9, title: 'Payment retry · Cobalt', tone: 'danger', time: '08:00' },
  { d: 12, title: 'Onboarding · Halcyon', tone: 'violet', time: '11:00' },
  { d: 12, title: 'Team sync', tone: 'info', time: '15:30' },
  { d: 12, title: 'Invoice run', tone: 'success', time: '17:00' },
  { d: 18, title: 'Security audit', tone: 'warning', time: '13:00' },
  { d: 21, title: 'Expansion call · Vertex', tone: 'success', time: '10:30' },
  { d: 24, title: 'Quarterly close', tone: 'info', time: 'All day' },
  { d: 24, title: 'Roadmap review', tone: 'violet', time: '16:00' },
  { d: 28, title: 'SLA report due', tone: 'danger', time: '12:00' },
];

type View = 'month' | 'week' | 'agenda';

/**
 * A month / week / agenda calendar with click-and-drag day selection and an
 * inline "new event" dialog. Events are kept in local state; the `change` event
 * reports every change so a host can persist them.
 */
export const EventCalendar = defineComponent({
  name: 'VspEventCalendar',
  props: {
    initialEvents: { type: Array as PropType<CalendarEvent[]>, default: () => DEFAULT_EVENTS },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const today = new Date();
    const view = ref<View>('month');
    const vm = ref({ m: today.getMonth(), y: today.getFullYear() });
    const events = ref<InternalEvent[]>(
      props.initialEvents.map((e, i) => ({ id: `e${i}`, hour: 9, ...e })),
    );
    const sel = ref<{ a: number; b: number } | null>(null);
    let dragging = false;
    const add = ref<Draft | null>(null);

    const commit = (next: InternalEvent[]) => {
      events.value = next;
      emit('change', next);
    };
    const nav = (delta: number) => {
      let m = vm.value.m + delta;
      let y = vm.value.y;
      if (m < 0) {
        m = 11;
        y--;
      }
      if (m > 11) {
        m = 0;
        y++;
      }
      vm.value = { m, y };
    };
    const openAdd = (days: number[], hour?: number) => {
      add.value = {
        days,
        hour: hour ?? 9,
        title: '',
        tone: 'info',
        time: hour != null ? `${String(hour).padStart(2, '0')}:00` : '10:00',
      };
    };
    const saveAdd = () => {
      const a = add.value;
      if (!a) return;
      if (!a.title.trim()) {
        add.value = null;
        return;
      }
      const stamp = Date.now();
      commit([
        ...events.value,
        ...a.days.map((d, i) => ({
          id: `n${stamp}${i}`,
          d,
          hour: a.hour,
          title: a.title,
          tone: a.tone,
          time: a.time,
        })),
      ]);
      add.value = null;
      toast({
        tone: 'pos',
        title: a.days.length > 1 ? `${a.days.length} events added` : 'Event added',
      });
    };
    const cap = (v: View) => v[0]!.toUpperCase() + v.slice(1);

    return () => {
      const evByDay: Record<number, InternalEvent[]> = {};
      events.value.forEach((e) => {
        (evByDay[e.d] = evByDay[e.d] || []).push(e);
      });
      const first = new Date(vm.value.y, vm.value.m, 1).getDay();
      const dim = new Date(vm.value.y, vm.value.m + 1, 0).getDate();
      const prevDim = new Date(vm.value.y, vm.value.m, 0).getDate();
      const cells: { day: number; muted?: boolean }[] = [];
      for (let i = first - 1; i >= 0; i--) cells.push({ day: prevDim - i, muted: true });
      for (let d = 1; d <= dim; d++) cells.push({ day: d });
      while (cells.length % 7) cells.push({ day: cells.length - (first + dim) + 1, muted: true });

      const isToday = (d: number, muted?: boolean) =>
        !muted &&
        d === today.getDate() &&
        vm.value.m === today.getMonth() &&
        vm.value.y === today.getFullYear();
      const inSel = (d: number) =>
        sel.value &&
        d >= Math.min(sel.value.a, sel.value.b) &&
        d <= Math.max(sel.value.a, sel.value.b);

      const HOURS: number[] = [];
      for (let h = 8; h <= 18; h++) HOURS.push(h);
      const weekDays: Date[] = [];
      const d0 = new Date(vm.value.y, vm.value.m, today.getDate() - today.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(d0);
        d.setDate(d0.getDate() + i);
        weekDays.push(d);
      }

      const head = h('div', { class: 'ui-cb-head' }, [
        h('div', { style: { display: 'flex', gap: '4px' } }, [
          h(
            'button',
            {
              type: 'button',
              class: 'vsp-icon-btn',
              style: { width: '32px', height: '32px' },
              'aria-label': 'Previous month',
              onClick: () => nav(-1),
            },
            [svgIcon('M15 18l-6-6 6-6', 18)],
          ),
          h(
            'button',
            {
              type: 'button',
              class: 'vsp-icon-btn',
              style: { width: '32px', height: '32px' },
              'aria-label': 'Next month',
              onClick: () => nav(1),
            },
            [svgIcon('M9 18l6-6-6-6', 18)],
          ),
        ]),
        h('div', { class: 'ui-cb-title' }, `${MONTHS[vm.value.m]} ${vm.value.y}`),
        h(
          'button',
          {
            type: 'button',
            class: 'btn btn-ghost btn-sm',
            onClick: () => (vm.value = { m: today.getMonth(), y: today.getFullYear() }),
          },
          'Today',
        ),
        h('div', { style: { flex: 1 } }),
        h(Segmented, {
          options: ['Month', 'Week', 'Agenda'],
          modelValue: cap(view.value),
          'onUpdate:modelValue': (v: string) => (view.value = v.toLowerCase() as View),
        }),
        h(
          'button',
          {
            type: 'button',
            class: 'btn btn-primary btn-sm',
            onClick: () => openAdd([today.getDate()]),
          },
          [svgIcon('M12 5v14M5 12h14', 16), 'Event'],
        ),
      ]);

      const monthView = [
        h(
          'div',
          { class: 'ui-cb-grid' },
          DOW_FULL.map((d) => h('div', { key: d, class: 'ui-cb-dow' }, d)),
        ),
        h(
          'div',
          {
            class: 'ui-cb-grid',
            onMouseleave: () => {
              if (!dragging) sel.value = null;
            },
          },
          cells.map((c, i) => {
            const evs = c.muted ? [] : evByDay[c.day] || [];
            return h(
              'div',
              {
                key: i,
                class: cx('ui-cb-cell', c.muted && 'muted', !c.muted && inSel(c.day) && 'sel'),
                style: i >= cells.length - 7 ? { borderBottom: 0 } : undefined,
                onMousedown: () => {
                  if (!c.muted) {
                    dragging = true;
                    sel.value = { a: c.day, b: c.day };
                  }
                },
                onMouseenter: () => {
                  if (dragging && !c.muted)
                    sel.value = sel.value ? { a: sel.value.a, b: c.day } : sel.value;
                },
                onMouseup: () => {
                  if (dragging && sel.value) {
                    dragging = false;
                    const lo = Math.min(sel.value.a, c.day);
                    const hi = Math.max(sel.value.a, c.day);
                    const days: number[] = [];
                    for (let d = lo; d <= hi; d++) days.push(d);
                    openAdd(days);
                    sel.value = null;
                  }
                },
              },
              [
                h(
                  'span',
                  { class: cx('ui-cb-date', isToday(c.day, c.muted) && 'today') },
                  String(c.day),
                ),
                ...evs.slice(0, 3).map((e, j) =>
                  h(
                    'div',
                    {
                      key: j,
                      class: 'ui-cb-event',
                      style: {
                        color: EVENT_TONE[e.tone],
                        background: `color-mix(in oklab, ${EVENT_TONE[e.tone]} 14%, transparent)`,
                      },
                    },
                    [h('i'), e.title],
                  ),
                ),
                evs.length > 3
                  ? h('span', { class: 'ui-cb-more' }, `+${evs.length - 3} more`)
                  : null,
              ],
            );
          }),
        ),
      ];

      const weekView = h(
        'div',
        { class: 'ui-cb-week', style: { maxHeight: '420px', overflowY: 'auto' } },
        [
          h('div', { class: 'ui-cb-wk-corner' }),
          ...weekDays.map((d, i) =>
            h('div', { key: `dh${i}`, class: 'ui-cb-wk-dh' }, [
              h('div', { class: 'eyebrow' }, DOW_FULL[d.getDay()]),
              h(
                'div',
                {
                  style: {
                    fontWeight: 700,
                    fontSize: '15px',
                    color: d.getDate() === today.getDate() ? 'var(--accent)' : 'var(--text)',
                  },
                },
                String(d.getDate()),
              ),
            ]),
          ),
          ...HOURS.flatMap((hr) => [
            h('div', { key: `hr${hr}`, class: 'ui-cb-wk-hr' }, `${String(hr).padStart(2, '0')}:00`),
            ...weekDays.map((d, i) => {
              const appt = events.value.find(
                (e) => e.d === d.getDate() && e.hour === hr && d.getMonth() === vm.value.m,
              );
              return h(
                'div',
                {
                  key: `slot${hr}-${i}`,
                  class: 'ui-cb-slot',
                  onClick: () => !appt && openAdd([d.getDate()], hr),
                },
                appt
                  ? [
                      h(
                        'div',
                        {
                          class: 'ui-cb-appt',
                          style: {
                            color: EVENT_TONE[appt.tone],
                            background: `color-mix(in oklab, ${EVENT_TONE[appt.tone]} 18%, transparent)`,
                          },
                        },
                        appt.title,
                      ),
                    ]
                  : undefined,
              );
            }),
          ]),
        ],
      );

      const agendaView = h(
        'div',
        {},
        Object.keys(evByDay)
          .map(Number)
          .sort((a, b) => a - b)
          .map((day) =>
            h('div', { key: day, class: 'ui-cb-agenda-day' }, [
              h('div', { style: { width: '56px', flexShrink: 0, textAlign: 'center' } }, [
                h(
                  'div',
                  { class: 'eyebrow' },
                  DOW_FULL[new Date(vm.value.y, vm.value.m, day).getDay()],
                ),
                h(
                  'div',
                  { class: 'tnum', style: { fontSize: '22px', fontWeight: 800, lineHeight: 1.1 } },
                  String(day),
                ),
              ]),
              h(
                'div',
                { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' } },
                evByDay[day]!.slice()
                  .sort((a, b) => a.hour - b.hour)
                  .map((e, j) =>
                    h(
                      'div',
                      { key: j, style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                      [
                        h('span', {
                          style: {
                            width: '8px',
                            height: '8px',
                            borderRadius: '99px',
                            background: EVENT_TONE[e.tone],
                            flexShrink: 0,
                          },
                        }),
                        h('span', { style: { fontWeight: 600, fontSize: '13.5px' } }, e.title),
                        h(
                          'span',
                          {
                            class: 'mono',
                            style: {
                              marginLeft: 'auto',
                              fontSize: '11.5px',
                              color: 'var(--text-faint)',
                            },
                          },
                          e.time,
                        ),
                      ],
                    ),
                  ),
              ),
            ]),
          ),
      );

      const a = add.value;
      const dialog = h(
        Dialog,
        {
          open: !!a,
          maxWidth: 420,
          title: a && a.days.length > 1 ? `New event · ${a.days.length} days` : 'New event',
          desc: a
            ? `${MONTHS[vm.value.m]} ${a.days[0]}${
                a.days.length > 1 ? `–${a.days[a.days.length - 1]}` : ''
              }, ${vm.value.y}`
            : '',
          onClose: () => (add.value = null),
        },
        {
          icon: () => calendarIcon(20),
          footer: () => [
            h(
              Button,
              { variant: 'ghost', size: 'sm', onClick: () => (add.value = null) },
              () => 'Cancel',
            ),
            h(Button, { variant: 'primary', size: 'sm', onClick: saveAdd }, () => 'Add event'),
          ],
          default: () =>
            a
              ? h('div', { style: { display: 'grid', gap: '14px' } }, [
                  h(Field, { label: 'Title', required: true }, () =>
                    h(Input, {
                      modelValue: a.title,
                      placeholder: 'Meeting, review, booking…',
                      'onUpdate:modelValue': (v: string) => {
                        if (add.value) add.value = { ...add.value, title: v };
                      },
                    }),
                  ),
                  h(
                    'div',
                    { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
                    [
                      h(Field, { label: 'Time' }, () =>
                        h(Input, {
                          modelValue: a.time,
                          'onUpdate:modelValue': (v: string) => {
                            if (add.value) add.value = { ...add.value, time: v };
                          },
                        }),
                      ),
                      h(Field, { label: 'Color' }, () =>
                        h(Select, {
                          modelValue: a.tone,
                          options: TONE_OPTIONS,
                          'onUpdate:modelValue': (v: SelectValue) => {
                            if (add.value) add.value = { ...add.value, tone: v as EventTone };
                          },
                        }),
                      ),
                    ],
                  ),
                ])
              : null,
        },
      );

      return h('div', { class: 'ui-cb' }, [
        head,
        view.value === 'month' ? monthView : null,
        view.value === 'week' ? weekView : null,
        view.value === 'agenda' ? agendaView : null,
        dialog,
      ]);
    };
  },
});

/* ---------------- Blocks ---------------- */

type IconChild = ReturnType<typeof h>;
const BLOCK_ICONS: Record<string, () => IconChild[]> = {
  plus: () => [h('path', { d: 'M12 5v14M5 12h14' })],
  check: () => [h('path', { d: 'm20 6-11 11-5-5' })],
  x: () => [h('path', { d: 'M6 6l12 12M18 6 6 18' })],
  filter: () => [h('path', { d: 'M3 5h18l-7 8v6l-4-2v-4z' })],
  bolt: () => [h('path', { d: 'M13 2 4 14h7l-1 8 9-12h-7z' })],
  shield: () => [h('path', { d: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z' })],
  arrowUp: () => [h('path', { d: 'M12 19V5M6 11l6-6 6 6' })],
  more: () => [
    h('circle', { cx: 5, cy: 12, r: 1.4 }),
    h('circle', { cx: 12, cy: 12, r: 1.4 }),
    h('circle', { cx: 19, cy: 12, r: 1.4 }),
  ],
  download: () => [h('path', { d: 'M12 4v11M7 11l5 5 5-5' }), h('path', { d: 'M5 20h14' })],
  eye: () => [
    h('path', { d: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z' }),
    h('circle', { cx: 12, cy: 12, r: 3 }),
  ],
  refresh: () => [h('path', { d: 'M21 12a9 9 0 1 1-2.6-6.4' }), h('path', { d: 'M21 4v5h-5' })],
  doc: () => [
    h('path', { d: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z' }),
    h('path', { d: 'M14 3v5h5M9 13h6M9 17h6' }),
  ],
  mail: () => [
    h('rect', { x: 3, y: 5, width: 18, height: 14, rx: 2 }),
    h('path', { d: 'm3 7 9 6 9-6' }),
  ],
  users: () => [
    h('circle', { cx: 9, cy: 8, r: 3 }),
    h('path', { d: 'M3 20a6 6 0 0 1 12 0' }),
    h('path', { d: 'M16 5.2a3 3 0 0 1 0 5.6M21 20a6 6 0 0 0-4-5.6' }),
  ],
  bell: () => [
    h('path', { d: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9' }),
    h('path', { d: 'M13.7 21a2 2 0 0 1-3.4 0' }),
  ],
  clock: () => [h('circle', { cx: 12, cy: 12, r: 9 }), h('path', { d: 'M12 7v5l3 2' })],
  inbox: () => [
    h('path', { d: 'M22 12h-6l-2 3h-4l-2-3H2' }),
    h('path', {
      d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
    }),
  ],
  settings: () => [
    h('circle', { cx: 12, cy: 12, r: 3 }),
    h('path', {
      d: 'M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1H2a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 3.6 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H8a1.7 1.7 0 0 0 1-1.56V2a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V8a1.7 1.7 0 0 0 1.56 1H22a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z',
    }),
  ],
};

/** Inline icon by name (the Vue wrapper stays free of the icons package). */
export const blockIcon = (name: string, size = 16) =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    BLOCK_ICONS[name]?.() ?? [],
  );

/** A titled section wrapping its content in a Vespera `card`. */
export const Block = defineComponent({
  name: 'VspBlock',
  props: {
    title: { type: String, default: undefined },
    desc: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h('div', {}, [
        props.title
          ? h('div', { style: { marginBottom: '12px' } }, [
              h(
                'div',
                { style: { fontSize: '16px', fontWeight: 700, letterSpacing: '-.01em' } },
                props.title,
              ),
              props.desc
                ? h(
                    'div',
                    { style: { fontSize: '13px', marginTop: '3px', color: 'var(--text-dim)' } },
                    props.desc,
                  )
                : null,
            ])
          : null,
        h('div', { class: 'card' }, slots.default?.()),
      ]);
  },
});

const blockBarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '11px 14px',
  borderBottom: '1px solid var(--border)',
};

/** A stack of shimmer rows shown while a block's data is loading. */
const blockSkeleton = (rows = 4) =>
  h(
    'div',
    { style: { padding: '14px', display: 'grid', gap: '16px' } },
    Array.from({ length: rows }).map((_, i) =>
      h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
        h(Skeleton, { w: 32, h: 32, r: 9 }),
        h(Skeleton, { w: `${30 + ((i * 13) % 35)}%`, h: 12 }),
        h('div', { style: { flex: 1 } }),
        h(Skeleton, { w: 68, h: 12 }),
      ]),
    ),
  );

/** Default empty placeholder; overridden wholesale when `emptyState` is given. */
const blockEmpty = (title: string, desc?: string) =>
  h('div', { class: 'ui-empty' }, [
    blockIcon('inbox', 26),
    h('div', { class: 'ui-empty-title' }, title),
    desc ? h('div', { class: 'ui-empty-desc' }, desc) : null,
  ]);

export type ServiceStatus = 'operational' | 'degraded' | 'maintenance' | 'down';
export interface Service {
  name: string;
  status: ServiceStatus;
  uptime: number;
}
const STATUS_TONE: Record<ServiceStatus, BadgeTone> = {
  operational: 'pos',
  degraded: 'warn',
  maintenance: 'info',
  down: 'neg',
};
const DEFAULT_SERVICES: Service[] = [
  { name: 'API gateway', status: 'operational', uptime: 99.98 },
  { name: 'Database', status: 'operational', uptime: 99.95 },
  { name: 'Webhooks', status: 'degraded', uptime: 98.2 },
  { name: 'Auth service', status: 'operational', uptime: 100 },
  { name: 'Billing', status: 'maintenance', uptime: 99.8 },
];

/** Live service health with 30-day uptime bars. */
export const SystemStatusBlock = defineComponent({
  name: 'VspSystemStatusBlock',
  props: {
    services: { type: Array as PropType<Service[]>, default: () => DEFAULT_SERVICES },
    loading: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => {
      const allOk = props.services.every((s) => s.status === 'operational');
      const accent = allOk ? 'var(--success)' : 'var(--warning)';
      return h(
        Block,
        { title: 'System status', desc: 'Live service health with 30-day uptime bars.' },
        () => [
          h('div', { style: blockBarStyle }, [
            h('span', {
              style: {
                width: '8px',
                height: '8px',
                borderRadius: '99px',
                background: accent,
                boxShadow: `0 0 8px ${accent}`,
              },
            }),
            h(
              'b',
              { style: { fontSize: '13.5px' } },
              allOk ? 'All systems operational' : 'Partial degradation',
            ),
            h('div', { style: { flex: 1 } }),
            h('span', { class: 'eyebrow' }, 'Updated 30s ago'),
          ]),
          props.loading
            ? blockSkeleton()
            : props.services.length === 0
              ? (slots.empty?.() ?? blockEmpty('No services', 'No monitored services yet.'))
              : h(
                  'div',
                  { style: { padding: '14px', paddingTop: '4px', paddingBottom: '8px' } },
                  props.services.map((s) =>
                    h('div', { key: s.name, class: 'ui-row', style: { alignItems: 'center' } }, [
                      h('div', { style: { width: '150px', flexShrink: 0 } }, [
                        h('div', { style: { fontWeight: 600, fontSize: '13.5px' } }, s.name),
                      ]),
                      h(
                        'div',
                        {
                          style: {
                            flex: 1,
                            display: 'flex',
                            gap: '2px',
                            alignItems: 'flex-end',
                            height: '26px',
                          },
                        },
                        Array.from({ length: 44 }).map((_, i) => {
                          const bad =
                            (s.status === 'degraded' && i > 38 && i < 42) ||
                            (s.status === 'maintenance' && i === 43);
                          return h('span', {
                            key: i,
                            style: {
                              flex: 1,
                              height: bad ? '60%' : '100%',
                              borderRadius: '2px',
                              background: bad
                                ? s.status === 'degraded'
                                  ? 'var(--warning)'
                                  : 'var(--accent)'
                                : 'color-mix(in oklab, var(--success) 70%, transparent)',
                            },
                          });
                        }),
                      ),
                      h(
                        'span',
                        {
                          class: 'mono tnum',
                          style: {
                            width: '56px',
                            textAlign: 'right',
                            fontSize: '12px',
                            color: 'var(--text-dim)',
                          },
                        },
                        `${s.uptime}%`,
                      ),
                      h(Badge, { tone: STATUS_TONE[s.status], dot: true }, () => s.status),
                    ]),
                  ),
                ),
        ],
      );
    };
  },
});

export interface AuditEntry {
  who: string;
  action: string;
  tag: string;
  time: string;
  /** Icon name (see `blockIcon`). */
  icon: string;
}
const DEFAULT_AUDIT: AuditEntry[] = [
  {
    who: 'Avery Quinn',
    action: 'updated billing settings',
    tag: 'Settings',
    time: '2 min ago',
    icon: 'settings',
  },
  {
    who: 'Maya Okafor',
    action: 'upgraded to Enterprise',
    tag: 'Billing',
    time: '38 min ago',
    icon: 'arrowUp',
  },
  {
    who: 'System',
    action: 'rotated production API key',
    tag: 'Security',
    time: '1 hr ago',
    icon: 'shield',
  },
  { who: 'Leo Vega', action: 'invited 4 members', tag: 'Team', time: '3 hr ago', icon: 'users' },
  {
    who: 'Billing',
    action: 'flagged failed payment · Cobalt',
    tag: 'Billing',
    time: '5 hr ago',
    icon: 'bell',
  },
];

/** A chronological trail of privileged actions, as a timeline. */
export const AuditLogBlock = defineComponent({
  name: 'VspAuditLogBlock',
  props: {
    entries: { type: Array as PropType<AuditEntry[]>, default: () => DEFAULT_AUDIT },
    loading: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () =>
      h(
        Block,
        { title: 'Audit log', desc: 'A chronological trail of every privileged action.' },
        () => [
          h('div', { style: blockBarStyle }, [
            blockIcon('clock', 17),
            h('b', { style: { fontSize: '13.5px' } }, 'Recent activity'),
            h('div', { style: { flex: 1 } }),
            h('button', { type: 'button', class: 'btn btn-ghost btn-sm' }, [
              blockIcon('download', 15),
              'Export log',
            ]),
          ]),
          props.loading
            ? blockSkeleton()
            : props.entries.length === 0
              ? (slots.empty?.() ?? blockEmpty('No activity', 'Privileged actions will show here.'))
              : h('div', { style: { padding: '14px' } }, [
                  h(
                    'div',
                    { style: { position: 'relative', paddingLeft: '8px' } },
                    props.entries.map((e, i) =>
                      h(
                        'div',
                        {
                          key: i,
                          style: {
                            display: 'flex',
                            gap: '14px',
                            paddingBottom: i < props.entries.length - 1 ? '20px' : '0',
                            position: 'relative',
                          },
                        },
                        [
                          i < props.entries.length - 1
                            ? h('span', {
                                style: {
                                  position: 'absolute',
                                  left: '15px',
                                  top: '32px',
                                  bottom: 0,
                                  width: '1.5px',
                                  background: 'var(--border)',
                                },
                              })
                            : null,
                          h(
                            'span',
                            {
                              style: {
                                width: '32px',
                                height: '32px',
                                borderRadius: '9px',
                                flexShrink: 0,
                                display: 'grid',
                                placeItems: 'center',
                                background: 'var(--surface-3)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-dim)',
                                zIndex: 1,
                              },
                            },
                            [blockIcon(e.icon, 16)],
                          ),
                          h('div', { style: { flex: 1, paddingTop: '5px' } }, [
                            h('div', { style: { fontSize: '13.5px' } }, [
                              h('b', { style: { fontWeight: 700 } }, e.who),
                              ' ',
                              h('span', { style: { color: 'var(--text-dim)' } }, e.action),
                            ]),
                            h(
                              'div',
                              {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginTop: '5px',
                                },
                              },
                              [
                                h(Badge, { tone: 'muted' }, () => e.tag),
                                h('span', { class: 'eyebrow' }, e.time),
                              ],
                            ),
                          ]),
                        ],
                      ),
                    ),
                  ),
                ]),
        ],
      );
  },
});

/* ===================== Orders ===================== */

export type OrderState = 'fulfilled' | 'processing' | 'pending' | 'refunded';
export interface Order {
  id: string;
  company: string;
  hue: number;
  item: string;
  state: OrderState;
  amount: number;
}
const ORDER_TONE: Record<OrderState, BadgeTone> = {
  fulfilled: 'pos',
  processing: 'info',
  pending: 'warn',
  refunded: 'neg',
};
const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-90210',
    company: 'Northwind',
    hue: 220,
    item: 'Annual license',
    state: 'fulfilled',
    amount: 2400,
  },
  {
    id: 'ORD-90211',
    company: 'Halcyon',
    hue: 150,
    item: 'Seat add-on',
    state: 'processing',
    amount: 320,
  },
  {
    id: 'ORD-90212',
    company: 'Vertex',
    hue: 280,
    item: 'Pro upgrade',
    state: 'pending',
    amount: 980,
  },
  {
    id: 'ORD-90213',
    company: 'Cobalt',
    hue: 12,
    item: 'API overage',
    state: 'refunded',
    amount: 140,
  },
  {
    id: 'ORD-90214',
    company: 'Beacon',
    hue: 95,
    item: 'Support plan',
    state: 'fulfilled',
    amount: 3120,
  },
  {
    id: 'ORD-90215',
    company: 'Lumen',
    hue: 320,
    item: 'Onboarding',
    state: 'processing',
    amount: 1500,
  },
];
const ROW_MENU: MenuItem[] = [
  { label: 'View order', icon: 'eye' },
  { label: 'Refund', icon: 'refresh' },
  { sep: true },
  { label: 'Cancel', icon: 'x', danger: true },
];

export type OrderColumn = 'customer' | 'item' | 'status' | 'amount';
const ALL_ORDER_COLUMNS: OrderColumn[] = ['customer', 'item', 'status', 'amount'];

/** Operational table: tab filters, bulk selection, status badges, row menu. */
export const OrdersBlock = defineComponent({
  name: 'VspOrdersBlock',
  props: {
    orders: { type: Array as PropType<Order[]>, default: () => DEFAULT_ORDERS },
    columns: { type: Array as PropType<OrderColumn[]>, default: () => ALL_ORDER_COLUMNS },
    loading: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const tab = ref('all');
    const sel = ref<Set<string>>(new Set());
    return () => {
      const col = (c: OrderColumn) => props.columns.includes(c);
      const rows = props.orders.filter((o) => tab.value === 'all' || o.state === tab.value);
      const allSel = rows.length > 0 && rows.every((r) => sel.value.has(r.id));
      const toggleAll = () => {
        const n = new Set(sel.value);
        if (allSel) rows.forEach((r) => n.delete(r.id));
        else rows.forEach((r) => n.add(r.id));
        sel.value = n;
      };
      const toggle = (id: string) => {
        const n = new Set(sel.value);
        if (n.has(id)) n.delete(id);
        else n.add(id);
        sel.value = n;
      };
      const check = (on: boolean, onClick: () => void) =>
        h(
          'span',
          { class: cx('ui-check', on && 'on'), role: 'checkbox', 'aria-checked': on, onClick },
          [blockIcon('check', 14)],
        );
      return h(
        Block,
        {
          title: 'Orders',
          desc: 'Operational table with tab filters, bulk selection, inline status and a row action menu.',
        },
        () => [
          h('div', { style: blockBarStyle }, [
            h(Tabs, {
              modelValue: tab.value,
              'onUpdate:modelValue': (v: string) => (tab.value = v),
              tabs: [
                { value: 'all', label: 'All', count: props.orders.length },
                { value: 'processing', label: 'Processing' },
                { value: 'pending', label: 'Pending' },
                { value: 'refunded', label: 'Refunded' },
              ],
            }),
            h('div', { style: { flex: 1 } }),
            ...(sel.value.size > 0
              ? [
                  h(Badge, { tone: 'info' }, () => `${sel.value.size} selected`),
                  h('button', { type: 'button', class: 'btn btn-ghost btn-sm' }, [
                    blockIcon('download', 15),
                    'Export',
                  ]),
                  h('button', { type: 'button', class: 'btn btn-ghost btn-sm' }, [
                    blockIcon('check', 15),
                    'Fulfill',
                  ]),
                ]
              : [
                  h('button', { type: 'button', class: 'btn btn-ghost btn-sm' }, [
                    blockIcon('filter', 15),
                    'Filter',
                  ]),
                  h('button', { type: 'button', class: 'btn btn-primary btn-sm' }, [
                    blockIcon('plus', 15),
                    'New order',
                  ]),
                ]),
          ]),
          props.loading
            ? blockSkeleton()
            : rows.length === 0
              ? (slots.empty?.() ??
                blockEmpty(
                  'No orders',
                  tab.value === 'all'
                    ? 'New orders will appear here.'
                    : `No ${tab.value} orders right now.`,
                ))
              : h('div', { style: { overflowX: 'auto' } }, [
                  h('table', { class: 'ui-table', style: { minWidth: '720px' } }, [
                    h('thead', {}, [
                      h('tr', {}, [
                        h('th', { style: { width: '44px' } }, [check(allSel, toggleAll)]),
                        h('th', {}, [h('span', { class: 'eyebrow' }, 'Order')]),
                        col('customer')
                          ? h('th', {}, [h('span', { class: 'eyebrow' }, 'Customer')])
                          : null,
                        col('item') ? h('th', {}, [h('span', { class: 'eyebrow' }, 'Item')]) : null,
                        col('status')
                          ? h('th', {}, [h('span', { class: 'eyebrow' }, 'Status')])
                          : null,
                        col('amount')
                          ? h('th', { style: { textAlign: 'right' } }, [
                              h('span', { class: 'eyebrow' }, 'Amount'),
                            ])
                          : null,
                        h('th', { style: { width: '44px' } }),
                      ]),
                    ]),
                    h(
                      'tbody',
                      {},
                      rows.map((o) =>
                        h(
                          'tr',
                          {
                            key: o.id,
                            style: {
                              background: sel.value.has(o.id)
                                ? 'color-mix(in oklab, var(--accent) 7%, transparent)'
                                : undefined,
                            },
                          },
                          [
                            h('td', {}, [check(sel.value.has(o.id), () => toggle(o.id))]),
                            h('td', { class: 'mono', style: { fontWeight: 600 } }, o.id),
                            col('customer')
                              ? h('td', {}, [
                                  h(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                      },
                                    },
                                    [
                                      h(Avatar, { name: o.company, hue: o.hue, size: 28 }),
                                      h('span', { style: { fontWeight: 500 } }, o.company),
                                    ],
                                  ),
                                ])
                              : null,
                            col('item')
                              ? h('td', { style: { color: 'var(--text-dim)' } }, o.item)
                              : null,
                            col('status')
                              ? h('td', {}, [
                                  h(Badge, { tone: ORDER_TONE[o.state], dot: true }, () => o.state),
                                ])
                              : null,
                            col('amount')
                              ? h(
                                  'td',
                                  { class: 'tnum', style: { textAlign: 'right', fontWeight: 700 } },
                                  `$${o.amount.toLocaleString()}`,
                                )
                              : null,
                            h('td', {}, [
                              h(
                                DropdownMenu,
                                { items: ROW_MENU },
                                {
                                  trigger: () =>
                                    h(
                                      'button',
                                      {
                                        type: 'button',
                                        class: 'vsp-icon-btn',
                                        style: {
                                          width: '30px',
                                          height: '30px',
                                          border: 0,
                                          background: 'transparent',
                                        },
                                        'aria-label': 'Row actions',
                                      },
                                      [blockIcon('more', 18)],
                                    ),
                                },
                              ),
                            ]),
                          ],
                        ),
                      ),
                    ),
                  ]),
                ]),
        ],
      );
    };
  },
});

/* ===================== Team & roles ===================== */

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  hue: number;
  role: string;
}
const DEFAULT_MEMBERS: TeamMember[] = [
  { id: 0, name: 'Avery Quinn', email: 'avery@vespera.dev', hue: 250, role: 'Owner' },
  { id: 1, name: 'Maya Okafor', email: 'maya@northwind.com', hue: 220, role: 'Admin' },
  { id: 2, name: 'Leo Vega', email: 'leo@halcyon.com', hue: 150, role: 'Editor' },
  { id: 3, name: 'Noor Haddad', email: 'noor@beacon.com', hue: 40, role: 'Viewer' },
];
const MEMBER_MENU: MenuItem[] = [
  { label: 'Resend invite', icon: 'mail' },
  { label: 'Transfer ownership', icon: 'shield' },
  { sep: true },
  { label: 'Remove', icon: 'x', danger: true },
];

/** Member list with inline role selects and a per-row action menu. */
export const TeamRolesBlock = defineComponent({
  name: 'VspTeamRolesBlock',
  props: {
    members: { type: Array as PropType<TeamMember[]>, default: () => DEFAULT_MEMBERS },
    loading: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const members = ref<TeamMember[]>(props.members.map((m) => ({ ...m })));
    return () =>
      h(
        Block,
        { title: 'Team & roles', desc: 'Manage members and permissions with inline role selects.' },
        () => [
          h('div', { style: blockBarStyle }, [
            blockIcon('users', 17),
            h('b', { style: { fontSize: '13.5px' } }, 'Members'),
            h(Badge, { tone: 'muted' }, () => String(members.value.length)),
            h('div', { style: { flex: 1 } }),
            h('button', { type: 'button', class: 'btn btn-primary btn-sm' }, [
              blockIcon('mail', 15),
              'Invite',
            ]),
          ]),
          props.loading
            ? blockSkeleton()
            : members.value.length === 0
              ? (slots.empty?.() ??
                blockEmpty('No members', 'Invite teammates to collaborate here.'))
              : h(
                  'div',
                  { style: { padding: '14px', paddingTop: '4px', paddingBottom: '4px' } },
                  members.value.map((m) =>
                    h('div', { key: m.id, class: 'ui-row' }, [
                      h(Avatar, { name: m.name, hue: m.hue, size: 38 }),
                      h('div', { style: { flex: 1, minWidth: 0 } }, [
                        h('div', { style: { fontWeight: 600, fontSize: '13.5px' } }, m.name),
                        h(
                          'div',
                          {
                            class: 'mono',
                            style: { fontSize: '11.5px', color: 'var(--text-faint)' },
                          },
                          m.email,
                        ),
                      ]),
                      m.role === 'Owner'
                        ? h(Badge, { tone: 'info' }, () => 'Owner')
                        : h('div', { style: { width: '130px' } }, [
                            h(Select, {
                              modelValue: m.role,
                              options: ['Admin', 'Editor', 'Viewer'],
                              'onUpdate:modelValue': (v: SelectValue) => {
                                members.value = members.value.map((y) =>
                                  y.id === m.id ? { ...y, role: String(v) } : y,
                                );
                              },
                            }),
                          ]),
                      h(
                        DropdownMenu,
                        { items: MEMBER_MENU },
                        {
                          trigger: () =>
                            h(
                              'button',
                              {
                                type: 'button',
                                class: 'vsp-icon-btn',
                                style: { width: '32px', height: '32px' },
                                'aria-label': 'Member actions',
                              },
                              [blockIcon('more', 18)],
                            ),
                        },
                      ),
                    ]),
                  ),
                ),
        ],
      );
  },
});

/* ===================== API keys ===================== */

export interface ApiKey {
  id: number;
  name: string;
  token: string;
  /** Full secret shown when revealed. */
  secret: string;
  created: string;
  last: string;
}
const DEFAULT_KEYS: ApiKey[] = [
  {
    id: 1,
    name: 'Production',
    token: 'vsp_live_8f2a…d91c',
    secret: 'vsp_live_8f2a39c4e7b1d91c',
    created: 'Jan 14, 2026',
    last: '2m ago',
  },
  {
    id: 2,
    name: 'Staging',
    token: 'vsp_test_4b7e…02fa',
    secret: 'vsp_test_4b7e1d9a55c302fa',
    created: 'Mar 02, 2026',
    last: '3d ago',
  },
  {
    id: 3,
    name: 'CI / CD',
    token: 'vsp_live_19cc…7a4b',
    secret: 'vsp_live_19cc8e2f0b6d7a4b',
    created: 'Apr 21, 2026',
    last: '12h ago',
  },
];

/** Reveal, copy, and revoke API credentials; secrets stay masked by default. */
export const ApiKeysBlock = defineComponent({
  name: 'VspApiKeysBlock',
  props: {
    keys: { type: Array as PropType<ApiKey[]>, default: () => DEFAULT_KEYS },
    loading: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const keys = ref<ApiKey[]>(props.keys.map((k) => ({ ...k })));
    const revealed = ref<Set<number>>(new Set());
    return () => {
      const toggleReveal = (id: number) => {
        const n = new Set(revealed.value);
        if (n.has(id)) n.delete(id);
        else n.add(id);
        revealed.value = n;
      };
      return h(
        Block,
        {
          title: 'API keys',
          desc: 'Reveal, copy, and revoke credentials. Secrets stay masked by default.',
        },
        () => [
          h('div', { style: blockBarStyle }, [
            blockIcon('bolt', 17),
            h('b', { style: { fontSize: '13.5px' } }, 'Secret keys'),
            h('div', { style: { flex: 1 } }),
            h(
              'button',
              {
                type: 'button',
                class: 'btn btn-primary btn-sm',
                onClick: () => toast({ tone: 'pos', title: 'API key created' }),
              },
              [blockIcon('plus', 15), 'Create key'],
            ),
          ]),
          props.loading
            ? blockSkeleton()
            : keys.value.length === 0
              ? (slots.empty?.() ??
                blockEmpty('No API keys', 'Create a key to start making requests.'))
              : h(
                  'div',
                  { style: { padding: '14px', paddingTop: '4px', paddingBottom: '4px' } },
                  keys.value.map((k) => {
                    const show = revealed.value.has(k.id);
                    return h('div', { key: k.id, class: 'ui-row' }, [
                      h('div', { style: { minWidth: '96px' } }, [
                        h('div', { style: { fontWeight: 600, fontSize: '13.5px' } }, k.name),
                        h('div', { class: 'eyebrow', style: { marginTop: '2px' } }, k.created),
                      ]),
                      h(
                        'code',
                        {
                          class: 'mono',
                          style: {
                            flex: 1,
                            fontSize: '12.5px',
                            color: 'var(--text-dim)',
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--r-sm)',
                            padding: '7px 11px',
                            letterSpacing: '.02em',
                          },
                        },
                        show ? k.secret : k.token,
                      ),
                      h(Tooltip, { label: show ? 'Hide' : 'Reveal' }, () =>
                        h(
                          'button',
                          {
                            type: 'button',
                            class: 'vsp-icon-btn',
                            style: { width: '34px', height: '34px' },
                            'aria-label': show ? 'Hide secret' : 'Reveal secret',
                            onClick: () => toggleReveal(k.id),
                          },
                          [blockIcon('eye', 16)],
                        ),
                      ),
                      h(Tooltip, { label: 'Copy' }, () =>
                        h(
                          'button',
                          {
                            type: 'button',
                            class: 'vsp-icon-btn',
                            style: { width: '34px', height: '34px' },
                            'aria-label': 'Copy secret',
                            onClick: () => toast({ title: 'Copied to clipboard' }),
                          },
                          [blockIcon('doc', 16)],
                        ),
                      ),
                      h(
                        'span',
                        { class: 'eyebrow', style: { width: '66px', textAlign: 'right' } },
                        k.last,
                      ),
                      h(
                        'button',
                        {
                          type: 'button',
                          class: 'btn btn-subtle btn-sm',
                          onClick: () => {
                            keys.value = keys.value.filter((y) => y.id !== k.id);
                            toast({ tone: 'neg', title: 'Key revoked' });
                          },
                        },
                        'Revoke',
                      ),
                    ]);
                  }),
                ),
        ],
      );
    };
  },
});

/* ===================== Kanban board ===================== */

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

const kanbanCardInner = (card: KanbanCard) => [
  h(
    'div',
    { style: { fontSize: '13px', fontWeight: 600, marginBottom: '9px', lineHeight: 1.4 } },
    card.title,
  ),
  h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
    h(Badge, { tone: card.tone }, () => card.tag),
    h(Avatar, { name: 'A Q', hue: 250, size: 22 }),
  ]),
];

/** A lightweight kanban — drag cards to reorder or move between columns. */
export const KanbanBlock = defineComponent({
  name: 'VspKanbanBlock',
  props: {
    columns: { type: Array as PropType<KanbanColumn[]>, default: () => DEFAULT_COLUMNS },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const cols = ref<KanbanColumn[]>(props.columns.map((c) => ({ ...c, cards: [...c.cards] })));
    const drag = ref<DragState | null>(null);
    const pt = ref({ x: 0, y: 0 });
    const target = ref<DropTarget | null>(null);
    const colEls: (HTMLElement | null)[] = [];
    let dragData: DragState | null = null;
    let targetData: DropTarget | null = null;
    let cleanup: (() => void) | null = null;

    const startDrag = (e: PointerEvent, card: KanbanCard, ci: number) => {
      if (e.button !== 0) return;
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const origIndex = cols.value[ci]!.cards.findIndex((c) => c.id === card.id);
      const d: DragState = {
        card,
        from: ci,
        origIndex,
        w: rect.width,
        offX: e.clientX - rect.left,
        offY: e.clientY - rect.top,
      };
      const home = { col: ci, index: origIndex };
      dragData = d;
      targetData = home;
      drag.value = d;
      pt.value = { x: e.clientX, y: e.clientY };
      target.value = home;
      e.preventDefault();
    };

    watch(drag, (d) => {
      cleanup?.();
      cleanup = null;
      if (!d) return;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      const move = (e: PointerEvent) => {
        pt.value = { x: e.clientX, y: e.clientY };
        let found: DropTarget | null = null;
        colEls.forEach((el, ci) => {
          if (!el) return;
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
              const cr = cards[i]!.getBoundingClientRect();
              if (e.clientY < cr.top + cr.height / 2) {
                idx = i;
                break;
              }
            }
            found = { col: ci, index: idx };
          }
        });
        if (!found) found = { col: d.from, index: d.origIndex };
        targetData = found;
        target.value = found;
      };
      const up = () => {
        const dd = dragData;
        const tg = targetData;
        if (dd && tg) {
          const next = cols.value.map((c) => ({
            ...c,
            cards: c.cards.filter((x) => x.id !== dd.card.id),
          }));
          next[tg.col]!.cards.splice(tg.index, 0, dd.card);
          cols.value = next;
          emit('change', next);
        }
        dragData = null;
        targetData = null;
        drag.value = null;
        target.value = null;
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      cleanup = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    });
    onBeforeUnmount(() => cleanup?.());

    const placeholder = () =>
      h('div', {
        style: {
          border: '1.6px dashed color-mix(in oklab, var(--accent) 50%, var(--border))',
          background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
          borderRadius: 'var(--r-md)',
          height: '56px',
        },
      });

    const renderCard = (card: KanbanCard, ci: number) =>
      h(
        'div',
        {
          key: card.id,
          'data-kcard': '',
          class: 'card',
          style: { padding: '13px', cursor: 'grab', touchAction: 'none' },
          onPointerdown: (e: PointerEvent) => startDrag(e, card, ci),
        },
        kanbanCardInner(card),
      );

    return () => {
      const d = drag.value;
      const tg = target.value;
      const portalTarget = getPortalTarget();
      return h(
        Block,
        {
          title: 'Operations board',
          desc: 'A lightweight kanban — drag a card to reorder it or move it between columns.',
        },
        () => [
          h(
            'div',
            {
              style: {
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              },
            },
            cols.value.map((col, ci) => {
              const items = col.cards.filter((c) => !(d && c.id === d.card.id));
              const showPh = !!d && !!tg && tg.col === ci;
              const stack: ReturnType<typeof h>[] = [];
              items.forEach((card, i) => {
                if (showPh && tg!.index === i) stack.push(placeholder());
                stack.push(renderCard(card, ci));
              });
              if (showPh && tg!.index >= items.length) stack.push(placeholder());
              if (items.length === 0 && !showPh)
                stack.push(
                  h(
                    'div',
                    {
                      style: {
                        border: '1.5px dashed var(--border)',
                        borderRadius: 'var(--r-sm)',
                        padding: '18px 0',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: 'var(--text-faint)',
                      },
                    },
                    'Drop here',
                  ),
                );
              return h(
                'div',
                {
                  key: col.name,
                  ref: (el) => {
                    colEls[ci] = el as HTMLElement | null;
                  },
                },
                [
                  h(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        padding: '0 2px',
                      },
                    },
                    [
                      h('span', {
                        style: {
                          width: '8px',
                          height: '8px',
                          borderRadius: '99px',
                          background: col.tone,
                        },
                      }),
                      h('b', { style: { fontSize: '12.5px' } }, col.name),
                      h(
                        'span',
                        { class: 'mono', style: { fontSize: '11px', color: 'var(--text-faint)' } },
                        String(col.cards.length),
                      ),
                    ],
                  ),
                  h(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        minHeight: '64px',
                      },
                    },
                    stack,
                  ),
                ],
              );
            }),
          ),
          d && portalTarget
            ? h(Teleport, { to: portalTarget }, [
                h(
                  'div',
                  {
                    style: {
                      position: 'fixed',
                      left: `${pt.value.x - d.offX}px`,
                      top: `${pt.value.y - d.offY}px`,
                      width: `${d.w}px`,
                      zIndex: 600,
                      pointerEvents: 'none',
                      transform: 'rotate(2.5deg) scale(1.03)',
                      opacity: 0.96,
                    },
                  },
                  [
                    h(
                      'div',
                      {
                        class: 'card',
                        style: {
                          padding: '13px',
                          boxShadow: 'var(--shadow-lg)',
                          borderColor: 'color-mix(in oklab, var(--accent) 40%, var(--border))',
                        },
                      },
                      kanbanCardInner(d.card),
                    ),
                  ],
                ),
              ])
            : null,
        ],
      );
    };
  },
});
