import { useSimulation } from '../../context/SimulationContext';
import './scheduler.css';

export default function PolicyInfoPanel() {
  const { simState } = useSimulation();
  const { config, currentTick } = simState;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Scheduler Policy</span>
      </div>
      <div className="policy-grid">
        <PolicyRow label="Current Tick"       value={currentTick} />
        <PolicyRow label="Mode"               value={config.mode === 'cloud' ? '☁ Cloud' : '🏥 Hospital'} />
        <PolicyRow label="Total Resources"    value={config.totalResources} />
        <PolicyRow label="Preemption"         value={config.preemptionEnabled ? '✓ Enabled' : '✗ Disabled'}
          color={config.preemptionEnabled ? 'var(--green)' : 'var(--red)'} />
        <PolicyRow label="Anti-Starvation"    value={config.antiStarvationEnabled ? '✓ Enabled' : '✗ Disabled'}
          color={config.antiStarvationEnabled ? 'var(--green)' : 'var(--red)'} />
        <PolicyRow label="Aging Interval"     value={`Every ${config.agingIntervalTicks ?? 3} ticks`} />
        <PolicyRow label="Aging Boost"        value={`+${config.agingBoostAmount ?? 0.5} / interval`} />
        <PolicyRow label="Max Eff. Priority"  value={config.maxEffectivePriority ?? 10} />
        <PolicyRow label="Speed"              value={`${config.speedMultiplier ?? 1}×`} />
      </div>
      <div className="policy-formula">
        <span className="form-label">Effective Priority Formula</span>
        <code>EP = basePriority + agingBoost + (urgency ? 1.5 : 0)</code>
      </div>
      <div className="policy-formula">
        <span className="form-label">Scheduling Order</span>
        <code>1° Highest EP → 2° Earliest Deadline → 3° Earliest Arrival</code>
      </div>
    </div>
  );
}

function PolicyRow({ label, value, color }) {
  return (
    <div className="policy-row">
      <span className="policy-label">{label}</span>
      <span className="policy-value" style={{ color: color || 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
