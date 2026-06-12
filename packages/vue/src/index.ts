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
  },
  setup(props) {
    return () => {
      const total = props.data.reduce((s, d) => s + d.value, 0) || 1;
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
        });
        acc += len;
        return seg;
      });
      return h('div', { style: { display: 'flex', alignItems: 'center', gap: '22px' } }, [
        h(
          'svg',
          {
            width: props.size,
            height: props.size,
            style: { transform: 'rotate(-90deg)', flexShrink: 0 },
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
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 } },
          props.data.map((d, i) =>
            h(
              'div',
              {
                key: i,
                style: { display: 'flex', alignItems: 'center', gap: '9px', fontSize: '12.5px' },
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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const set = (v: number) => {
      let n = v;
      if (props.min != null && n < props.min) n = props.min;
      if (props.max != null && n > props.max) n = props.max;
      emit('update:modelValue', n);
    };
    return () =>
      h('div', { class: 'ui-stepper' }, [
        h(
          'button',
          {
            type: 'button',
            'aria-label': 'Decrease',
            disabled: props.min != null && props.modelValue <= props.min,
            onClick: () => set(props.modelValue - props.step),
          },
          '−',
        ),
        h('span', { class: 'val' }, [
          props.modelValue,
          props.unit ? h('i', null, props.unit) : null,
        ]),
        h(
          'button',
          {
            type: 'button',
            'aria-label': 'Increase',
            disabled: props.max != null && props.modelValue >= props.max,
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
  },
  setup(props) {
    const expanded = ref(new Set<string>(props.defaultExpanded));
    const selected = ref<string | null>(null);
    const toggle = (id: string) => {
      const n = new Set(expanded.value);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      expanded.value = n;
    };
    return () =>
      h(
        'div',
        { class: 'ui-tree' },
        props.data.map((n, i) =>
          h(VspTreeNode, {
            key: i,
            node: n,
            expanded: expanded.value,
            selected: selected.value,
            toggle,
            select: (id: string) => (selected.value = id),
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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const refs: (HTMLInputElement | null)[] = [];
    const set = (i: number, ch: string) => {
      const chars = Array.from({ length: props.length }, (_, k) => props.modelValue[k] ?? '');
      chars[i] = ch.slice(-1);
      emit('update:modelValue', chars.join(''));
      if (ch && i < props.length - 1) refs[i + 1]?.focus();
    };
    const onKey = (i: number, e: KeyboardEvent) => {
      if (e.key === 'Backspace' && !props.modelValue[i] && i > 0) refs[i - 1]?.focus();
    };
    return () =>
      h(
        'div',
        { class: 'ui-otp' },
        Array.from({ length: props.length }, (_, i) =>
          h('input', {
            key: i,
            ref: (el: unknown) => {
              refs[i] = el as HTMLInputElement | null;
            },
            inputmode: 'numeric',
            maxlength: 1,
            value: props.modelValue[i] ?? '',
            onInput: (e: Event) => set(i, (e.target as HTMLInputElement).value.replace(/\D/g, '')),
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

export const BarChart = defineComponent({
  name: 'VspBarChart',
  props: {
    data: { type: Array as PropType<number[]>, default: () => [] },
    labels: { type: Array as PropType<string[]>, default: undefined },
    width: { type: Number, default: 620 },
    height: { type: Number, default: 240 },
    color: { type: String, default: 'var(--accent)' },
  },
  setup(props) {
    return () => {
      const w = props.width;
      const height = props.height;
      const padL = 34;
      const padB = 26;
      const padT = 10;
      const innerW = Math.max(10, w - padL - 8);
      const innerH = height - padB - padT;
      const max = Math.max(...props.data, 0) * 1.15 || 1;
      const bw = innerW / (props.data.length || 1);
      const grid = [0, 0.5, 1].map((f, i) => {
        const y = padT + innerH - f * innerH;
        return h('g', { key: 'g' + i }, [
          h('line', { x1: padL, x2: w - 8, y1: y, y2: y, stroke: 'var(--grid-line)' }),
          h(
            'text',
            {
              x: padL - 8,
              y: y + 3.5,
              'text-anchor': 'end',
              'font-size': '10',
              fill: 'var(--text-faint)',
              'font-family': 'var(--font-mono)',
            },
            niceNum(Math.round(max * f)),
          ),
        ]);
      });
      const bars = props.data.map((v, i) => {
        const bh = (v / max) * innerH;
        const x = padL + i * bw + bw * 0.18;
        const bwi = bw * 0.64;
        return h('g', { key: 'b' + i }, [
          h('rect', {
            x,
            y: padT + innerH - bh,
            width: bwi,
            height: bh,
            rx: '4',
            fill: `color-mix(in oklab, ${props.color} 78%, transparent)`,
          }),
          props.labels?.[i] != null
            ? h(
                'text',
                {
                  x: x + bwi / 2,
                  y: height - 8,
                  'text-anchor': 'middle',
                  'font-size': '10',
                  fill: 'var(--text-faint)',
                  'font-family': 'var(--font-mono)',
                },
                props.labels[i],
              )
            : null,
        ]);
      });
      return h('svg', { width: w, height, style: { display: 'block' } }, [...grid, ...bars]);
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

export const Dialog = defineComponent({
  name: 'VspDialog',
  props: {
    open: Boolean,
    title: { type: String, default: undefined },
    desc: { type: String, default: undefined },
    maxWidth: { type: Number, default: 460 },
    tone: { type: String as PropType<DialogTone>, default: undefined },
  },
  emits: ['close'],
  setup(props, { slots, emit }) {
    const onKey = (e: KeyboardEvent) => {
      if (props.open && e.key === 'Escape') emit('close');
    };
    onMounted(() => window.addEventListener('keydown', onKey));
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
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
              if (e.target === e.currentTarget) emit('close');
            },
          },
          [
            h(
              'div',
              {
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
  },
  emits: ['close'],
  setup(props, { slots, emit }) {
    const onKey = (e: KeyboardEvent) => {
      if (props.open && e.key === 'Escape') emit('close');
    };
    onMounted(() => window.addEventListener('keydown', onKey));
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
    return () => {
      if (!props.open) return null;
      const target = getPortalTarget();
      if (!target) return null;
      return h(Teleport, { to: target }, [
        h(
          'div',
          {
            class: 'ui-overlay',
            onMousedown: (e: MouseEvent) => {
              if (e.target === e.currentTarget) emit('close');
            },
          },
          [
            h('div', { class: 'ui-sheet', role: 'dialog', 'aria-modal': 'true' }, [
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
                          style: { fontSize: '12.5px', color: 'var(--text-dim)', marginTop: '3px' },
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
                    style: { border: 0, background: 'transparent', width: '32px', height: '32px' },
                    'aria-label': 'Close',
                    onClick: () => emit('close'),
                  },
                  [svgIcon('M18 6L6 18M6 6l12 12', 16)],
                ),
              ]),
              h('div', { class: 'ui-sheet-body vsp-scroll' }, slots.default?.()),
              slots.footer ? h('div', { class: 'ui-sheet-foot' }, slots.footer()) : null,
            ]),
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
  },
  setup(props, { slots }) {
    const open = ref(false);
    const rect = ref<DOMRect | null>(null);
    const triggerRef = ref<HTMLElement | null>(null);
    const layerRef = ref<HTMLElement | null>(null);
    let cleanup: (() => void) | null = null;
    const place = () => {
      if (triggerRef.value) rect.value = triggerRef.value.getBoundingClientRect();
    };
    const close = () => {
      open.value = false;
    };
    const toggle = () => {
      open.value = !open.value;
      if (open.value) nextTick(place);
    };
    watch(open, (o) => {
      if (o) {
        place();
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
      }
    });
    onBeforeUnmount(() => cleanup?.());
    return () => {
      const r = rect.value;
      const style: Record<string, string | number> = {};
      if (r) {
        style.position = 'fixed';
        style.top = `${r.bottom + 6}px`;
        style.minWidth = `${props.width ?? r.width}px`;
        style.zIndex = 320;
        if (props.align === 'end') style.right = `${window.innerWidth - r.right}px`;
        else style.left = `${r.left}px`;
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
  danger?: boolean;
  heading?: boolean;
  sep?: boolean;
  onClick?: () => void;
}

export const DropdownMenu = defineComponent({
  name: 'VspDropdownMenu',
  props: {
    items: { type: Array as PropType<MenuItem[]>, default: () => [] },
    align: { type: String as PropType<AnchoredAlign>, default: 'end' },
    width: { type: Number, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h(
        Anchored,
        { align: props.align, width: props.width },
        {
          trigger: () => slots.trigger?.(),
          default: ({ close }: { close: () => void }) =>
            props.items.map((it, i) => {
              if (it.sep) return h('div', { key: i, class: 'ui-menu-sep' });
              if (it.heading) return h('div', { key: i, class: 'ui-menu-label' }, it.label);
              return h(
                'button',
                {
                  key: i,
                  type: 'button',
                  class: cx('ui-menu-item', it.danger && 'danger'),
                  onClick: () => {
                    it.onClick?.();
                    close();
                  },
                },
                [it.label, it.kbd ? h('kbd', { class: 'ui-kbd' }, it.kbd) : null],
              );
            }),
        },
      );
  },
});

export const Popover = defineComponent({
  name: 'VspPopover',
  props: {
    align: { type: String as PropType<AnchoredAlign>, default: 'start' },
    width: { type: Number, default: 260 },
  },
  setup(props, { slots }) {
    return () =>
      h(
        Anchored,
        { align: props.align, width: props.width, layerClass: 'ui-popover' },
        { trigger: () => slots.trigger?.(), default: () => slots.default?.() },
      );
  },
});
