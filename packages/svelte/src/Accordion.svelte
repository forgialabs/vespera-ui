<script>
  import { untrack } from 'svelte';
  let { items = [], multiple = false, defaultOpen = [] } = $props();
  let open = $state(untrack(() => new Set(defaultOpen)));
  const toggle = (i) => {
    const n = new Set(multiple ? open : []);
    if (open.has(i)) n.delete(i);
    else n.add(i);
    open = n;
  };
</script>

<div class="ui-acc">
  {#each items as it, i (i)}
    <div class="ui-acc-item{open.has(i) ? ' open' : ''}">
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
