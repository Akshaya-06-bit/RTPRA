import { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import './panels.css';

const TABS = ['completed', 'failed'];

export default function CompletedPanel() {
  const { simState } = useSimulation();
  const [tab, setTab] = useState('completed');

  const items = tab === 'completed' ? (simState.completed || []) : (simState.failed || []);
  const reversed = [...items].reverse();

  return (
    <div className="card panel-card">
      <div className="card-header">
        <span className="card-title">History</span>
        <div className="tab-group">
          {TABS.map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'completed' ? `✓ Done (${simState.completed?.length || 0})` : `✗ Failed (${simState.failed?.length || 0})`}
            </button>
          ))}
        </div>
      </div>
      {reversed.length === 0 ? (
        <div className="empty-state"><span>{tab === 'completed' ? '📋' : '⚠️'}</span><span>No {tab} tasks yet</span></div>
      ) : (
        <div className="scroll-panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Wait</th>
                <th>Preempted</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {reversed.slice(0, 50).map(task => (
                <tr key={task._id} className="fade-in">
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`priority-dot p${task.basePriority}`} />
                      <span className="truncate" style={{ maxWidth: 120 }}>{task.taskName}</span>
                    </div>
                  </td>
                  <td><span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{task.waitTime}t</td>
                  <td style={{ color: task.wasPreempted ? 'var(--yellow)' : 'var(--text-muted)' }}>
                    {task.wasPreempted ? `${task.preemptionCount}×` : '—'}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {task.completedAtTick != null ? `tick ${task.completedAtTick}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
