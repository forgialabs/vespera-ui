<script>
  let { value = $bindable(), tabs = [], right } = $props();
  const id = (t) => (typeof t === 'string' ? t : t.value);
  const lbl = (t) => (typeof t === 'string' ? t : t.label);
  const cnt = (t) => (typeof t === 'object' ? t.count : undefined);
</script>

<div class="ui-tabs" style="align-items:center">
  {#each tabs as t (id(t))}
    <button
      type="button"
      class="ui-tab{value === id(t) ? ' on' : ''}"
      onclick={() => (value = id(t))}
    >
      {lbl(t)}{#if cnt(t) != null}<span class="badge badge-muted" style="margin-left:7px"
          >{cnt(t)}</span
        >{/if}
    </button>
  {/each}
  {#if right}<div style="flex:1"></div>{@render right()}{/if}
</div>
