// icons.jsx — lightweight stroke icon set (Lucide-style geometry), currentColor.
const _i = (paths, extra = {}) => (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" {...extra} {...props}>
    {paths}
  </svg>
);

const Icon = {
  grid: _i(<><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>),
  table: _i(<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14.5h18M9 9v11"/></>),
  chart: _i(<><path d="M3 3v18h18"/><path d="M7 14l3-4 3 3 4-7"/></>),
  user: _i(<><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></>),
  users: _i(<><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.2a3 3 0 0 1 0 5.6M21 20a6 6 0 0 0-4-5.6"/></>),
  settings: _i(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1H2a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 3.6 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H8a1.7 1.7 0 0 0 1-1.56V2a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V8a1.7 1.7 0 0 0 1.56 1H22a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/></>),
  search: _i(<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>),
  bell: _i(<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>),
  search2: _i(<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>),
  plus: _i(<path d="M12 5v14M5 12h14"/>),
  arrowUp: _i(<path d="M12 19V5M6 11l6-6 6 6"/>),
  arrowDown: _i(<path d="M12 5v14M6 13l6 6 6-6"/>),
  arrowRight: _i(<path d="M5 12h14M13 6l6 6-6 6"/>),
  chevDown: _i(<path d="m6 9 6 6 6-6"/>),
  chevRight: _i(<path d="m9 6 6 6-6 6"/>),
  chevLeft: _i(<path d="m15 6-6 6 6 6"/>),
  more: _i(<><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>),
  filter: _i(<path d="M3 5h18l-7 8v6l-4-2v-4z"/>),
  download: _i(<><path d="M12 4v11M7 11l5 5 5-5"/><path d="M5 20h14"/></>),
  sun: _i(<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></>),
  moon: _i(<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"/>),
  bolt: _i(<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>),
  dollar: _i(<><path d="M12 2v20"/><path d="M17 6.5C17 4.6 14.8 4 12 4S7 4.9 7 7.5 9.5 11 12 11.5s5 1 5 4-2.2 3.5-5 3.5-5-.9-5-2.5"/></>),
  cart: _i(<><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 12.2a1.5 1.5 0 0 0 1.5 1.3h8.3a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/></>),
  pulse: _i(<path d="M2 12h4l3-8 4 16 3-8h6"/>),
  globe: _i(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></>),
  check: _i(<path d="m20 6-11 11-5-5"/>),
  checkCircle: _i(<><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></>),
  x: _i(<path d="M6 6l12 12M18 6 6 18"/>),
  clock: _i(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>),
  calendar: _i(<><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></>),
  mail: _i(<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>),
  doc: _i(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></>),
  inbox: _i(<><path d="M3 12h5l2 3h4l2-3h5"/><path d="M5 5h14l2 7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z"/></>),
  layers: _i(<><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5" opacity=".5"/></>),
  shield: _i(<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>),
  logout: _i(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></>),
  trend: _i(<path d="M3 17l6-6 4 4 8-8M21 7v5h-5"/>),
  sparkle: _i(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>),
  pin: _i(<><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></>),
  card: _i(<><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></>),
  refresh: _i(<><path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 4v5h-5"/></>),
  eye: _i(<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>),
  zap: _i(<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>),
  database: _i(<><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>),
};

window.Icon = Icon;
