const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  console.log("Received GET request to /api/bookings");  // Debug log

  const { data, error } = await supabase.from('bookings').select('*');
  if (error) {
    console.error("Supabase error:", error.message);     // Debug log
    return res.status(500).json({ success: false, message: error.message });
  }
  res.json({ success: true, bookings: data });
});

// Create a booking
router.post('/', async (req, res) => {
  console.log("Received POST request to /api/bookings with body:", req.body);  // Debug log

  const { user_id, event_id } = req.body;
  const { data, error } = await supabase.from('bookings').insert([{ user_id, event_id }]);

  if (error) {
    console.error("Supabase error:", error.message);     // Debug log
    return res.status(500).json({ success: false, message: error.message });
  }
  res.status(201).json({ success: true, booking: data[0] });
});

module.exports = router;