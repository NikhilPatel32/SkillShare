require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skill');
const connectionRoutes = require('./routes/connection');
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:3000",           
    "https://skill-share-iota.vercel.app" 
  ],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/connections', connectionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Skill Sharing API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
