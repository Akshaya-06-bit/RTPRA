import { useSimulation } from '../../context/SimulationContext';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import './panels.css';

const TIP_STYLE = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  fontSize: 12,
  color: 'var(--text-primary)',
};

export default function MetricsPanel() {
  const { simState } = useSimulation();
  const { metrics, chartData } = simState;
  const { utilizationHistory = [], completedHistory = [], missedHistory = [], throughputHistory = [] } = chartData || {};

  return (
    <div className="metrics-section">
      {/* Summary cards */}
      <div className="metrics-summary">
        <MetricCard label="Completed"          value={metrics?.totalCompleted ?? 0}       color="var(--green)" />
        <MetricCard label="Missed Deadlines"   value={metrics?.totalMissedDeadlines ?? 0} color="var(--red)" />
        <MetricCard label="Preemptions"        value={metrics?.totalPreemptions ?? 0}     color="var(--yellow)" />
        <MetricCard label="Starvation Prevented" value={metrics?.starvationPrevented ?? 0} color="var(--purple)" />
        <MetricCard label="Avg Wait Time"      value={`${metrics?.averageWaitTime ?? 0}t`} color="var(--blue)" />
        <MetricCard label="Total Added"        value={metrics?.totalTasksAdded ?? 0}      color="var(--text-secondary)" />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <ChartCard title="Resource Utilization (%)">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={utilizationHistory}>
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="tick" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={TIP_STYLE} />
              <Area type="monotone" dataKey="utilization" stroke="var(--accent-bright)" fill="url(#utilGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Completed vs Missed Deadlines">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={completedHistory.map((d, i) => ({ ...d, missed: missedHistory[i]?.count ?? 0 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="tick" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={TIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="count"  name="Completed" stroke="var(--green)"  strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="missed" name="Missed"    stroke="var(--red)"    strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Throughput Over Time">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={throughputHistory}>
              <defs>
                <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--green)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="tick" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={TIP_STYLE} />
              <Area type="monotone" dataKey="throughput" stroke="var(--green)" fill="url(#tpGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div className="card metric-card">
      <span className="metric-value" style={{ color }}>{value}</span>
      <span className="metric-label">{label}</span>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="card">
      <div className="card-header"><span className="card-title">{title}</span></div>
      {children}
    </div>
  );
}
