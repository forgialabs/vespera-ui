<script>
  let {
    checked = $bindable(false),
    label,
    sub,
    disabled = false,
    indeterminate = false,
    invalid = false,
    id = undefined,
  } = $props();
</script>

<label class="ui-opt" style="opacity:{disabled ? 0.5 : 1}">
  <input
    type="checkbox"
    bind:checked
    {disabled}
    {indeterminate}
    style="position:absolute;width:1px;height:1px;opacity:0;margin:0"
  />
  <span
    {id}
    role="checkbox"
    aria-checked={indeterminate ? 'mixed' : checked}
    aria-invalid={invalid || undefined}
    class="ui-check{checked || indeterminate ? ' on' : ''}{indeterminate ? ' mixed' : ''}{invalid
      ? ' invalid'
      : ''}"
  ></span>
  <span>
    <span>{label}</span>
    {#if sub}<span class="ui-opt-sub">{sub}</span>{/if}
  </span>
</label>
