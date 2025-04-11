const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string
const mongoUri = 'mongodb+srv://bvenkata:QxKlT2REymkzNeMa@cluster0.xqdp3.mongodb.net/majesticsalon?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas: majesticsalon'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Define Schema
const waitlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  zip: { type: String, required: true },
  purpose: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Define Model (explicitly use 'elderlycare' collection)
const WaitlistEntry = mongoose.model('WaitlistEntry', waitlistSchema, 'elderlycare');

// API route to handle submissions
app.post('/api/waitlist', async (req, res) => {
  const { name, email, zip, purpose } = req.body;

  if (!name || !email || !zip || !purpose) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const entry = new WaitlistEntry({ name, email, zip, purpose });
    await entry.save();
    res.status(201).json({ message: '✅ Waitlist entry saved successfully.' });
  } catch (err) {
    console.error('❌ Save error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
