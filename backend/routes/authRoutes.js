const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('Users')
    .insert([{ name, email, password: hashedPassword }]);

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.status(201).json({ success: true, user: data[0] });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return res.status(401).json({ success: false, message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, data.password);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

  res.json({ success: true, user: { id: data.id, name: data.name, email: data.email } });
});

module.exports = router;