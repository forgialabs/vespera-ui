<script>
  let { title, desc, right } = $props();
</script>

<div class="card-head">
  <div style="min-width:0">
    <div class="ttl">{title}</div>
    {#if desc}<div class="eyebrow" style="margin-top:3px">{desc}</div>{/if}
  </div>
  {#if right}<div class="vsp-top-spacer"></div>{@render right()}{/if}
</div>
