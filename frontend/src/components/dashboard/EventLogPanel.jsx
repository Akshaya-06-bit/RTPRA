import { useSimulation } from '../../context/SimulationContext';
import './panels.css';

const LOG_COLORS = {
  task_added:            'var(--blue)',
  task_started:          'var(--green)',
  task_completed:        'var(--accent-bright)',
  task_preempted:        'var(--yellow)',
  task_resumed:          'var(--yellow)',
  task_missed_deadline:  'var(--red)',
  task_rejected:         'var(--orange)',
  priority_boosted:      'var(--purple)',
  simulation_started:    'var(--green)',
  simulation_paused:     'var(--yellow)',
  simulation_resumed:    'var(--green)',
  simulation_reset:      'var(--text-muted)',
  resource_update:       'var(--text-secondary)',
};

const LOG_ICONS = {
  task_added:            '＋',
  task_started:          '▶',
  task_completed:        '✓',
  task_preempted:        '⏸',
  task_resumed:          '▶',
  task_missed_deadline:  '✗',
  task_rejected:         '⊘',
  priority_boosted:      '↑',
  simulation_started:    '▶',
  simulation_paused:     '⏸',
  simulation_resumed:    '▶',
  simulation_reset:      '↺',
};

export default function EventLogPanel() {
  const { simState } = useSimulation();
  const logs = [...(simState.eventLog || [])].reverse();

  return (
    <div className="card panel-card">
      <div className="card-header">
        <span className="card-title">Event Log</span>
        <span className="badge badge-queued">{logs.length} events</span>
      </div>
      {logs.length === 0 ? (
        <div className="empty-state"><span>📜</span><span>No events yet</span></div>
      ) : (
        <div className="scroll-panel log-panel">
          {logs.slice(0, 80).map(entry => (
            <div key={entry.id} className="log-entry fade-in">
              <span className="log-tick">t{entry.tick}</span>
              <span className="log-icon" style={{ color: LOG_COLORS[entry.type] || 'var(--text-muted)' }}>
                {LOG_ICONS[entry.type] || '·'}
              </span>
              <span className="log-msg" style={{ color: LOG_COLORS[entry.type] || 'var(--text-secondary)' }}>
                {entry.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
