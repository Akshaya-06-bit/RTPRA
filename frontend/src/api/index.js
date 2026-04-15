import api from './axios';

export const authAPI = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
  getMe:    ()      => api.get('/auth/me'),
};

export const tasksAPI = {
  create: (data)    => api.post('/tasks', data),
  getAll: ()        => api.get('/tasks'),
  getOne: (id)      => api.get(`/tasks/${id}`),
  update: (id, data)=> api.patch(`/tasks/${id}`, data),
  remove: (id)      => api.delete(`/tasks/${id}`),
};

export const simulationAPI = {
  start:        (config) => api.post('/simulation/start', { config }),
  pause:        ()       => api.post('/simulation/pause'),
  resume:       ()       => api.post('/simulation/resume'),
  reset:        ()       => api.post('/simulation/reset'),
  getState:     ()       => api.get('/simulation/state'),
  setSpeed:     (m)      => api.post('/simulation/speed', { multiplier: m }),
  loadScenario: (id)     => api.post('/simulation/load-scenario', { scenarioId: id }),
  listScenarios:()       => api.get('/simulation/scenarios'),
  updateConfig: (config) => api.post('/simulation/config', { config }),
};

export const metricsAPI = {
  getCurrent: () => api.get('/metrics/current'),
  getCharts:  () => api.get('/metrics/charts'),
};
