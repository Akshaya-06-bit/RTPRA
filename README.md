# RTPRA – Real-Time Priority Resource Allocator

A real-time full-stack MERN resource allocation simulator that dynamically assigns limited critical resources (such as ICU beds or cloud CPU slots) using **Priority Queue scheduling**, **Earliest Deadline First (EDF)**, and **anti-starvation policies**.

> Designed to simulate real-world scheduling systems where tasks compete for limited resources based on urgency, priority, and deadlines.

---

## 📌 Overview

**RTPRA (Real-Time Priority Resource Allocator)** is a full-stack system that manages a limited pool of resources in real time. It is inspired by real-world scenarios such as:

- 🏥 **Hospital ICU Bed Allocation**
- ☁️ **Cloud CPU / Server Resource Scheduling**
- 🏭 **Critical Operations Scheduling**
- 🚑 **Emergency Service Dispatching**

The system receives multiple incoming tasks, each with:

- Priority level
- Deadline
- Estimated execution time
- Resource requirements
- Arrival time / status

It then intelligently allocates resources using:

- **Heap-based Priority Queues**
- **Earliest Deadline First (EDF) Scheduling**
- **Starvation Prevention / Aging**
- **Optional Preemption Logic**
- **Real-Time Status Updates**

This project demonstrates strong understanding of:

- Data structures & algorithms
- Real-time scheduling systems
- Full-stack MERN development
- WebSockets / live updates
- Scalable backend architecture

---

## ✨ Key Features

### 🔥 Core Scheduling Features
- **Priority-based task allocation**
- **Earliest Deadline First (EDF) scheduling**
- **Heap / Priority Queue implementation for fast task ordering**
- **Anti-starvation logic (aging / priority boosting)**
- **Dynamic resource release and reallocation**
- **Optional preemptive scheduling for critical tasks**
- **Support for multiple resource pools (e.g., ICU beds, CPU cores)**

### 🌐 Full-Stack Features
- User authentication (JWT based)
- Role-based access (Admin / Operator)
- Create, update, allocate, release, and monitor tasks
- Real-time dashboard with live allocation status
- Resource pool visualization
- Task queue monitoring
- Scheduler logs / allocation history
- REST API for all major operations
- Responsive UI

### 📊 Dashboard / Monitoring
- Available vs allocated resources
- Running / waiting / completed tasks
- Priority distribution
- Deadline-critical tasks
- Live scheduler decisions
- Resource utilization analytics

---

## 🧠 Scheduling Logic Used

### 1. Priority Queue (Heap)
Tasks are inserted into a **priority queue** so the system can efficiently retrieve the most important task in **O(log n)** time.

### 2. Earliest Deadline First (EDF)
When multiple tasks compete, the scheduler considers the **closest deadline first**, making the system suitable for real-time environments.

### 3. Anti-Starvation / Aging
To prevent low-priority tasks from waiting forever:
- Waiting tasks gradually receive a **priority boost over time**
- This ensures fairness while still respecting urgent workloads

### 4. Optional Preemption
If enabled:
- A high-priority / near-deadline task can preempt a lower-priority running task
- Resources are reallocated dynamically

---

## 🏗️ Tech Stack

### Frontend
- **React.js**
- **Vite**
- **Axios**
- **React Router DOM**


### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**


### Algorithms / Concepts
- **Priority Queue / Heap**
- **Earliest Deadline First (EDF)**
- **Aging / Anti-Starvation**
- **Preemptive Scheduling**
- **Real-Time Resource Allocation**

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📂 Project Structure

```bash
RTPRA/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   ├── app.js
    │   └── server.js
    ├── package.json
    └── .env.example
