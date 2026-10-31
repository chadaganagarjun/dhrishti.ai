const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const [rows] = await db.query('SELECT user_id, name, email, password_hash, role FROM users WHERE email = ?', [email]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ message: 'Invalid email or password' });
    const user = rows[0];
    const token = jwt.sign({ user_id: user.user_id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET || 'development_only_change_this_secret', { expiresIn: '8h' });
    res.json({ token, user: { id: user.user_id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ message: 'Login failed', error: error.message }); }
});

router.get('/me', auth, (req, res) => res.json({ user: req.user }));
module.exports = router;
