<script>
  let { steps = [], current = 0 } = $props();
</script>

<div class="ui-steps">
  {#each steps as s, i}
    {#if i > 0}<div class="ui-step-bar{i <= current ? ' done' : ''}"></div>{/if}
    <div class="ui-step {i < current ? 'done' : i === current ? 'active' : 'pending'}">
      <span class="ui-step-dot">
        {#if i < current}
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
        {:else}{i + 1}{/if}
      </span>
      <span class="ui-step-label">{s}</span>
    </div>
  {/each}
</div>
