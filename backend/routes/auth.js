const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple admin login (you can expand this)
const ADMIN_EMAIL = 'admin@designermonk.com';
const ADMIN_PASSWORD = 'admin123'; // Hash this in production

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;