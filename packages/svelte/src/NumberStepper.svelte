<script>
  let { value = $bindable(0), min, max, step = 1, unit } = $props();
  const set = (v) => {
    let n = v;
    if (min != null && n < min) n = min;
    if (max != null && n > max) n = max;
    value = n;
  };
</script>

<div class="ui-stepper">
  <button
    type="button"
    aria-label="Decrease"
    disabled={min != null && value <= min}
    onclick={() => set(value - step)}>−</button
  >
  <span class="val">{value}{#if unit}<i>{unit}</i>{/if}</span>
  <button
    type="button"
    aria-label="Increase"
    disabled={max != null && value >= max}
    onclick={() => set(value + step)}>+</button
  >
</div>
