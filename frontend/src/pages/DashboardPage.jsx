import Navbar            from '../components/common/Navbar';
import SimulationControls from '../components/scheduler/SimulationControls';
import ResourcePoolPanel  from '../components/dashboard/ResourcePoolPanel';
import QueuePanel         from '../components/dashboard/QueuePanel';
import RunningPanel       from '../components/dashboard/RunningPanel';
import CompletedPanel     from '../components/dashboard/CompletedPanel';
import EventLogPanel      from '../components/dashboard/EventLogPanel';
import MetricsPanel       from '../components/dashboard/MetricsPanel';
import TaskForm           from '../components/scheduler/TaskForm';
import PolicyInfoPanel    from '../components/scheduler/PolicyInfoPanel';
import ScenarioPanel      from '../components/scheduler/ScenarioPanel';
import './dashboard.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        {/* Top row: controls + resource pool */}
        <div className="dashboard-top">
          <SimulationControls />
          <ResourcePoolPanel />
        </div>

        {/* Middle row: queue + running + task form */}
        <div className="dashboard-mid">
          <QueuePanel />
          <RunningPanel />
          <div className="dashboard-mid-right">
            <TaskForm />
            <PolicyInfoPanel />
          </div>
        </div>

        {/* Bottom row: completed/failed + event log + scenarios */}
        <div className="dashboard-bot">
          <CompletedPanel />
          <EventLogPanel />
          <ScenarioPanel />
        </div>

        {/* Charts */}
        <MetricsPanel />
      </main>
    </div>
  );
}
