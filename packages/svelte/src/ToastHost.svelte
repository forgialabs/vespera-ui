<script>
  import { portal } from './portal.js';
  import { toasts, dismissToast, toastIconPath } from './toast.svelte.js';
</script>

<div class="ui-toast-region" use:portal>
  {#each toasts as t (t.id)}
    <div class="ui-toast {t.tone}">
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><path d={toastIconPath(t.tone)} /></svg
      >
      <div style="flex:1">
        <div class="ui-toast-title">{t.title}</div>
        {#if t.body}<div class="ui-toast-body">{t.body}</div>{/if}
      </div>
      <button
        type="button"
        class="vsp-icon-btn"
        style="border:0;background:transparent;width:26px;height:26px"
        aria-label="Dismiss"
        onclick={() => dismissToast(t.id)}
      >
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg
        >
      </button>
    </div>
  {/each}
</div>
