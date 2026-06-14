<script>
  import Avatar from './Avatar.svelte';
  let { people = [], max = 4, size = 32 } = $props();
  let shown = $derived(people.slice(0, max));
  let extra = $derived(people.length - shown.length);
</script>

<div style="display:flex;align-items:center">
  {#each shown as p, i}
    <span
      style="margin-left:{i
        ? -10
        : 0}px;border:2px solid var(--surface-1);border-radius:50%;position:relative;z-index:{shown.length -
        i}"
    >
      <Avatar name={p.name} hue={p.hue ?? 0} src={p.src} {size} />
    </span>
  {/each}
  {#if extra > 0}
    <span
      style="margin-left:-10px;width:{size}px;height:{size}px;border-radius:50%;display:grid;place-items:center;background:var(--surface-3);border:2px solid var(--surface-1);font-size:{size *
        0.34}px;font-weight:700;color:var(--text-dim)">+{extra}</span
    >
  {/if}
</div>
