import { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import './panels.css';

export default function ResourcePoolPanel() {
  const { simState, updateConfig } = useSimulation();
  const { total, used, available, utilization } = simState.resources;
  const { mode } = simState.config;
  const isRunning = simState.state === 'running';

  const [inputVal, setInputVal]   = useState(total);
  const [loading, setLoading]     = useState(false);
  const [feedback, setFeedback]   = useState(null); // { type: 'success'|'error', text }

  // Keep input in sync when snapshot updates (e.g. after scenario load)
  useEffect(() => { setInputVal(total); }, [total]);

  const handleUpdate = async () => {
    const val = Number(inputVal);
    if (!Number.isInteger(val) || val < 1) {
      setFeedback({ type: 'error', text: 'Must be a positive integer' });
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      await updateConfig({ totalResources: val });
      setFeedback({ type: 'success', text: `Updated to ${val}` });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Update failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const label     = mode === 'cloud' ? 'CPU Slots' : 'ICU Beds';
  const fillColor = utilization > 85 ? 'var(--red)' : utilization > 60 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Resource Pool</span>
        <span className="badge badge-queued">{mode === 'cloud' ? '☁ Cloud' : '🏥 Hospital'}</span>
      </div>

      <div className="resource-stats">
        <StatBox label="Total"     value={total}              color="var(--text-secondary)" />
        <StatBox label="In Use"    value={used}               color="var(--red)" />
        <StatBox label="Available" value={available}          color="var(--green)" />
        <StatBox label="Util %"    value={`${utilization}%`}  color={fillColor} />
      </div>

      {/* ── Dynamic resource editor ── */}
      <div className="resource-editor">
        <div className="resource-editor-row">
          <div className="resource-editor-field">
            <label className="form-label">
              Total {label}
              {isRunning && (
                <span className="resource-editor-tooltip" title="Pause the simulation to change resources">
                  ⚠ Pause to edit
                </span>
              )}
            </label>
            <input
              className="form-input"
              type="number"
              min={1}
              value={inputVal}
              onChange={e => { setInputVal(e.target.value); setFeedback(null); }}
              disabled={isRunning || loading}
              title={isRunning ? 'You can only change resources when simulation is paused or idle' : ''}
            />
          </div>
          <button
            className="btn btn-primary btn-sm resource-editor-btn"
            onClick={handleUpdate}
            disabled={isRunning || loading || Number(inputVal) === total}
            title={isRunning ? 'Pause the simulation first' : 'Apply new resource count'}
          >
            {loading ? '…' : 'Apply'}
          </button>
        </div>

        {feedback && (
          <p className={`resource-editor-msg ${feedback.type}`}>
            {feedback.type === 'success' ? '✓' : '✗'} {feedback.text}
          </p>
        )}
      </div>

      {/* ── Utilization bar ── */}
      <div style={{ marginTop: 10 }}>
        <div className="flex justify-between text-sm" style={{ marginBottom: 6, color: 'var(--text-muted)' }}>
          <span>Utilization</span>
          <span style={{ color: fillColor, fontWeight: 600 }}>{utilization}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${utilization}%`, background: fillColor }} />
        </div>
      </div>

      {/* ── Unit grid ── */}
      <div className="resource-units" style={{ marginTop: 14 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`resource-unit ${i < used ? 'used' : 'free'}`}
            title={i < used ? `${label} ${i + 1}: In Use` : `${label} ${i + 1}: Free`}
          />
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
