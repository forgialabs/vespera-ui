<script>
  import { untrack } from 'svelte';
  import TreeNode from './TreeNode.svelte';
  let {
    data = [],
    defaultExpanded = [],
    expanded = undefined,
    selected = undefined,
    onExpandedChange,
    onSelect,
  } = $props();
  let expInternal = $state(untrack(() => new Set(defaultExpanded)));
  let selInternal = $state(null);
  let expandedSet = $derived(expanded !== undefined ? new Set(expanded) : expInternal);
  let selectedId = $derived(selected !== undefined ? selected : selInternal);
  const toggle = (id) => {
    const n = new Set(expandedSet);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    if (expanded === undefined) expInternal = n;
    onExpandedChange?.([...n]);
  };
  const select = (id) => {
    if (selected === undefined) selInternal = id;
    onSelect?.(id);
  };
</script>

<div class="ui-tree">
  {#each data as node, i (i)}
    <TreeNode {node} expanded={expandedSet} selected={selectedId} {toggle} {select} />
  {/each}
</div>
