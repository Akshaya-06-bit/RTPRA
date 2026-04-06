import { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import './scheduler.css';

export default function ScenarioPanel() {
  const { scenarios, loadScenario } = useSimulation();
  const [loading, setLoading] = useState(null);
  const [msg, setMsg]         = useState('');

  const handleLoad = async (id) => {
    setLoading(id);
    setMsg('');
    try {
      await loadScenario(id);
      setMsg(`✓ Scenario loaded`);
    } catch {
      setMsg('Failed to load scenario');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Scenario Templates</span>
      </div>
      <div className="scenario-list">
        {scenarios.map(s => (
          <div key={s.id} className="scenario-item">
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.description}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => handleLoad(s.id)} disabled={loading === s.id}>
              {loading === s.id ? '…' : 'Load'}
            </button>
          </div>
        ))}
      </div>
      {msg && <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 8 }}>{msg}</p>}
    </div>
  );
}
