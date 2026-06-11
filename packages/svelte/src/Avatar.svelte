<script>
  let { name, hue = 0, size = 34 } = $props();
  let initials = $derived(
    name
      .split(' ')
      .map((s) => s.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );
</script>

<span
  class="vsp-avatar"
  style="width:{size}px;height:{size}px;font-size:{size *
    0.38}px;background:linear-gradient(140deg, oklch(0.62 0.16 {hue}), oklch(0.55 0.17 {(hue + 50) %
    360}))">{initials}</span
>
