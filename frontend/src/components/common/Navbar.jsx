import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout }    = useAuth();
  const { simState, connected } = useSimulation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">⚡</span>
        <span className="navbar-title">RTPRA</span>
        <span className="navbar-sub">Priority Resource Allocator</span>
      </div>

      <div className="navbar-center">
        <span className="tick-badge">Tick: {simState.currentTick}</span>
        <span className={`status-dot ${simState.state}`} title={`Simulation: ${simState.state}`} />
        <span className="status-label">{simState.state.toUpperCase()}</span>
      </div>

      <div className="navbar-right">
        <span className={`conn-badge ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '● Live' : '○ Offline'}
        </span>
        <span className="navbar-user">{user?.username}</span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
