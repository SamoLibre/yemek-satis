// Returns YYYY-MM-DD in local time
export function getDateKey(date: string|Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const tzOffset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - tzOffset);
  return local.toISOString().slice(0, 10);
}
