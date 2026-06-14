// Pure date helpers shared by Calendar / DatePicker / DateRangePicker.
export const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Format a date like "Jan 5, 2026". */
export const fmtDate = (d) =>
  d ? `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}` : '';

export const sameDay = (a, b) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const nightsBetween = (a, b) =>
  Math.abs(Math.round((stripTime(b).getTime() - stripTime(a).getTime()) / 86400000));

/**
 * Flexible date matcher used by the pickers' `disabled` prop. Accepts a `Date`,
 * `Date[]`, `{ from, to }`, `{ before }`, `{ after }`, `{ dayOfWeek: [0,6] }`,
 * a `(date) => boolean` predicate, or an array of any of these (any match wins).
 */
export function matchesDate(d, matcher) {
  if (!matcher) return false;
  if (Array.isArray(matcher)) return matcher.some((m) => matchesDate(d, m));
  if (matcher instanceof Date) return sameDay(d, matcher);
  if (typeof matcher === 'function') return matcher(d);
  const x = stripTime(d);
  if ('from' in matcher && 'to' in matcher)
    return x >= stripTime(matcher.from) && x <= stripTime(matcher.to);
  if ('before' in matcher) return x < stripTime(matcher.before);
  if ('after' in matcher) return x > stripTime(matcher.after);
  if ('dayOfWeek' in matcher) return matcher.dayOfWeek.includes(d.getDay());
  return false;
}

export function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const days = [];
  for (let i = first.getDay(); i > 0; i--)
    days.push({ dt: new Date(year, month, 1 - i), muted: true });
  const dim = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= dim; d++) days.push({ dt: new Date(year, month, d) });
  while (days.length < 42) {
    const last = days[days.length - 1].dt;
    const nd = new Date(last);
    nd.setDate(nd.getDate() + 1);
    days.push({ dt: nd, muted: true });
  }
  return days;
}
