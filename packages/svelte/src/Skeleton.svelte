<script>
  let { w = '100%', h = 12, r = 7 } = $props();
  const px = (v) => (typeof v === 'number' ? `${v}px` : v);
</script>

<div class="skel" style="width:{px(w)};height:{px(h)};border-radius:{px(r)}"></div>
