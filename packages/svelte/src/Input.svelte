<script>
  let { value = $bindable(''), invalid = false, ...rest } = $props();
</script>

<input class="ui-input{invalid ? ' invalid' : ''}" bind:value {...rest} />
