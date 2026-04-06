import { useState } from 'react';
import { tasksAPI } from '../../api';
import { useSimulation } from '../../context/SimulationContext';
import './scheduler.css';

const DEFAULTS = {
  taskName: '', taskType: 'generic', basePriority: 3,
  arrivalTick: 0, deadlineTick: 20, duration: 5,
  resourceUnitsRequired: 1, urgency: false,
};

export default function TaskForm() {
  const { simState } = useSimulation();
  const [form, setForm]     = useState({ ...DEFAULTS, arrivalTick: simState.currentTick });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]       = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await tasksAPI.create({ ...form, arrivalTick: simState.currentTick });
      setMsg({ type: 'success', text: `"${form.taskName}" added to queue` });
      setForm({ ...DEFAULTS, arrivalTick: simState.currentTick });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.errors?.[0]?.msg || 'Failed to add task' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Add Task</span>
      </div>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Task Name *</label>
            <input className="form-input" placeholder="e.g. Patient A" value={form.taskName}
              onChange={e => set('taskName', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={form.taskType} onChange={e => set('taskType', e.target.value)}>
              {['generic','ICU','compute','realtime','batch','routine','critical'].map(t =>
                <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row-3">
          <div className="form-group">
            <label className="form-label">Priority (1-5)</label>
            <input className="form-input" type="number" min={1} max={5} value={form.basePriority}
              onChange={e => set('basePriority', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (ticks)</label>
            <input className="form-input" type="number" min={1} value={form.duration}
              onChange={e => set('duration', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Deadline (tick)</label>
            <input className="form-input" type="number" min={1} value={form.deadlineTick}
              onChange={e => set('deadlineTick', Number(e.target.value))} />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Resource Units</label>
            <input className="form-input" type="number" min={1} max={20} value={form.resourceUnitsRequired}
              onChange={e => set('resourceUnitsRequired', Number(e.target.value))} />
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <label className="form-label">Urgency Flag</label>
            <label className="urgency-toggle">
              <input type="checkbox" checked={form.urgency} onChange={e => set('urgency', e.target.checked)} />
              <span className="urgency-slider" />
              <span style={{ marginLeft: 8, fontSize: 12, color: form.urgency ? 'var(--red)' : 'var(--text-muted)' }}>
                {form.urgency ? '🚨 Urgent' : 'Normal'}
              </span>
            </label>
          </div>
        </div>

        {msg && (
          <p style={{ fontSize: 12, color: msg.type === 'success' ? 'var(--green)' : 'var(--red)' }}>
            {msg.text}
          </p>
        )}

        <button className="btn btn-primary w-full" type="submit" disabled={loading}>
          {loading ? 'Adding…' : '+ Add to Queue'}
        </button>
      </form>
    </div>
  );
}
