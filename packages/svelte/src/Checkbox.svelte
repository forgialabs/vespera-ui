<script>
  let { checked = $bindable(false), label, sub, disabled = false } = $props();
</script>

<label class="ui-opt" style="opacity:{disabled ? 0.5 : 1}">
  <input
    type="checkbox"
    bind:checked
    {disabled}
    style="position:absolute;width:1px;height:1px;opacity:0;margin:0"
  />
  <span class="ui-check{checked ? ' on' : ''}"></span>
  <span>
    <span>{label}</span>
    {#if sub}<span class="ui-opt-sub">{sub}</span>{/if}
  </span>
</label>
