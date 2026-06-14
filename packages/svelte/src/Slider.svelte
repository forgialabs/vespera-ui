<script>
  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    id = undefined,
    ...rest
  } = $props();
</script>

<input type="range" class="ui-slider" bind:value {min} {max} {step} {disabled} {id} {...rest} />
