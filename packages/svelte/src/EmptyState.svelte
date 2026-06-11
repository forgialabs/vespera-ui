<script>
  let { title, desc, compact = false, icon, action } = $props();
</script>

<div
  style="display:grid;place-items:center;text-align:center;padding:{compact
    ? '32px 20px'
    : '56px 24px'}"
>
  <div style="max-width:340px">
    <span
      style="width:56px;height:56px;border-radius:16px;display:grid;place-items:center;margin:0 auto 18px;background:color-mix(in oklab, var(--accent) 12%, transparent);color:var(--accent);border:1px solid color-mix(in oklab, var(--accent) 22%, transparent)"
    >
      {#if icon}{@render icon()}{:else}
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path
            d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"
          /></svg
        >
      {/if}
    </span>
    <div style="font-size:17px;font-weight:700">{title}</div>
    {#if desc}<p style="margin:7px 0 0;color:var(--text-dim);font-size:13.5px;line-height:1.6">
        {desc}
      </p>{/if}
    {#if action}<div style="margin-top:20px;display:flex;gap:8px;justify-content:center">
        {@render action()}
      </div>{/if}
  </div>
</div>
