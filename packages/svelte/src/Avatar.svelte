<script>
  let { name, hue = 0, size = 34, src = undefined, alt = undefined, status = undefined, shape = 'circle' } = $props();
  const STATUS = {
    online: 'var(--success)',
    offline: 'var(--text-faint)',
    away: 'var(--warning)',
    busy: 'var(--danger)',
  };
  let initials = $derived(
    name
      .split(' ')
      .map((s) => s.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );
  let radius = $derived(shape === 'square' ? 'var(--r-sm)' : '50%');
  let dot = $derived(Math.max(8, Math.round(size * 0.28)));
</script>

<span style="position:relative;display:inline-flex;flex-shrink:0">
  <span
    class="vsp-avatar"
    style="width:{size}px;height:{size}px;font-size:{size *
      0.38}px;border-radius:{radius};overflow:hidden;background:{src
      ? 'var(--surface-3)'
      : `linear-gradient(140deg, oklch(0.62 0.16 ${hue}), oklch(0.55 0.17 ${(hue + 50) % 360}))`}"
  >
    {#if src}<img {src} alt={alt ?? name} style="width:100%;height:100%;object-fit:cover" />{:else}{initials}{/if}
  </span>
  {#if status}
    <span
      aria-label={status}
      style="position:absolute;right:0;bottom:0;width:{dot}px;height:{dot}px;border-radius:50%;background:{STATUS[
        status
      ]};border:2px solid var(--surface-1)"
    ></span>
  {/if}
</span>
