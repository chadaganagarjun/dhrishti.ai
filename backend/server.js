require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/api/health', async (req, res) => {
  try { await db.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch (error) { res.status(500).json({ status: 'error', database: 'disconnected', error: error.message }); }
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contractors', require('./routes/contractors'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/risks', require('./routes/risks'));
app.use('/api/reports', require('./routes/reports'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html')));
app.use((err, req, res, next) => { res.status(500).json({ message: 'Unexpected server error' }); });

async function start() {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM users');
    if (Number(rows[0].count) === 0) {
      const hash = await bcrypt.hash('Admin@123', 12);
      await db.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)', ['DRISHTI Administrator','admin@drishti.local',hash,'admin']);
      console.log('First-run admin created: admin@drishti.local / Admin@123');
    }
    app.listen(PORT, () => console.log(`DRISHTI running at http://localhost:${PORT}`));
  } catch (error) {
    console.error('Startup failed. Check MySQL service, database/schema.sql and backend/.env.');
    console.error(error.message);
    process.exit(1);
  }
}
start();
