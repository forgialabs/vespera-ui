<script>
  let { value = 0, tone, height = 6 } = $props();
</script>

<div class="meter" style="height:{height}px">
  <i style="width:{Math.min(100, value)}%;{tone ? `background:${tone};` : ''}transition:width .3s"></i>
</div>
