// screens-ops2.jsx — Audit & restore, Insights (AI), Notifications. Uses window primitives + OpsHead/MiniKpi.
const { useState: useOps2 } = React;

/* ============================= AUDIT & RESTORE ============================= */
const AUDIT = [
  { v: 7, who: 'Avery Quinn', hue: 250, src: 'UI', when: 'Today · 14:22', field: 'Plan', from: 'Growth', to: 'Enterprise', current: true },
  { v: 6, who: 'API · key_8f2a', hue: 200, src: 'API', when: 'Today · 09:10', field: 'Seats', from: '40', to: '48' },
  { v: 5, who: 'Maya Okafor', hue: 220, src: 'UI', when: 'Jun 6 · 16:48', field: 'Billing email', from: 'ops@…', to: 'maya@northwind.com' },
  { v: 4, who: 'System', hue: 40, src: 'System', when: 'Jun 2 · 02:00', field: 'Status', from: 'Trial', to: 'Active' },
  { v: 3, who: 'Leo Vega', hue: 150, src: 'UI', when: 'May 28 · 11:03', field: 'Region', from: 'eu-west-1', to: 'us-east-1' },
];
const SRC_TONE = { UI: 'info', API: 'warn', System: 'muted' };

function AuditScreen() {
  const [restoring, setRestoring] = useOps2(null);
  return (
    <div className="ag-content-inner">
      <OpsHead title="Audit & restore" desc="A tamper-evident history of every change to this record — who, what, where from, and one-click rollback."
        right={<><Button variant="ghost" size="sm" leadingIcon="download">Export trail</Button><Button variant="ghost" size="sm" leadingIcon="eye">Compare</Button></>} />

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <div className="card-head"><h3>Change history</h3><div className="ag-top-spacer" /><span className="eyebrow">Northwind · ATG-4810</span></div>
          <div className="card-pad">
            {AUDIT.map((e, i) => (
              <div key={e.v} style={{ display: 'flex', gap: 14, paddingBottom: i < AUDIT.length - 1 ? 18 : 0, position: 'relative' }}>
                {i < AUDIT.length - 1 && <span style={{ position: 'absolute', left: 17, top: 36, bottom: 0, width: 1.5, background: 'var(--border)' }} />}
                <Av name={e.who} hue={e.hue} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5 }}>{e.who}</span>
                    <Badge tone={SRC_TONE[e.src]}>{e.src}</Badge>
                    {e.current && <Badge tone="pos" dot>current</Badge>}
                    <span className="eyebrow" style={{ marginLeft: 'auto' }}>{e.when}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 13, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{e.field}</span>
                    <code className="mono" style={{ fontSize: 11.5, padding: '2px 7px', borderRadius: 5, background: 'color-mix(in oklab, var(--danger) 12%, transparent)', color: 'var(--danger)', textDecoration: 'line-through' }}>{e.from}</code>
                    <Icon.arrowRight style={{ width: 13, height: 13, color: 'var(--text-faint)' }} />
                    <code className="mono" style={{ fontSize: 11.5, padding: '2px 7px', borderRadius: 5, background: 'color-mix(in oklab, var(--success) 12%, transparent)', color: 'var(--success)' }}>{e.to}</code>
                    {!e.current && <button className="btn btn-subtle btn-sm" style={{ marginLeft: 'auto', height: 28 }} onClick={() => setRestoring(e)}><Icon.refresh style={{ width: 13, height: 13 }} />Restore</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Integrity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'color-mix(in oklab, var(--success) 14%, transparent)', color: 'var(--success)' }}><Icon.shield style={{ width: 21, height: 21 }} /></span>
              <div><div style={{ fontWeight: 700 }}>Verified</div><div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Hash chain intact · 7 entries</div></div>
            </div>
            {[['Retention', '7 years'], ['Last verified', '2m ago'], ['Signature', 'sha256:9f2a…d1']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border)' }}><span className="eyebrow">{k}</span><span className="mono" style={{ fontSize: 12, fontWeight: 500 }}>{v}</span></div>
            ))}
          </div>
          <Alert tone="info" title="Traceability">Every change is linked to an actor, source and request ID — exportable for SOC 2 evidence.</Alert>
        </div>
      </div>

      <Dialog open={!!restoring} onClose={() => setRestoring(null)} icon="refresh" tone="warn" title="Restore this version?"
        desc={restoring ? `This reverts ${restoring.field} back to “${restoring.from}” and creates a new audit entry. Nothing is deleted.` : ''} maxWidth={430}
        footer={<><Button variant="ghost" size="sm" onClick={() => setRestoring(null)}>Cancel</Button><Button variant="primary" size="sm" leadingIcon="refresh" onClick={() => { const f = restoring.field; setRestoring(null); window.toast?.({ tone: 'pos', title: 'Version restored', body: `${f} rolled back · new entry logged` }); }}>Restore version</Button></>} />
    </div>
  );
}

/* ============================= INSIGHTS (AI) ============================= */
const SUGGESTIONS = [
  { icon: 'trend', tone: 'pos', tag: 'Expansion', title: 'Northwind is ready to upsell', body: 'Usage is at 94% of plan for 3 weeks. A timely Enterprise offer has an 82% modeled win-rate.', cta: 'Draft offer' },
  { icon: 'cart', tone: 'neg', tag: 'Churn risk', title: '3 accounts show churn signals', body: 'Logins down 40% MoM across Cobalt, Driftwood and Pinecone. Suggested: trigger a re-engagement play.', cta: 'Review accounts' },
  { icon: 'bolt', tone: 'info', tag: 'Efficiency', title: 'Automate refund approvals under $500', body: '64% of refund approvals this month were low-risk and auto-approvable, saving ~6h of review.', cta: 'Create rule' },
];
const ALERTS = [
  { sev: 'high', title: 'Payment failure spike', body: 'Failed charges up 3.2× in the last hour — possible processor issue.', when: '4m ago' },
  { sev: 'med', title: 'API latency elevated', body: 'p95 latency at 820ms on the webhooks service.', when: '26m ago' },
  { sev: 'low', title: 'Unusual login location', body: 'Admin sign-in from a new region for Halcyon.', when: '1h ago' },
];
const SEV = { high: 'neg', med: 'warn', low: 'info' };

function InsightsScreen() {
  const [dismissed, setDismissed] = useOps2([]);
  const visible = SUGGESTIONS.filter((_, i) => !dismissed.includes(i));
  return (
    <div className="ag-content-inner">
      <OpsHead title="Insights" desc="AI-surfaced suggestions, anomalies and hints across your workspace."
        right={<Button variant="ghost" size="sm" leadingIcon="refresh">Refresh signals</Button>} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
        <span style={{ width: 26, height: 26, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'linear-gradient(140deg, var(--accent), color-mix(in oklab, var(--accent) 50%, var(--accent-2)))', color: '#fff' }}><Icon.sparkle style={{ width: 15, height: 15 }} /></span>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Recommended actions</h3>
        <Badge tone="info">{visible.length}</Badge>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--gap)' }}>
        {visible.length === 0 && <div className="card card-pad" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-faint)', padding: 40 }}>No suggestions right now — you're on top of things.</div>}
        {visible.map((s, i) => { const realIdx = SUGGESTIONS.indexOf(s); const I = Icon[s.icon]; const tc = { pos: 'var(--success)', neg: 'var(--danger)', info: 'var(--accent)' }[s.tone]; return (
          <div key={i} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', inset: 0, background: `radial-gradient(360px 120px at 100% 0%, color-mix(in oklab, ${tc} 12%, transparent), transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, position: 'relative' }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, display: 'grid', placeItems: 'center', background: `color-mix(in oklab, ${tc} 14%, transparent)`, color: tc }}><I style={{ width: 17, height: 17 }} /></span>
              <Badge tone={s.tone}>{s.tag}</Badge>
            </div>
            <div style={{ position: 'relative' }}><div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 5 }}>{s.title}</div><p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-dim)', lineHeight: 1.55 }}>{s.body}</p></div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto', position: 'relative' }}>
              <Button variant="primary" size="sm" onClick={() => window.toast?.({ tone: 'pos', title: s.cta, body: 'Action started' })}>{s.cta}</Button>
              <Button variant="subtle" size="sm" onClick={() => setDismissed(d => [...d, realIdx])}>Dismiss</Button>
            </div>
          </div>
        ); })}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="card-head"><h3>Anomaly alerts</h3><div className="ag-top-spacer" /><Badge tone="neg" dot>live</Badge></div>
          <div className="card-pad" style={{ paddingTop: 6, paddingBottom: 6 }}>
            {ALERTS.map((a, i) => (
              <div key={i} className="ui-row" style={{ alignItems: 'flex-start' }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'grid', placeItems: 'center', marginTop: 1, background: `color-mix(in oklab, var(--${SEV[a.sev]==='neg'?'neg':SEV[a.sev]==='warn'?'warn':'accent'}) 14%, transparent)`, color: `var(--${SEV[a.sev]==='neg'?'neg':SEV[a.sev]==='warn'?'warn':'accent'})` }}><Icon.pulse style={{ width: 15, height: 15 }} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontWeight: 600, fontSize: 13.5 }}>{a.title}</span><Badge tone={SEV[a.sev]}>{a.sev}</Badge></div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 3 }}>{a.body}</div>
                </div>
                <span className="eyebrow" style={{ flexShrink: 0 }}>{a.when}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Hints &amp; tips</h3><div className="ag-top-spacer" /><Icon.sparkle style={{ width: 16, height: 16, color: 'var(--accent)' }} /></div>
          <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Use ⌘K to jump anywhere', 'Press the command palette to navigate or run quick actions.'], ['Set auto-approval rules', 'Cut review time by automating low-risk approvals.'], ['Pin key accounts', 'Star accounts to keep them at the top of your dashboard.']].map(([t2, d], i) => (
              <div key={i} style={{ display: 'flex', gap: 11, padding: 12, borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <Icon.sparkle style={{ width: 16, height: 16, color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <div><div style={{ fontWeight: 600, fontSize: 13 }}>{t2}</div><div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================= NOTIFICATIONS ============================= */
const NOTIFS = [
  { tone: 'neg', icon: 'bell', title: 'Payment failed — Cobalt', body: 'The card on file was declined for invoice #4821.', when: '4m ago', unread: true, group: 'Today' },
  { tone: 'pos', icon: 'arrowUp', title: 'Maya Okafor upgraded to Enterprise', body: 'MRR +$1,400. Approval logged by you.', when: '38m ago', unread: true, group: 'Today' },
  { tone: 'info', icon: 'plus', title: 'Vertex AI created a workspace', body: '4 members invited.', when: '1h ago', unread: true, group: 'Today' },
  { tone: 'warn', icon: 'shield', title: 'New device sign-in', body: 'Admin login from a new region for Halcyon.', when: '3h ago', unread: false, group: 'Today' },
  { tone: 'info', icon: 'doc', title: 'June report is ready', body: 'Your monthly revenue export finished.', when: 'Yesterday', unread: false, group: 'Earlier' },
  { tone: 'pos', icon: 'checkCircle', title: 'Reconciliation complete', body: 'All June invoices matched.', when: '2d ago', unread: false, group: 'Earlier' },
];

function NotificationsScreen() {
  const [tab, setTab] = useOps2('all');
  const [notifs, setNotifs] = useOps2(NOTIFS);
  const shown = notifs.filter(n => tab === 'all' || (tab === 'unread' && n.unread));
  const groups = [...new Set(shown.map(n => n.group))];
  const markAll = () => setNotifs(x => x.map(n => ({ ...n, unread: false })));
  const toneVar = { neg: 'var(--danger)', pos: 'var(--success)', warn: 'var(--warning)', info: 'var(--accent)' };
  return (
    <div className="ag-content-inner" style={{ maxWidth: 860 }}>
      <OpsHead title="Notifications" desc="Everything happening across your workspace, in one place."
        right={<><Button variant="ghost" size="sm" leadingIcon="settings">Preferences</Button><Button variant="ghost" size="sm" leadingIcon="check" onClick={markAll}>Mark all read</Button></>} />

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-head" style={{ padding: '10px var(--pad)' }}>
          <Tabs value={tab} onChange={setTab} tabs={[{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread', count: notifs.filter(n => n.unread).length }]} />
        </div>
        {groups.map(g => (
          <div key={g}>
            <div className="eyebrow" style={{ padding: '12px var(--pad) 6px' }}>{g}</div>
            {shown.filter(n => n.group === g).map((n, i) => { const I = Icon[n.icon]; return (
              <div key={i} className="ag-trow" style={{ display: 'flex', gap: 13, padding: 'var(--row-py) var(--pad)', borderTop: '1px solid var(--border)', cursor: 'pointer', background: n.unread ? 'color-mix(in oklab, var(--accent) 5%, transparent)' : 'transparent' }}
                onClick={() => setNotifs(x => x.map(m => m === n ? { ...m, unread: false } : m))}>
                <span style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'grid', placeItems: 'center', background: `color-mix(in oklab, ${toneVar[n.tone]} 14%, transparent)`, color: toneVar[n.tone] }}><I style={{ width: 16, height: 16 }} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontWeight: 600, fontSize: 13.5 }}>{n.title}</span>{n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 3 }}>{n.body}</div>
                </div>
                <span className="eyebrow" style={{ flexShrink: 0 }}>{n.when}</span>
              </div>
            ); })}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { AuditScreen, InsightsScreen, NotificationsScreen });
