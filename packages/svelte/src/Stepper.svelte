<script>
  let { steps = [], current = 0, onStepClick = undefined, orientation = 'horizontal' } = $props();
  const lbl = (s) => (typeof s === 'object' && s ? s.label : s);
  const statusOf = (s, i) =>
    typeof s === 'object' && s && s.status
      ? s.status
      : i < current
        ? 'done'
        : i === current
          ? 'active'
          : 'pending';
</script>

<div class="ui-steps{orientation === 'vertical' ? ' vertical' : ''}">
  {#each steps as s, i}
    {@const status = statusOf(s, i)}
    {#if i > 0}<div class="ui-step-bar{i <= current ? ' done' : ''}"></div>{/if}
    <svelte:element
      this={onStepClick ? 'button' : 'div'}
      type={onStepClick ? 'button' : undefined}
      class="ui-step {status}{onStepClick ? ' clickable' : ''}"
      onclick={onStepClick ? () => onStepClick(i) : undefined}
    >
      <span class="ui-step-dot">
        {#if status === 'done'}
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
          >
        {:else if status === 'error'}!{:else}{i + 1}{/if}
      </span>
      <span class="ui-step-label">{lbl(s)}</span>
    </svelte:element>
  {/each}
</div>
