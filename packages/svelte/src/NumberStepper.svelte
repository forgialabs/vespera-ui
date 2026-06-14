<script>
  let { value = $bindable(0), min, max, step = 1, unit, disabled = false, id = undefined } = $props();
  const clamp = (v) => {
    let n = v;
    if (min != null && n < min) n = min;
    if (max != null && n > max) n = max;
    return n;
  };
  const set = (v) => (value = clamp(v));
  function onInput(e) {
    const raw = e.currentTarget.value;
    const n = Number(raw);
    if (raw !== '' && raw !== '-' && Number.isFinite(n)) value = n;
  }
</script>

<div class="ui-stepper{disabled ? ' disabled' : ''}">
  <button
    type="button"
    aria-label="Decrease"
    disabled={disabled || (min != null && value <= min)}
    onclick={() => set(value - step)}>−</button
  >
  <span class="val">
    <input
      {id}
      class="ui-stepper-input"
      type="text"
      inputmode="decimal"
      value={String(value)}
      {disabled}
      aria-label="Value"
      oninput={onInput}
      onblur={() => set(value)}
    />{#if unit}<i>{unit}</i>{/if}
  </span>
  <button
    type="button"
    aria-label="Increase"
    disabled={disabled || (max != null && value >= max)}
    onclick={() => set(value + step)}>+</button
  >
</div>
