import { useSimulation } from '../../context/SimulationContext';
import { priorityColor, priorityLabel } from '../../utils/helpers';
import './panels.css';

export default function QueuePanel() {
  const { simState } = useSimulation();
  const queue = simState.queue || [];

  return (
    <div className="card panel-card">
      <div className="card-header">
        <span className="card-title">Scheduler Queue</span>
        <span className="badge badge-queued">{queue.length} waiting</span>
      </div>
      {queue.length === 0 ? (
        <div className="empty-state"><span>📭</span><span>Queue is empty</span></div>
      ) : (
        <div className="scroll-panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Base P</th>
                <th>Eff P</th>
                <th>Deadline</th>
                <th>Wait</th>
                <th>Res</th>
                <th>Aging</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(task => (
                <tr key={task._id} className="fade-in">
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`priority-dot p${task.basePriority}`} />
                      <span className="truncate" style={{ maxWidth: 120 }}>{task.taskName}</span>
                      {task.urgency && <span className="badge badge-missed_deadline text-xs">!</span>}
                    </div>
                  </td>
                  <td><span style={{ color: priorityColor(task.basePriority), fontWeight: 600 }}>{task.basePriority}</span></td>
                  <td><span style={{ color: priorityColor(task.effectivePriority), fontWeight: 700 }}>{task.effectivePriority?.toFixed(1)}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{task.deadlineTick}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{task.waitTime}t</td>
                  <td><span className="badge badge-queued">{task.resourceUnitsRequired}</span></td>
                  <td>
                    {task.agingBoost > 0
                      ? <span style={{ color: 'var(--yellow)', fontSize: 11 }}>+{task.agingBoost.toFixed(1)}</span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>}
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
