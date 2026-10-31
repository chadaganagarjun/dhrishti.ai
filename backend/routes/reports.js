const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();
router.use(auth);
router.get('/summary', async (req, res) => {
  try {
    const [[projects]] = await db.query("SELECT COUNT(*) total, SUM(status='In Progress') active, SUM(status='Completed') completed, COALESCE(SUM(budget),0) budget FROM projects");
    const [[expenses]] = await db.query('SELECT COALESCE(SUM(amount),0) spent FROM cost_records');
    const [[risks]] = await db.query("SELECT COUNT(*) total, SUM(severity IN ('High','Critical') AND status IN ('Open','Monitoring')) critical FROM risks");
    const [[milestones]] = await db.query("SELECT COUNT(*) total, SUM(status <> 'Completed' AND planned_date < CURDATE()) overdue FROM milestones");
    const [recentProjects] = await db.query('SELECT project_id, project_name, location, budget, progress, status, end_date FROM projects ORDER BY created_at DESC LIMIT 6');
    const [expenseByCategory] = await db.query('SELECT category, SUM(amount) amount FROM cost_records GROUP BY category ORDER BY amount DESC');
    const [alerts] = await db.query('SELECT a.*, p.project_name FROM alerts a LEFT JOIN projects p ON p.project_id=a.project_id ORDER BY a.created_at DESC LIMIT 6');
    res.json({ projects, expenses, risks, milestones, recentProjects, expenseByCategory, alerts });
  } catch (error) { res.status(500).json({ message: 'Report generation failed', error: error.message }); }
});
router.get('/project-costs', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT p.project_name, p.budget, COALESCE(SUM(c.amount),0) AS spent, p.budget-COALESCE(SUM(c.amount),0) AS remaining FROM projects p LEFT JOIN cost_records c ON c.project_id=p.project_id GROUP BY p.project_id ORDER BY p.project_name');
    res.json(rows);
  } catch (error) { res.status(500).json({ message: 'Could not generate cost report', error: error.message }); }
});
router.get('/alerts', async (req, res) => {
  try { const [rows] = await db.query('SELECT a.*, p.project_name FROM alerts a LEFT JOIN projects p ON p.project_id=a.project_id ORDER BY a.created_at DESC'); res.json(rows); }
  catch (error) { res.status(500).json({ message: 'Could not fetch alerts', error: error.message }); }
});
router.patch('/alerts/:id', async (req, res) => {
  try { const status = ['Read','Resolved'].includes(req.body.status) ? req.body.status : 'Read'; await db.query('UPDATE alerts SET status=? WHERE alert_id=?', [status, req.params.id]); res.json({ message: 'Alert updated' }); }
  catch (error) { res.status(500).json({ message: 'Could not update alert', error: error.message }); }
});
module.exports = router;
