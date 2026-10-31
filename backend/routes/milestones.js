const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();
router.use(auth);
const table = 'milestones';
const idColumn = 'milestone_id';
const fields = ['project_id', 'name', 'description', 'planned_date', 'status'];

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT t.*, p.project_name FROM ${table} t LEFT JOIN projects p ON t.project_id = p.project_id ORDER BY t.${idColumn} DESC`);
    res.json(rows);
  } catch (error) { res.status(500).json({ message: 'Could not fetch records', error: error.message }); }
});
router.post('/', async (req, res) => {
  try {
    const keys = fields.filter(key => req.body[key] !== undefined);
    if (!keys.length) return res.status(400).json({ message: 'No valid fields provided' });
    const values = keys.map(key => req.body[key] === '' ? null : req.body[key]);
    const [result] = await db.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`, values);
    if (table === 'risks') {
      const [risk] = await db.query('SELECT project_id, severity, type FROM risks WHERE risk_id = ?', [result.insertId]);
      await db.query('INSERT INTO alerts (project_id, risk_id, message, severity) VALUES (?, ?, ?, ?)', [risk[0].project_id, result.insertId, `New ${risk[0].severity} risk: ${risk[0].type}`, risk[0].severity]);
    }
    res.status(201).json({ message: 'Record created', id: result.insertId });
  } catch (error) { res.status(500).json({ message: 'Could not create record', error: error.message }); }
});
router.put('/:id', async (req, res) => {
  try {
    const keys = fields.filter(key => req.body[key] !== undefined);
    if (!keys.length) return res.status(400).json({ message: 'No valid fields provided' });
    const values = keys.map(key => req.body[key] === '' ? null : req.body[key]);
    const [result] = await db.query(`UPDATE ${table} SET ${keys.map(key => `${key} = ?`).join(',')} WHERE ${idColumn} = ?`, [...values, req.params.id]);
    res.json({ message: result.affectedRows ? 'Record updated' : 'Record not found' });
  } catch (error) { res.status(500).json({ message: 'Could not update record', error: error.message }); }
});
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(`DELETE FROM ${table} WHERE ${idColumn} = ?`, [req.params.id]);
    res.json({ message: result.affectedRows ? 'Record deleted' : 'Record not found' });
  } catch (error) { res.status(500).json({ message: 'Could not delete record', error: error.message }); }
});
module.exports = router;
