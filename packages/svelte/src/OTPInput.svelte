<script>
  let { length = 6, value = $bindable('') } = $props();
  let refs = $state([]);
  let chars = $derived(Array.from({ length }, (_, i) => value[i] ?? ''));
  const set = (i, ch) => {
    const next = chars.slice();
    next[i] = ch.slice(-1);
    value = next.join('');
    if (ch && i < length - 1) refs[i + 1]?.focus();
  };
  const onkey = (i, e) => {
    if (e.key === 'Backspace' && !chars[i] && i > 0) refs[i - 1]?.focus();
  };
</script>

<div class="ui-otp">
  {#each chars as c, i (i)}
    <input
      bind:this={refs[i]}
      inputmode="numeric"
      maxlength="1"
      value={c}
      oninput={(e) => set(i, e.currentTarget.value.replace(/\D/g, ''))}
      onkeydown={(e) => onkey(i, e)}
    />
  {/each}
</div>
