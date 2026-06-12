<script>
  let { hint = 'PNG, JPG or PDF up to 10MB', accept = undefined, multiple = true, onfiles } = $props();

  let drag = $state(false);
  let inputEl = $state();

  function take(list) {
    if (list && list.length) onfiles?.(Array.from(list));
  }
</script>

<div
  class="ui-dropzone {drag ? 'drag' : ''}"
  role="button"
  tabindex="0"
  onclick={() => inputEl?.click()}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && inputEl?.click()}
  ondragover={(e) => {
    e.preventDefault();
    drag = true;
  }}
  ondragleave={() => (drag = false)}
  ondrop={(e) => {
    e.preventDefault();
    drag = false;
    take(e.dataTransfer?.files ?? null);
  }}
>
  <span class="dz-icon">
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  </span>
  <div style="font-weight:600;font-size:13.5px">
    Drop files or <span style="color:var(--accent)">browse</span>
  </div>
  <div style="font-size:12px;color:var(--text-faint)">{hint}</div>
  <input
    bind:this={inputEl}
    type="file"
    {accept}
    {multiple}
    hidden
    onchange={(e) => take(e.target.files)}
  />
</div>
