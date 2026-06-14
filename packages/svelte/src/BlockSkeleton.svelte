<script>
  import Skeleton from './Skeleton.svelte';
  let { rows = 4 } = $props();
</script>

<div style="padding:14px;display:grid;gap:16px">
  {#each Array.from({ length: rows }) as _, i (i)}
    <div style="display:flex;align-items:center;gap:12px">
      <Skeleton w={32} h={32} r={9} />
      <Skeleton w="{30 + ((i * 13) % 35)}%" h={12} />
      <div style="flex:1"></div>
      <Skeleton w={68} h={12} />
    </div>
  {/each}
</div>
