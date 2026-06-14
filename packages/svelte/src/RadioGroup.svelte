<script>
  import Radio from './Radio.svelte';
  let {
    value = $bindable(),
    options = [],
    name = 'vsp-radio',
    disabled = false,
    orientation = 'vertical',
  } = $props();
  const val = (o) => (typeof o === 'string' ? o : o.value);
  const lbl = (o) => (typeof o === 'string' ? o : o.label);
  const dis = (o) => disabled || (typeof o === 'object' && o.disabled);
</script>

<div
  role="radiogroup"
  style="display:flex;flex-direction:{orientation === 'horizontal'
    ? 'row'
    : 'column'};gap:{orientation === 'horizontal' ? '18px' : '12px'};{orientation === 'horizontal'
    ? 'flex-wrap:wrap'
    : ''}"
>
  {#each options as o (val(o))}
    <Radio
      {name}
      label={lbl(o)}
      sub={typeof o === 'object' ? o.sub : undefined}
      value={val(o)}
      disabled={dis(o)}
      checked={value === val(o)}
      onselect={() => (value = val(o))}
    />
  {/each}
</div>
