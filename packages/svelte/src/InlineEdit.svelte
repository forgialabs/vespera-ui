<script>
  import { untrack } from 'svelte';
  let { value = '', placeholder = 'Empty', onsave } = $props();
  let editing = $state(false);
  let draft = $state(untrack(() => value));
  let inputEl = $state();
  const commit = () => {
    editing = false;
    if (draft !== value) onsave?.(draft);
  };
  const start = () => {
    draft = value;
    editing = true;
  };
  $effect(() => {
    if (editing && inputEl) inputEl.focus();
  });
</script>

{#if editing}
  <input
    class="ui-input"
    bind:this={inputEl}
    bind:value={draft}
    style="height:32px;max-width:240px"
    onblur={commit}
    onkeydown={(e) => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') {
        draft = value;
        editing = false;
      }
    }}
  />
{:else}
  <span
    class="ui-inline"
    role="button"
    tabindex="0"
    onclick={start}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') start();
    }}
  >
    <span style="color:{value ? 'var(--text)' : 'var(--text-faint)'}">{value || placeholder}</span>
    <span class="pen" style="display:inline-flex">
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" /></svg
      >
    </span>
  </span>
{/if}
