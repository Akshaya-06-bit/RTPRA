import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { simulationAPI } from '../api';

const SimulationContext = createContext(null);

const INITIAL_STATE = {
  simulationId: null,
  state: 'idle',
  currentTick: 0,
  config: {},
  resources: { total: 10, used: 0, available: 10, utilization: 0 },
  queue: [],
  running: [],
  completed: [],
  failed: [],
  eventLog: [],
  metrics: {},
  chartData: { utilizationHistory: [], completedHistory: [], missedHistory: [], throughputHistory: [] },
};

export function SimulationProvider({ children }) {
  const [simState, setSimState] = useState(INITIAL_STATE);
  const [connected, setConnected]   = useState(false);
  const [scenarios, setScenarios]   = useState([]);
  const socketRef = useRef(null);

  // Connect socket
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect',            () => setConnected(true));
    socket.on('disconnect',         () => setConnected(false));
    socket.on('simulation:state',   (data) => setSimState(data));
    socket.on('simulation:tick',    (data) => setSimState(data));

    socketRef.current = socket;
    return () => socket.disconnect();
  }, []);

  // Load scenarios list
  useEffect(() => {
    simulationAPI.listScenarios()
      .then(res => setScenarios(res.data.scenarios))
      .catch(() => {});
  }, []);

  const start        = useCallback((config) => simulationAPI.start(config), []);
  const pause        = useCallback(()        => simulationAPI.pause(), []);
  const resume       = useCallback(()        => simulationAPI.resume(), []);
  const reset        = useCallback(()        => simulationAPI.reset(), []);
  const setSpeed     = useCallback((m)       => simulationAPI.setSpeed(m), []);
  const loadScenario = useCallback((id)      => simulationAPI.loadScenario(id), []);
  const updateConfig = useCallback((cfg)     => simulationAPI.updateConfig(cfg), []);

  return (
    <SimulationContext.Provider value={{
      simState, connected, scenarios,
      start, pause, resume, reset, setSpeed, loadScenario, updateConfig,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulation = () => useContext(SimulationContext);
