/**
 * @vespera-ui/vue — Vue 3 components for the Vespera design system.
 *
 * Thin wrappers over `@vespera-ui/css`: they emit the same `.vsp-`/`ui-` classes
 * as `@vespera-ui/react`, so theming via `.vsp-root` data-attributes works
 * identically. Import the CSS once and wrap your app in a themed root.
 */
import { defineComponent, h, ref, type PropType } from 'vue';

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

export type ButtonVariant = 'primary' | 'ghost' | 'subtle' | 'outline' | 'danger';
export type BadgeTone = 'pos' | 'neg' | 'warn' | 'info' | 'muted';
export type AlertTone = 'info' | 'pos' | 'warn' | 'neg';

export const Button = defineComponent({
  name: 'VspButton',
  props: {
    variant: { type: String as PropType<ButtonVariant>, default: 'ghost' },
    size: { type: String as PropType<'sm'>, default: undefined },
    loading: Boolean,
    disabled: Boolean,
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          class: cx('btn', `btn-${props.variant}`, props.size === 'sm' && 'btn-sm'),
          disabled: props.disabled || props.loading,
          ...attrs,
        },
        [
          props.loading
            ? h('span', { class: 'ui-spinner', 'aria-hidden': 'true' })
            : slots.leading?.(),
          slots.default?.(),
          slots.trailing?.(),
        ],
      );
  },
});

export const IconButton = defineComponent({
  name: 'VspIconButton',
  props: { label: { type: String, default: undefined } },
  setup(props, { slots, attrs }) {
    return () =>
      h('button', { class: 'vsp-icon-btn', type: 'button', 'aria-label': props.label, ...attrs }, [
        slots.default?.(),
      ]);
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
  props: { size: { type: String as PropType<'lg'>, default: undefined } },
  setup(props) {
    return () =>
      h('span', { class: cx('ui-spinner', props.size === 'lg' && 'lg'), 'aria-hidden': 'true' });
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
          h('span', { class: cx('ui-check', props.modelValue && 'on') }),
          h('span', null, [
            h('span', null, props.label),
            props.sub ? h('span', { class: 'ui-opt-sub' }, props.sub) : null,
          ]),
        ],
      );
  },
});

export type SelectOption = string | { value: string; label: string; sub?: string };
const optValue = (o: SelectOption) => (typeof o === 'string' ? o : o.value);
const optLabel = (o: SelectOption) => (typeof o === 'string' ? o : o.label);

export const Radio = defineComponent({
  name: 'VspRadio',
  props: {
    checked: Boolean,
    label: { type: String, default: undefined },
    sub: { type: String, default: undefined },
  },
  emits: ['select'],
  setup(props, { emit }) {
    return () =>
      h(
        'label',
        {
          class: 'ui-opt',
          onClick: (e: Event) => {
            e.preventDefault();
            emit('select');
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
    options: { type: Array as PropType<SelectOption[]>, default: () => [] },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        props.options.map((o) =>
          h(Radio, {
            key: optValue(o),
            label: optLabel(o),
            sub: typeof o === 'object' ? o.sub : undefined,
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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        type: 'range',
        class: 'ui-slider',
        value: props.modelValue,
        min: props.min,
        max: props.max,
        step: props.step,
        onInput: (e: Event) =>
          emit('update:modelValue', Number((e.target as HTMLInputElement).value)),
      });
  },
});

export const NativeSelect = defineComponent({
  name: 'VspNativeSelect',
  props: {
    modelValue: { type: String, default: undefined },
    options: { type: Array as PropType<SelectOption[]>, default: () => [] },
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
  },
  setup(props) {
    return () =>
      h('div', { class: 'meter', style: { height: px(props.height) } }, [
        h('i', {
          style: {
            width: `${Math.min(100, props.value)}%`,
            background: props.tone,
            transition: 'width .3s',
          },
        }),
      ]);
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
}

export const Avatar = defineComponent({
  name: 'VspAvatar',
  props: {
    name: { type: String, required: true },
    hue: { type: Number, default: 0 },
    size: { type: Number, default: 34 },
  },
  setup(props) {
    return () =>
      h(
        'span',
        {
          class: 'vsp-avatar',
          style: {
            width: px(props.size),
            height: px(props.size),
            fontSize: px(props.size * 0.38),
            background: `linear-gradient(140deg, oklch(0.62 0.16 ${props.hue}), oklch(0.55 0.17 ${(props.hue + 50) % 360}))`,
          },
        },
        initialsOf(props.name),
      );
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
            [h(Avatar, { name: p.name, hue: p.hue ?? 0, size: props.size })],
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

export type TabItem = string | { value: string; label: string; count?: number };

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
          return h(
            'button',
            {
              key: id,
              type: 'button',
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

export const Breadcrumb = defineComponent({
  name: 'VspBreadcrumb',
  props: { items: { type: Array as PropType<string[]>, default: () => [] } },
  setup(props) {
    return () =>
      h(
        'nav',
        { style: { display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px' } },
        props.items.flatMap((it, i) => {
          const last = i === props.items.length - 1;
          return [
            i > 0
              ? h(
                  'span',
                  { key: `s${i}`, style: { color: 'var(--text-faint)', display: 'flex' } },
                  [svgIcon(ICON_PATHS.chevR, 13)],
                )
              : null,
            h(
              'span',
              {
                key: i,
                style: {
                  color: last ? 'var(--text)' : 'var(--text-dim)',
                  fontWeight: last ? 600 : 500,
                },
              },
              it,
            ),
          ];
        }),
      );
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

export const Stepper = defineComponent({
  name: 'VspStepper',
  props: {
    steps: { type: Array as PropType<string[]>, default: () => [] },
    current: { type: Number, default: 0 },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'ui-steps' },
        props.steps.flatMap((s, i) => [
          i > 0
            ? h('div', { key: `b${i}`, class: cx('ui-step-bar', i <= props.current && 'done') })
            : null,
          h(
            'div',
            {
              key: i,
              class: cx(
                'ui-step',
                i < props.current && 'done',
                i === props.current && 'active',
                i > props.current && 'pending',
              ),
            },
            [
              h('span', { class: 'ui-step-dot' }, [
                i < props.current ? svgIcon(ICON_PATHS.check) : i + 1,
              ]),
              h('span', { class: 'ui-step-label' }, s),
            ],
          ),
        ]),
      );
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
}

export const Timeline = defineComponent({
  name: 'VspTimeline',
  props: { items: { type: Array as PropType<TimelineItem[]>, default: () => [] } },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'ui-tl' },
        props.items.map((it, i) => {
          const c = it.tone ? TL_TONE[it.tone] : undefined;
          return h('div', { key: i, class: 'ui-tl-item' }, [
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
};
const X_PATH = 'M18 6L6 18M6 6l12 12';
const INBOX_PATH =
  'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z';

export const Banner = defineComponent({
  name: 'VspBanner',
  props: {
    tone: { type: String as PropType<'info' | 'warn' | 'accent'>, default: 'info' },
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
  },
  setup(props) {
    const open = ref(new Set<number>(props.defaultOpen));
    const toggle = (i: number) => {
      const s = open.value;
      const n = new Set<number>(props.multiple ? s : []);
      if (s.has(i)) n.delete(i);
      else n.add(i);
      open.value = n;
    };
    return () =>
      h(
        'div',
        { class: 'ui-acc' },
        props.items.map((it, i) =>
          h('div', { key: i, class: cx('ui-acc-item', open.value.has(i) && 'open') }, [
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
