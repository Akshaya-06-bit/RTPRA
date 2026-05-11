require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://rtpra.vercel.app",
    "https://rtpra-1wivvo5mp-akshaya-06-bits-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/tasks',      require('./routes/tasks'));
app.use('/api/simulation', require('./routes/simulation'));
app.use('/api/metrics',    require('./routes/metrics'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
