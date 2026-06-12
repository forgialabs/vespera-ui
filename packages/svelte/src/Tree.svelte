<script>
  import { untrack } from 'svelte';
  import TreeNode from './TreeNode.svelte';
  let { data = [], defaultExpanded = [] } = $props();
  let expanded = $state(untrack(() => new Set(defaultExpanded)));
  let selected = $state(null);
  const toggle = (id) => {
    const n = new Set(expanded);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    expanded = n;
  };
  const select = (id) => (selected = id);
</script>

<div class="ui-tree">
  {#each data as node, i (i)}
    <TreeNode {node} {expanded} {selected} {toggle} {select} />
  {/each}
</div>
