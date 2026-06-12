<script>
  // Inline icon by name — keeps the Svelte wrapper free of the icons package.
  let { name, size = 16 } = $props();
</script>

<svg
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  {#if name === 'plus'}
    <path d="M12 5v14M5 12h14" />
  {:else if name === 'check'}
    <path d="m20 6-11 11-5-5" />
  {:else if name === 'x'}
    <path d="M6 6l12 12M18 6 6 18" />
  {:else if name === 'filter'}
    <path d="M3 5h18l-7 8v6l-4-2v-4z" />
  {:else if name === 'bolt'}
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  {:else if name === 'shield'}
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
  {:else if name === 'arrowUp'}
    <path d="M12 19V5M6 11l6-6 6 6" />
  {:else if name === 'more'}
    <circle cx="5" cy="12" r="1.4" />
    <circle cx="12" cy="12" r="1.4" />
    <circle cx="19" cy="12" r="1.4" />
  {:else if name === 'download'}
    <path d="M12 4v11M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  {:else if name === 'eye'}
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  {:else if name === 'refresh'}
    <path d="M21 12a9 9 0 1 1-2.6-6.4" />
    <path d="M21 4v5h-5" />
  {:else if name === 'doc'}
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  {:else if name === 'mail'}
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  {:else if name === 'users'}
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M21 20a6 6 0 0 0-4-5.6" />
  {:else if name === 'bell'}
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  {:else if name === 'clock'}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  {:else if name === 'settings'}
    <circle cx="12" cy="12" r="3" />
    <path
      d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1H2a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 3.6 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H8a1.7 1.7 0 0 0 1-1.56V2a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V8a1.7 1.7 0 0 0 1.56 1H22a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"
    />
  {/if}
</svg>
