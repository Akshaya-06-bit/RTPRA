import { useSimulation } from '../../context/SimulationContext';
import './panels.css';

export default function ResourcePoolPanel() {
  const { simState } = useSimulation();
  const { total, used, available, utilization } = simState.resources;
  const { mode } = simState.config;

  const label = mode === 'cloud' ? 'CPU Slots' : 'ICU Beds';
  const fillColor = utilization > 85 ? 'var(--red)' : utilization > 60 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Resource Pool</span>
        <span className="badge badge-queued">{mode === 'cloud' ? '☁ Cloud' : '🏥 Hospital'}</span>
      </div>

      <div className="resource-stats">
        <StatBox label="Total"     value={total}     color="var(--text-secondary)" />
        <StatBox label="In Use"    value={used}      color="var(--red)" />
        <StatBox label="Available" value={available} color="var(--green)" />
        <StatBox label="Util %"    value={`${utilization}%`} color={fillColor} />
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="flex justify-between text-sm" style={{ marginBottom: 6, color: 'var(--text-muted)' }}>
          <span>Utilization</span>
          <span style={{ color: fillColor, fontWeight: 600 }}>{utilization}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${utilization}%`, background: fillColor }} />
        </div>
      </div>

      <div className="resource-units" style={{ marginTop: 14 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`resource-unit ${i < used ? 'used' : 'free'}`}
            title={i < used ? `${label} ${i + 1}: In Use` : `${label} ${i + 1}: Free`} />
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="stat-box">
      <span className="stat-value" style={{ color }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
