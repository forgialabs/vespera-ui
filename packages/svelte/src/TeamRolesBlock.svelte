<script>
  import Block from './Block.svelte';
  import Badge from './Badge.svelte';
  import Avatar from './Avatar.svelte';
  import Select from './Select.svelte';
  import DropdownMenu from './DropdownMenu.svelte';
  import Icon from './Icon.svelte';
  import { untrack } from 'svelte';

  const DEFAULT_MEMBERS = [
    { id: 0, name: 'Avery Quinn', email: 'avery@vespera.dev', hue: 250, role: 'Owner' },
    { id: 1, name: 'Maya Okafor', email: 'maya@northwind.com', hue: 220, role: 'Admin' },
    { id: 2, name: 'Leo Vega', email: 'leo@halcyon.com', hue: 150, role: 'Editor' },
    { id: 3, name: 'Noor Haddad', email: 'noor@beacon.com', hue: 40, role: 'Viewer' },
  ];
  const MEMBER_MENU = [
    { label: 'Resend invite', icon: 'mail' },
    { label: 'Transfer ownership', icon: 'shield' },
    { sep: true },
    { label: 'Remove', icon: 'x', danger: true },
  ];

  let { members: initial = DEFAULT_MEMBERS } = $props();
  let members = $state(untrack(() => initial.map((m) => ({ ...m }))));

  function setRole(id, role) {
    members = members.map((y) => (y.id === id ? { ...y, role: String(role) } : y));
  }
</script>

<Block title="Team & roles" desc="Manage members and permissions with inline role selects.">
  <div style="display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--border)">
    <Icon name="users" size={17} />
    <b style="font-size:13.5px">Members</b>
    <Badge tone="muted">{members.length}</Badge>
    <div style="flex:1"></div>
    <button type="button" class="btn btn-primary btn-sm"><Icon name="mail" size={15} />Invite</button>
  </div>
  <div style="padding:14px;padding-top:4px;padding-bottom:4px">
    {#each members as m (m.id)}
      <div class="ui-row">
        <Avatar name={m.name} hue={m.hue} size={38} />
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:13.5px">{m.name}</div>
          <div class="mono" style="font-size:11.5px;color:var(--text-faint)">{m.email}</div>
        </div>
        {#if m.role === 'Owner'}
          <Badge tone="info">Owner</Badge>
        {:else}
          <div style="width:130px">
            <Select
              value={m.role}
              options={['Admin', 'Editor', 'Viewer']}
              onchange={(v) => setRole(m.id, v)}
            />
          </div>
        {/if}
        <DropdownMenu items={MEMBER_MENU}>
          {#snippet trigger()}
            <button
              type="button"
              class="vsp-icon-btn"
              style="width:32px;height:32px"
              aria-label="Member actions"
            >
              <Icon name="more" size={18} />
            </button>
          {/snippet}
        </DropdownMenu>
      </div>
    {/each}
  </div>
</Block>
