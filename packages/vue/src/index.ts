/**
 * @vespera-ui/vue — Vue 3 components for the Vespera design system.
 *
 * Thin wrappers over `@vespera-ui/css`: they emit the same `.vsp-`/`ui-` classes
 * as `@vespera-ui/react`, so theming via `.vsp-root` data-attributes works
 * identically. Import the CSS once and wrap your app in a themed root.
 */
import { defineComponent, h, type PropType } from 'vue';

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
