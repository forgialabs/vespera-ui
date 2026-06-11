<script>
  import Sparkline from './Sparkline.svelte';
  let { label, value, delta, deltaDir = 'up', spark, sparkColor = 'var(--accent)', icon } = $props();
</script>

<div class="card card-pad vsp-rise" style="display:flex;flex-direction:column;gap:14px">
  <div style="display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:10px">
      <span
        style="width:34px;height:34px;border-radius:var(--r-sm);display:grid;place-items:center;background:color-mix(in oklab, var(--accent) 13%, transparent);color:var(--accent)"
        >{@render icon?.()}</span
      >
      <span class="eyebrow">{label}</span>
    </div>
    {#if delta != null}
      <span class="badge {deltaDir === 'up' ? 'badge-pos' : 'badge-neg'}">
        <svg
          viewBox="0 0 24 24"
          width="11"
          height="11"
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
  <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px">
    <div class="tnum" style="font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1">
      {value}
    </div>
    {#if spark}<Sparkline data={spark} color={sparkColor} />{/if}
  </div>
</div>
