// screens-main.jsx — Dashboard + Analytics. Depends on components + data.
const { useState: useStateM } = React;

function PageToolbar({ children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--gap)', flexWrap: 'wrap' }}>
      {children}
      <div style={{ flex: 1 }} />
      {right}
    </div>
  );
}

function DateRange() {
  const [v, setV] = useStateM('30D');
  return <Segmented options={['7D','30D','90D','YTD']} value={v} onChange={setV} />;
}

/* ============================= DASHBOARD ============================= */
function DashboardScreen() {
  return (
    <div className="vsp-content-inner">
      <PageToolbar
        right={<>
          <button className="btn btn-ghost btn-sm"><Icon.download />Export</button>
          <button className="btn btn-primary btn-sm"><Icon.plus />New report</button>
        </>}>
        <DateRange />
        <button className="chip"><Icon.calendar style={{ width: 14, height: 14 }} />Jun 2026</button>
      </PageToolbar>

      <div className="grid stat-grid" style={{ marginBottom: 'var(--gap)' }}>
        <StatCard icon="dollar" label="MRR" value="$248.9k" delta="12.4%" deltaDir="up" spark={revenue30.slice(-14)} />
        <StatCard icon="users" label="Active accounts" value="3,914" delta="6.1%" deltaDir="up" spark={[40,42,44,43,48,52,55,58,60,64,68,70,73,78]} sparkColor="var(--accent-2)" />
        <StatCard icon="pulse" label="Net retention" value="118%" delta="2.0%" deltaDir="up" spark={[100,102,101,104,106,108,110,109,112,114,115,117,118,118]} sparkColor="#34d399" />
        <StatCard icon="cart" label="Churn rate" value="1.8%" delta="0.4%" deltaDir="down" spark={[3,2.8,2.9,2.6,2.5,2.4,2.3,2.2,2.1,2.0,1.9,1.9,1.8,1.8]} sparkColor="#fb7185" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.62fr 1fr', marginBottom: 'var(--gap)', alignItems: 'stretch' }}>
        <div className="card vsp-rise">
          <div className="card-head">
            <div>
              <h3>Revenue</h3>
              <div className="eyebrow" style={{ marginTop: 2 }}>Gross MRR · last 30 days</div>
            </div>
            <div className="vsp-top-spacer" />
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Legend color="var(--accent)" label="This period" />
              <Legend color="var(--text-faint)" label="Previous" dashed />
            </div>
          </div>
          <div className="card-pad">
            <AreaChart series={[revenue30, revenuePrev]} labels={dayLabels} dual color2="var(--text-faint)" height={258} />
          </div>
        </div>

        <div className="card vsp-rise">
          <div className="card-head"><h3>Acquisition</h3><div className="vsp-top-spacer" /><span className="badge badge-info">4 channels</span></div>
          <div className="card-pad">
            <Donut data={channelDonut} />
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div><div className="eyebrow">Total visits</div><div className="tnum" style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>9,420</div></div>
              <div style={{ textAlign: 'right' }}><div className="eyebrow">Conv. rate</div><div className="tnum" style={{ fontSize: 20, fontWeight: 700, marginTop: 2, color: 'var(--success)' }}>4.6%</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.3fr 1fr 1fr' }}>
        <ActivityCard />
        <TasksCard />
        <TopAccountsCard />
      </div>
    </div>
  );
}

function Legend({ color, label, dashed }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'var(--text-dim)' }}>
      <span style={{ width: 16, height: 0, borderTop: `2px ${dashed ? 'dashed' : 'solid'} ${color}` }} />{label}
    </span>
  );
}

function ActivityCard() {
  const toneColor = { pos: 'var(--success)', neg: 'var(--danger)', warn: 'var(--warning)', info: 'var(--accent)' };
  return (
    <div className="card vsp-rise">
      <div className="card-head"><h3>Activity</h3><div className="vsp-top-spacer" /><button className="btn btn-subtle btn-sm">View all<Icon.chevRight style={{ width: 13, height: 13 }} /></button></div>
      <div style={{ padding: '6px var(--pad) 12px' }}>
        {ACTIVITY.map((a, i) => {
          const I = Icon[a.icon];
          return (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border)' : 0, alignItems: 'flex-start' }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'grid', placeItems: 'center', marginTop: 1,
                background: `color-mix(in oklab, ${toneColor[a.tone]} 14%, transparent)`, color: toneColor[a.tone] }}>
                <I style={{ width: 15, height: 15 }} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, lineHeight: 1.45 }}>
                  <b style={{ fontWeight: 700 }}>{a.who}</b> <span style={{ color: 'var(--text-dim)' }}>{a.action}</span> <b style={{ fontWeight: 600, color: toneColor[a.tone] }}>{a.target}</b>
                </div>
                <div className="eyebrow" style={{ marginTop: 3 }}>{a.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TasksCard() {
  const [tasks, setTasks] = useStateM(TASKS);
  const toggle = (i) => setTasks(t => t.map((x, j) => j === i ? { ...x, done: !x.done } : x));
  const done = tasks.filter(t => t.done).length;
  return (
    <div className="card vsp-rise">
      <div className="card-head"><h3>My tasks</h3><div className="vsp-top-spacer" /><span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{done}/{tasks.length}</span></div>
      <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div className="meter" style={{ marginBottom: 12 }}><i style={{ width: `${done/tasks.length*100}%`, transition: 'width .3s' }} /></div>
        {tasks.map((t, i) => (
          <button key={i} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 8px', borderRadius: 'var(--r-sm)', border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ width: 19, height: 19, borderRadius: 6, flexShrink: 0, display: 'grid', placeItems: 'center',
              border: t.done ? 0 : '1.6px solid var(--border-strong)', background: t.done ? 'var(--accent)' : 'transparent', color: '#fff', transition: 'all .15s' }}>
              {t.done && <Icon.check style={{ width: 13, height: 13 }} />}
            </span>
            <span style={{ flex: 1, fontSize: 13, color: t.done ? 'var(--text-faint)' : 'var(--text)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.label}</span>
            <span className="badge badge-muted">{t.tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopAccountsCard() {
  const top = [...CUSTOMERS].sort((a, b) => b.mrr - a.mrr).slice(0, 5);
  const maxM = top[0].mrr;
  return (
    <div className="card vsp-rise">
      <div className="card-head"><h3>Top accounts</h3><div className="vsp-top-spacer" /><Icon.trend style={{ width: 16, height: 16, color: 'var(--accent)' }} /></div>
      <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {top.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <Av name={c.company} hue={c.hue} size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.company}</div>
              <div className="meter" style={{ marginTop: 5, height: 4 }}><i style={{ width: `${c.mrr/maxM*100}%` }} /></div>
            </div>
            <div className="tnum mono" style={{ fontSize: 12.5, fontWeight: 600 }}>${(c.mrr/1000).toFixed(1)}k</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================= ANALYTICS ============================= */
function AnalyticsScreen() {
  const [metric, setMetric] = useStateM('Revenue');
  return (
    <div className="vsp-content-inner">
      <PageToolbar right={<button className="btn btn-ghost btn-sm"><Icon.refresh />Refresh</button>}>
        <DateRange />
        <Segmented options={['Revenue','Signups','Sessions']} value={metric} onChange={setMetric} />
      </PageToolbar>

      <div className="grid stat-grid" style={{ marginBottom: 'var(--gap)' }}>
        <StatCard icon="eye" label="Page views" value="1.24M" delta="9.2%" deltaDir="up" spark={trafficBars.slice(-10).map(x=>x/10)} />
        <StatCard icon="users" label="Unique visitors" value="284k" delta="4.7%" deltaDir="up" spark={[20,22,21,24,26,25,28,30,29,32]} sparkColor="var(--accent-2)" />
        <StatCard icon="clock" label="Avg. session" value="4m 12s" delta="3.1%" deltaDir="up" spark={[3,3.2,3.4,3.3,3.6,3.8,3.9,4.0,4.1,4.2]} sparkColor="#34d399" />
        <StatCard icon="trend" label="Bounce rate" value="32.4%" delta="1.2%" deltaDir="down" spark={[40,39,38,37,36,35,34,34,33,32]} sparkColor="#fb7185" />
      </div>

      <div className="card vsp-rise" style={{ marginBottom: 'var(--gap)' }}>
        <div className="card-head"><h3>{metric} over time</h3><div className="vsp-top-spacer" /><span className="badge badge-info">Live</span></div>
        <div className="card-pad"><AreaChart series={[revenue30]} labels={dayLabels} height={300} /></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div className="card vsp-rise">
          <div className="card-head"><h3>Monthly sessions</h3></div>
          <div className="card-pad"><BarChart data={trafficBars} labels={monthLabels} height={220} /></div>
        </div>
        <div className="card vsp-rise">
          <div className="card-head"><h3>By channel</h3></div>
          <div className="card-pad"><Donut data={channelDonut} size={150} /></div>
        </div>
        <div className="card vsp-rise">
          <div className="card-head"><h3>Top pages</h3></div>
          <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[['/dashboard',4280,42],['/pricing',3120,30],['/docs/api',1980,19],['/changelog',1240,12],['/login',860,8]].map(([p,v,pct],i)=>(
              <div key={i} style={{ padding: '10px 0', borderBottom: i<4?'1px solid var(--border)':0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, marginBottom:6 }}>
                  <span className="mono" style={{ color:'var(--text-dim)' }}>{p}</span>
                  <span className="tnum" style={{ fontWeight:600 }}>{niceNum(v)}</span>
                </div>
                <div className="meter" style={{ height:4 }}><i style={{ width:`${pct*2.2}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, AnalyticsScreen });
