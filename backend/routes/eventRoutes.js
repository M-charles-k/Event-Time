const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('Bookings').select('*');
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, bookings: data });
});

// Create a booking
router.post('/', async (req, res) => {
  const { user_id, event_id } = req.body;

  const { data, error } = await supabase
    .from('Bookings')
    .insert([{ user_id, event_id }]);

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.status(201).json({ success: true, booking: data[0] });
});

module.exports = router;