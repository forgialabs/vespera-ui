<script>
  import { untrack } from 'svelte';
  let { items = [], multiple = false, defaultOpen = [], open = undefined, onOpenChange } = $props();
  let internal = $state(untrack(() => new Set(defaultOpen)));
  let openSet = $derived(open !== undefined ? new Set(open) : internal);
  const toggle = (i) => {
    const n = new Set(multiple ? openSet : []);
    if (openSet.has(i)) n.delete(i);
    else n.add(i);
    if (open === undefined) internal = n;
    onOpenChange?.([...n]);
  };
</script>

<div class="ui-acc">
  {#each items as it, i (i)}
    <div class="ui-acc-item{openSet.has(i) ? ' open' : ''}">
      <button type="button" class="ui-acc-head" onclick={() => toggle(i)}>
        {it.title}
        <svg
          class="chev"
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg
        >
      </button>
      <div class="ui-acc-bodywrap">
        <div><div class="ui-acc-body">{it.body}</div></div>
      </div>
    </div>
  {/each}
</div>
