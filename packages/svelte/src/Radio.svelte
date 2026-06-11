<script>
  let { checked = false, label, sub, name, value, onselect } = $props();
</script>

<label class="ui-opt">
  <input
    type="radio"
    {name}
    {value}
    {checked}
    onchange={() => onselect?.()}
    style="position:absolute;width:1px;height:1px;opacity:0;margin:0"
  />
  <span class="ui-radio-dot{checked ? ' on' : ''}"></span>
  <span>
    <span>{label}</span>
    {#if sub}<span class="ui-opt-sub">{sub}</span>{/if}
  </span>
</label>
