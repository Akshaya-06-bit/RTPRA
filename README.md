# ⚡ Real-Time Priority Resource Allocator (RTPRA)

> A production-quality full-stack simulation platform for real-time scheduling and resource allocation — modeled after ICU bed management and cloud CPU scheduling systems.

---

## 🌍 Real-World Problem Statement

In critical environments — hospital ICUs, cloud computing platforms, real-time operating systems — a fixed pool of resources must be shared among competing tasks with different urgency levels, deadlines, and durations. Poor scheduling leads to:

- **Starvation** of low-priority tasks that never get scheduled
- **Deadline misses** for time-sensitive operations
- **Resource underutilization** or dangerous overcommitment
- **Unfair preemption** that disrupts running tasks unnecessarily

RTPRA simulates and visualizes these dynamics in real time, implementing a robust multi-policy scheduler with aging, preemption, and EDF (Earliest Deadline First) logic.

---

## ✨ Features

- 🔐 JWT authentication (register / login / protected routes)
- ⚙️ Real-time simulation engine with configurable tick speed
- 📊 Live dashboard with Socket.IO updates
- 🧠 Heap-based priority queue with EDF + aging
- ⏸ Configurable preemption (evict lower-priority running tasks)
- 🛡 Anti-starvation aging mechanism (visible in UI)
- 📋 5 preset scenario templates (ICU surge, CPU stress, starvation demo, etc.)
- 📈 Recharts analytics (utilization, throughput, deadline misses)
- 🎛 Simulation controls: start / pause / resume / reset / speed (1×, 2×, 5×)
- 🏥 Hospital mode (ICU beds) and ☁ Cloud mode (CPU slots)

---

## 🛠 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Recharts, Socket.IO-client, Axios |
| Backend    | Node.js, Express.js, Socket.IO          |
| Database   | MongoDB, Mongoose                       |
| Auth       | JWT, bcryptjs                           |
| Validation | express-validator                       |

---

## 📁 Folder Structure

```
real-time-priority-resource-allocator/
├── backend/
│   └── src/
│       ├── config/          # DB connection
│       ├── controllers/     # Route handlers (thin layer)
│       ├── middleware/       # Auth guard, error handler, validator
│       ├── models/          # Mongoose schemas (User, Task, SimulationConfig, EventLog)
│       ├── routes/          # Express routers
│       ├── services/
│       │   └── scheduler/
│       │       ├── SchedulerEngine.js   # Core simulation loop
│       │       ├── PriorityQueue.js     # Min-heap implementation
│       │       ├── policies.js          # EDF, aging, preemption logic
│       │       ├── metrics.js           # Metrics tracker
│       │       └── scenarios.js         # Preset demo scenarios
│       ├── sockets/         # Socket.IO setup
│       ├── app.js           # Express app
│       └── server.js        # HTTP + Socket server entry
│
└── frontend/
    └── src/
        ├── api/             # Axios instance + API modules
        ├── components/
        │   ├── dashboard/   # ResourcePool, Queue, Running, Completed, EventLog, Metrics panels
        │   ├── scheduler/   # SimulationControls, TaskForm, PolicyInfo, ScenarioPanel
        │   └── common/      # Navbar
        ├── context/         # AuthContext, SimulationContext
        ├── pages/           # Login, Register, Dashboard
        ├── utils/           # Color helpers
        └── styles/          # Global CSS
```

---

## 🧠 Scheduling Algorithm Explained

### 1. Priority Queue (Min-Heap)

A binary min-heap is used for O(log n) insertion and extraction. The heap key is:

```
key = -effectivePriority × 10⁹ + deadlineTick × 10⁴ + arrivalTick
```

This encodes a **three-level sort** in a single numeric key:
- **Primary**: Highest effective priority wins (negated for min-heap)
- **Secondary**: Earliest deadline wins (EDF)
- **Tertiary**: Earliest arrival wins (FCFS tie-break)

### 2. Effective Priority Formula

```
effectivePriority = basePriority + agingBoost + (urgency ? 1.5 : 0)
```

Capped at `maxEffectivePriority` (default: 10).

### 3. Anti-Starvation Aging

Every `agingIntervalTicks` ticks a task waits in the queue, its `agingBoost` increases by `agingBoostAmount`. This gradually raises its effective priority until it gets scheduled. The UI shows aging boosts in the queue table and logs every boost event.

### 4. Preemption

When a high-priority task arrives and resources are exhausted, the scheduler finds the set of lowest-priority running tasks whose combined resource units ≥ the new task's requirement. Those tasks are evicted back to the queue with their remaining duration preserved.

### 5. Feasibility Check

Before scheduling, the engine checks: `currentTick + remainingDuration ≤ deadlineTick`. Infeasible tasks are immediately marked `missed_deadline`.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if backend URL differs
npm run dev
```

Open `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                        | Default                  |
|-----------------|------------------------------------|--------------------------|
| `PORT`          | Server port                        | `5000`                   |
| `MONGO_URI`     | MongoDB connection string          | `mongodb://localhost/rtpra` |
| `JWT_SECRET`    | JWT signing secret                 | *(required)*             |
| `JWT_EXPIRES_IN`| Token expiry                       | `7d`                     |
| `CLIENT_URL`    | Frontend origin for CORS           | `http://localhost:5173`  |

### Frontend (`frontend/.env`)

| Variable           | Description              | Default                    |
|--------------------|--------------------------|----------------------------|
| `VITE_API_URL`     | Backend API base URL     | `http://localhost:5000/api` |
| `VITE_SOCKET_URL`  | Socket.IO server URL     | `http://localhost:5000`    |

---

## 📡 API Routes

### Auth
| Method | Route                  | Description        |
|--------|------------------------|--------------------|
| POST   | `/api/auth/register`   | Register user      |
| POST   | `/api/auth/login`      | Login              |
| GET    | `/api/auth/me`         | Get current user   |

### Tasks
| Method | Route              | Description        |
|--------|--------------------|--------------------|
| POST   | `/api/tasks`       | Create task        |
| GET    | `/api/tasks`       | List user tasks    |
| GET    | `/api/tasks/:id`   | Get single task    |
| PATCH  | `/api/tasks/:id`   | Update task        |
| DELETE | `/api/tasks/:id`   | Delete task        |

### Simulation
| Method | Route                          | Description              |
|--------|--------------------------------|--------------------------|
| POST   | `/api/simulation/start`        | Start simulation         |
| POST   | `/api/simulation/pause`        | Pause simulation         |
| POST   | `/api/simulation/resume`       | Resume simulation        |
| POST   | `/api/simulation/reset`        | Reset simulation         |
| GET    | `/api/simulation/state`        | Get current state        |
| POST   | `/api/simulation/speed`        | Set speed multiplier     |
| POST   | `/api/simulation/load-scenario`| Load preset scenario     |
| GET    | `/api/simulation/scenarios`    | List available scenarios |
| PATCH  | `/api/simulation/config`       | Update config live       |

### Metrics
| Method | Route                  | Description          |
|--------|------------------------|----------------------|
| GET    | `/api/metrics/current` | Current metrics      |
| GET    | `/api/metrics/charts`  | Chart time-series    |

---

## ☁️ Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node src/server.js`
5. Add environment variables from `.env.example`
6. Set `CLIENT_URL` to your Vercel frontend URL

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Import on [Vercel](https://vercel.com)
3. Framework preset: **Vite**
4. Add environment variables:
   - `VITE_API_URL` = `https://your-render-app.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-render-app.onrender.com`

---

## 📸 Screenshots

> *(Add screenshots of: Dashboard, Queue Panel, Running Tasks, Event Log, Charts)*

---

## 🔮 Future Improvements

- Persistent simulation runs with full replay
- Multi-user simulation rooms via Socket.IO namespaces
- Gantt chart visualization of task scheduling timeline
- ML-based priority prediction from historical patterns
- Export simulation results as CSV/JSON
- Resource type differentiation (CPU vs memory vs I/O)
- WebWorker-based scheduler for true non-blocking simulation

---

## 📄 Resume Bullet Points

- **Built a full-stack real-time resource scheduling simulator** using React, Node.js, Express, MongoDB, and Socket.IO, implementing a heap-based priority queue with Earliest Deadline First (EDF) scheduling, anti-starvation aging, and configurable preemption — achieving live tick-by-tick updates across all connected clients
- **Designed and implemented a production-quality scheduler engine** featuring O(log n) priority queue operations, a multi-key heap comparator (priority × deadline × arrival), aging-based starvation prevention, feasibility checks, and multi-unit resource allocation — all in a clean, modular service architecture
- **Delivered a polished, interview-ready full-stack project** with JWT authentication, 5 preset simulation scenarios (ICU surge, CPU stress test, starvation demo), real-time Recharts analytics, and a responsive dark-mode dashboard — deployed on Vercel + Render

---

## 🐙 GitHub Description

> Real-Time Priority Resource Allocator — A full-stack scheduling simulator with heap-based priority queue, EDF, anti-starvation aging, and preemption. Built with React, Node.js, MongoDB, and Socket.IO. Simulates ICU bed and cloud CPU resource allocation in real time.

---

## 💼 LinkedIn Post

> 🚀 Excited to share my latest project: **Real-Time Priority Resource Allocator (RTPRA)**!
>
> I built a full-stack scheduling simulator that models how hospitals manage ICU beds and cloud platforms allocate CPU slots — in real time.
>
> 🔧 Tech: React + Vite, Node.js, Express, MongoDB, Socket.IO, Recharts
> 🧠 Algorithms: Heap-based priority queue, EDF scheduling, anti-starvation aging, preemption
> 📊 Features: Live dashboard, 5 demo scenarios, JWT auth, analytics charts
>
> The scheduler runs a tick-based simulation loop, aging low-priority tasks to prevent starvation, preempting lower-priority running tasks when urgent ones arrive, and tracking every decision in a live event log.
>
> Check it out: [GitHub link]
> #webdev #fullstack #algorithms #react #nodejs #systemdesign

---

## 🎤 Interview Q&A

**Q: Why did you use a heap instead of sorting the array each tick?**
> Sorting is O(n log n) per tick. A heap gives O(log n) insertion and O(log n) extraction. For a scheduler that runs every second with potentially hundreds of tasks, this matters. The heap also supports efficient re-heapification after aging updates.

**Q: How does your anti-starvation mechanism work?**
> Every N ticks a task waits in the queue, its `agingBoost` increases by a configurable amount. This raises its `effectivePriority = basePriority + agingBoost + urgencyBonus`. Eventually a low-priority task's effective priority surpasses higher-priority tasks and gets scheduled. The UI logs every boost event so you can watch it happen.

**Q: How does preemption work in your system?**
> When a high-priority task arrives and there aren't enough free resources, the scheduler finds the set of lowest-priority running tasks whose combined resource units cover the new task's requirement. Those tasks are evicted back to the queue with their remaining duration preserved — they resume later. Preemption is configurable and tracked in metrics.

**Q: What is your heap key formula and why?**
> `key = -effectivePriority × 10⁹ + deadlineTick × 10⁴ + arrivalTick`. The large multipliers ensure the primary sort (priority) always dominates the secondary (deadline), which always dominates the tertiary (arrival). Negating priority converts max-priority to min-heap semantics.

**Q: How would you scale this to a distributed system?**
> The scheduler engine is currently a singleton in-process. To scale: move the priority queue to Redis (sorted sets), use a distributed lock (Redlock) for tick coordination, publish tick events to a message queue (SQS/Kafka), and have multiple worker nodes consume tasks. The Socket.IO layer would move to Redis adapter for multi-instance broadcasting.

**Q: What is EDF and when does it fail?**
> Earliest Deadline First schedules the task with the nearest deadline first. It's optimal for preemptive single-resource scheduling (Liu & Layland, 1973). It fails under overload — when total utilization exceeds 100%, some deadlines will be missed. My system handles this with feasibility checks and deadline-miss tracking.

---

## 💬 What to Say in an Interview

*"I built a tick-based simulation engine where each tick: ages queued tasks to prevent starvation, advances running tasks, completes finished ones, marks deadline misses, then greedily schedules eligible tasks from a min-heap. The heap key encodes priority, deadline, and arrival time in a single number so the comparator is O(1). Preemption is handled by finding the minimum set of lower-priority running tasks to evict. The whole engine is a clean service class with no framework dependencies — easy to unit test and explain."*
