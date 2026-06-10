// data.jsx — mock datasets for the admin template.
const revenue30 = [38,42,40,46,44,52,49,55,58,54,62,60,68,66,72,70,78,74,82,80,88,85,92,90,98,95,104,101,112,118];
const revenuePrev = [30,33,31,36,35,40,38,43,45,42,48,47,52,50,55,53,58,56,61,60,64,62,67,65,69,67,72,70,75,78];
const dayLabels = ['May 12','','May 16','','May 20','','May 24','','May 28','','Jun 1','','Jun 5','','Jun 9'];

const trafficBars = [320,410,380,520,490,610,580,720,690,640,780,810];
const monthLabels = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];

const channelDonut = [
  { label: 'Organic search', value: 4280, color: 'var(--accent)' },
  { label: 'Direct', value: 2640, color: 'var(--accent-2)' },
  { label: 'Referral', value: 1520, color: '#34d399' },
  { label: 'Social', value: 980, color: '#fbbf24' },
];

const STATUSES = {
  active:    { label: 'Active',   cls: 'badge-pos' },
  trial:     { label: 'Trial',    cls: 'badge-info' },
  pending:   { label: 'Pending',  cls: 'badge-warn' },
  churned:   { label: 'Churned',  cls: 'badge-neg' },
  paused:    { label: 'Paused',   cls: 'badge-muted' },
};

const PLANS = ['Enterprise', 'Growth', 'Pro', 'Starter'];

const FIRST = ['Maya','Leo','Aria','Kenji','Noor','Diego','Saanvi','Theo','Lena','Omar','Ivy','Hugo','Zara','Felix','Nadia','Cole','Priya','Soren','Mila','Rhys','Talia','Ravi','Esme','Jonah'];
const LAST = ['Okafor','Vega','Lindqvist','Tanaka','Haddad','Moreau','Iyer','Novak','Berg','Khalil','Sato','Brandt','Costa','Aaltonen','Reyes','Park','Mensah','Dahl','Ferro','Quinn'];
const COMPANIES = ['Northwind','Lumen Labs','Vertex AI','Halcyon','Atlas Foundry','Beacon','Orbital','Cobalt','Driftwood','Meridian','Solstice','Pinecone','Aperture','Forge','Helix','Tessellate'];

function seedCustomers(n = 42) {
  const rng = (() => { let s = 7; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })();
  const out = [];
  for (let i = 0; i < n; i++) {
    const fn = FIRST[Math.floor(rng() * FIRST.length)];
    const ln = LAST[Math.floor(rng() * LAST.length)];
    const statusKeys = Object.keys(STATUSES);
    const status = statusKeys[Math.floor(rng() * statusKeys.length)];
    const mrr = Math.round((rng() * 1900 + 90) / 10) * 10;
    out.push({
      id: 'ATG-' + (4810 + i),
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}@${COMPANIES[Math.floor(rng()*COMPANIES.length)].toLowerCase().replace(/\s/g,'')}.com`,
      company: COMPANIES[Math.floor(rng() * COMPANIES.length)],
      plan: PLANS[Math.floor(rng() * PLANS.length)],
      status,
      mrr,
      hue: Math.floor(rng() * 360),
      seats: Math.floor(rng() * 80) + 1,
      usage: Math.floor(rng() * 100),
      joined: `${2024 + Math.floor(rng()*2)}-${String(Math.floor(rng()*12)+1).padStart(2,'0')}-${String(Math.floor(rng()*27)+1).padStart(2,'0')}`,
      spark: Array.from({ length: 12 }, () => Math.floor(rng() * 60) + 20),
    });
  }
  return out;
}
const CUSTOMERS = seedCustomers(42);

const ACTIVITY = [
  { who: 'Maya Okafor', hue: 220, action: 'upgraded to', target: 'Enterprise', time: '2m ago', icon: 'arrowUp', tone: 'pos' },
  { who: 'Vertex AI', hue: 280, action: 'created a new', target: 'workspace', time: '14m ago', icon: 'plus', tone: 'info' },
  { who: 'Leo Vega', hue: 150, action: 'invited 4 members to', target: 'Halcyon', time: '38m ago', icon: 'users', tone: 'info' },
  { who: 'Billing', hue: 40, action: 'flagged a failed payment for', target: 'Cobalt', time: '1h ago', icon: 'bell', tone: 'warn' },
  { who: 'Kenji Tanaka', hue: 320, action: 'churned from', target: 'Pro', time: '3h ago', icon: 'arrowDown', tone: 'neg' },
  { who: 'Atlas Foundry', hue: 200, action: 'connected the', target: 'API', time: '5h ago', icon: 'bolt', tone: 'info' },
];

const TASKS = [
  { label: 'Review Q2 expansion cohort', done: false, tag: 'Revenue' },
  { label: 'Approve Halcyon seat increase', done: false, tag: 'Accounts' },
  { label: 'Ship usage-based billing flag', done: true, tag: 'Product' },
  { label: 'Reconcile June invoices', done: false, tag: 'Finance' },
];

Object.assign(window, { revenue30, revenuePrev, dayLabels, trafficBars, monthLabels, channelDonut, STATUSES, PLANS, CUSTOMERS, ACTIVITY, TASKS });
