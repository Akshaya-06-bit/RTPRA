import { useSimulation } from '../../context/SimulationContext';
import { priorityColor } from '../../utils/helpers';
import './panels.css';

export default function RunningPanel() {
  const { simState } = useSimulation();
  const running = simState.running || [];

  return (
    <div className="card panel-card">
      <div className="card-header">
        <span className="card-title">Running Tasks</span>
        <span className="badge badge-running">{running.length} active</span>
      </div>
      {running.length === 0 ? (
        <div className="empty-state"><span>💤</span><span>No tasks running</span></div>
      ) : (
        <div className="scroll-panel">
          {running.map(task => {
            const pct = task.duration > 0
              ? Math.round(((task.duration - task.remainingDuration) / task.duration) * 100)
              : 100;
            return (
              <div key={task._id} className={`running-task-card fade-in ${task.wasPreempted ? 'was-preempted' : ''}`}>
                <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                  <div className="flex items-center gap-2">
                    <span className="pulse" style={{ color: 'var(--green)', fontSize: 10 }}>●</span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{task.taskName}</span>
                    {task.wasPreempted && <span className="badge badge-preempted text-xs">resumed</span>}
                  </div>
                  <span style={{ color: priorityColor(task.effectivePriority), fontWeight: 700, fontSize: 12 }}>
                    EP: {task.effectivePriority?.toFixed(1)}
                  </span>
                </div>
                <div className="progress-bar" style={{ marginBottom: 4 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--green)' }} />
                </div>
                <div className="flex justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span>{task.remainingDuration}t remaining</span>
                  <span>{task.resourceUnitsRequired} units · deadline {task.deadlineTick}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
