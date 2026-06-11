<script>
  let { value = $bindable(0), min = 0, max = 100, step = 1 } = $props();
</script>

<input type="range" class="ui-slider" bind:value {min} {max} {step} />
