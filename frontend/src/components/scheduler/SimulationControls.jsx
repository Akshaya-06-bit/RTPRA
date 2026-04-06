import { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import './scheduler.css';

const SPEEDS = [1, 2, 5];

export default function SimulationControls() {
  const { simState, start, pause, resume, reset, setSpeed, updateConfig } = useSimulation();
  const { state, config } = simState;
  const [localConfig, setLocalConfig] = useState({
    totalResources: 10,
    mode: 'hospital',
    preemptionEnabled: true,
    antiStarvationEnabled: true,
  });

  const handleStart = () => start(localConfig);
  const handleToggle = (key) => {
    const updated = { ...localConfig, [key]: !localConfig[key] };
    setLocalConfig(updated);
    if (state !== 'idle') updateConfig(updated);
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Simulation Controls</span>
        <span className="tick-badge">Tick {simState.currentTick}</span>
      </div>

      <div className="controls-grid">
        {/* Config row */}
        <div className="config-row">
          <div className="form-group">
            <label className="form-label">Resources</label>
            <input className="form-input" type="number" min={1} max={20}
              value={localConfig.totalResources}
              onChange={e => setLocalConfig(p => ({ ...p, totalResources: Number(e.target.value) }))}
              disabled={state !== 'idle'} />
          </div>
          <div className="form-group">
            <label className="form-label">Mode</label>
            <select className="form-input"
              value={localConfig.mode}
              onChange={e => setLocalConfig(p => ({ ...p, mode: e.target.value }))}
              disabled={state !== 'idle'}>
              <option value="hospital">🏥 Hospital</option>
              <option value="cloud">☁ Cloud</option>
            </select>
          </div>
        </div>

        {/* Toggle row */}
        <div className="toggle-row">
          <ToggleChip
            label="Preemption"
            active={localConfig.preemptionEnabled}
            onClick={() => handleToggle('preemptionEnabled')} />
          <ToggleChip
            label="Anti-Starvation"
            active={localConfig.antiStarvationEnabled}
            onClick={() => handleToggle('antiStarvationEnabled')} />
        </div>

        {/* Action buttons */}
        <div className="action-row">
          {state === 'idle' && (
            <button className="btn btn-success" onClick={handleStart}>▶ Start</button>
          )}
          {state === 'running' && (
            <button className="btn btn-warning" onClick={pause}>⏸ Pause</button>
          )}
          {state === 'paused' && (
            <button className="btn btn-success" onClick={resume}>▶ Resume</button>
          )}
          <button className="btn btn-danger" onClick={reset} disabled={state === 'idle'}>↺ Reset</button>
        </div>

        {/* Speed control */}
        <div className="speed-row">
          <span className="form-label">Speed:</span>
          {SPEEDS.map(s => (
            <button key={s}
              className={`btn btn-ghost btn-sm ${config.speedMultiplier === s ? 'speed-active' : ''}`}
              onClick={() => setSpeed(s)}
              disabled={state === 'idle'}>
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToggleChip({ label, active, onClick }) {
  return (
    <button className={`toggle-chip ${active ? 'on' : 'off'}`} onClick={onClick}>
      <span className="toggle-dot" />
      {label}
    </button>
  );
}
