<script>
  let {
    length = 6,
    value = $bindable(''),
    disabled = false,
    invalid = false,
    oncomplete,
  } = $props();
  let refs = $state([]);
  let chars = $derived(Array.from({ length }, (_, i) => value[i] ?? ''));
  const emit = (next) => {
    value = next.join('');
    if (value.length === length) oncomplete?.(value);
  };
  const set = (i, ch) => {
    const next = chars.slice();
    next[i] = ch.slice(-1);
    emit(next);
    if (ch && i < length - 1) refs[i + 1]?.focus();
  };
  const onpaste = (i, e) => {
    const text = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
    if (!text) return;
    e.preventDefault();
    const next = chars.slice();
    for (let j = 0; j < text.length && i + j < length; j++) next[i + j] = text[j];
    emit(next);
    refs[Math.min(i + text.length, length - 1)]?.focus();
  };
  const onkey = (i, e) => {
    if (e.key === 'Backspace' && !chars[i] && i > 0) refs[i - 1]?.focus();
  };
</script>

<div class="ui-otp{invalid ? ' invalid' : ''}">
  {#each chars as c, i (i)}
    <input
      bind:this={refs[i]}
      inputmode="numeric"
      maxlength="1"
      value={c}
      {disabled}
      aria-invalid={invalid || undefined}
      oninput={(e) => set(i, e.currentTarget.value.replace(/\D/g, ''))}
      onpaste={(e) => onpaste(i, e)}
      onkeydown={(e) => onkey(i, e)}
    />
  {/each}
</div>
