<script>
  let { title = undefined, desc = undefined, children } = $props();
</script>

<div>
  {#if title}
    <div style="margin-bottom:12px">
      <div style="font-size:16px;font-weight:700;letter-spacing:-.01em">{title}</div>
      {#if desc}
        <div style="font-size:13px;margin-top:3px;color:var(--text-dim)">{desc}</div>
      {/if}
    </div>
  {/if}
  <div class="card">{@render children?.()}</div>
</div>
