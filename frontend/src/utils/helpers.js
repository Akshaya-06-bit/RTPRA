export function priorityColor(p) {
  if (p >= 8)  return 'var(--red)';
  if (p >= 5)  return 'var(--orange)';
  if (p >= 4)  return 'var(--yellow)';
  if (p >= 3)  return 'var(--blue)';
  if (p >= 2)  return 'var(--text-secondary)';
  return 'var(--text-muted)';
}

export function priorityLabel(p) {
  const labels = { 1: 'Low', 2: 'Below Normal', 3: 'Normal', 4: 'High', 5: 'Critical' };
  return labels[Math.round(p)] || 'Unknown';
}

export function statusColor(status) {
  const map = {
    queued:           'var(--blue)',
    running:          'var(--green)',
    completed:        'var(--accent-bright)',
    missed_deadline:  'var(--red)',
    rejected:         'var(--orange)',
  };
  return map[status] || 'var(--text-muted)';
}
