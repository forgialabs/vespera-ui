<script>
  let { label, required = false, hint, error, htmlFor, children } = $props();
</script>

<div class="ui-field">
  {#if label}
    <label class="ui-label" for={htmlFor}>
      <span>{label}{#if required}<span class="req"> *</span>{/if}</span>
    </label>
  {/if}
  {@render children?.()}
  {#if error || hint}
    <span class="ui-hint{error ? ' err' : ''}">{error || hint}</span>
  {/if}
</div>
