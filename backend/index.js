const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 
    'http://localhost:3001'],
  credentials: true 
}));

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length) {
    console.log(`Request Body:`, req.body);
  }
  next();
});

console.log("started the api");
app.use('/api/task1/products', require('./task1/route'));
app.use('/api/task2/products', require('./task2/route'));
app.use('/api/task3', require('./task3/authRoute'));

app.use((err, req, res, next) => {
  console.error(`Unhandled Error:`, err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
