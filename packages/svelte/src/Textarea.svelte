<script>
  let { value = $bindable(''), ...rest } = $props();
</script>

<textarea class="ui-textarea" bind:value {...rest}></textarea>
