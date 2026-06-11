<script>
  let { value = $bindable(), options = [], ...rest } = $props();
  const val = (o) => (typeof o === 'string' ? o : o.value);
  const lbl = (o) => (typeof o === 'string' ? o : o.label);
</script>

<select class="ui-select" bind:value {...rest}>
  {#each options as o (val(o))}
    <option value={val(o)}>{lbl(o)}</option>
  {/each}
</select>
