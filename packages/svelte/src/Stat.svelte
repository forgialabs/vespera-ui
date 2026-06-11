<script>
  let { label, value, delta, deltaDir = 'up', tone = 'var(--accent)', icon } = $props();
</script>

<div class="card card-pad" style="display:flex;align-items:center;gap:13px">
  {#if icon}
    <span
      style="width:38px;height:38px;border-radius:var(--r-sm);flex-shrink:0;display:grid;place-items:center;background:color-mix(in oklab, {tone} 14%, transparent);color:{tone}"
      >{@render icon()}</span
    >
  {/if}
  <div style="min-width:0">
    <div class="eyebrow">{label}</div>
    <div style="display:flex;align-items:baseline;gap:8px;margin-top:3px">
      <span class="tnum" style="font-size:22px;font-weight:800;letter-spacing:-.02em">{value}</span>
      {#if delta != null}
        <span class="badge {deltaDir === 'up' ? 'badge-pos' : 'badge-neg'}" style="padding:1px 6px">
          <svg
            viewBox="0 0 24 24"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d={deltaDir === 'up' ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'} /></svg
          >
          {delta}
        </span>
      {/if}
    </div>
  </div>
</div>
