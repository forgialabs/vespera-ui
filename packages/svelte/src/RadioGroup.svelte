<script>
  import Radio from './Radio.svelte';
  let { value = $bindable(), options = [], name = 'vsp-radio' } = $props();
  const val = (o) => (typeof o === 'string' ? o : o.value);
  const lbl = (o) => (typeof o === 'string' ? o : o.label);
</script>

<div style="display:flex;flex-direction:column;gap:12px">
  {#each options as o (val(o))}
    <Radio
      {name}
      label={lbl(o)}
      sub={typeof o === 'object' ? o.sub : undefined}
      value={val(o)}
      checked={value === val(o)}
      onselect={() => (value = val(o))}
    />
  {/each}
</div>
