// index.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// Import Controllers
const movieController = require('./controllers/movieController');
const reserveController = require('./controllers/reserveController');
const scheduleController = require('./controllers/scheduleController');
const seatController = require('./controllers/seatController');
app.use(cors({
  origin: 'http://localhost:3000', // Replace with the origin of your client
}));
app.use(express.json());

mongoose.connect('mongodb+srv://kyliebn:kyliebn2001@cluster0.88j9z2i.mongodb.net/DanFlix');

// movieController routes
app.use('/api', movieController);
// reserveController routes
app.use('/api', reserveController);


app.use('/api', scheduleController);

app.use('/api', seatController);

app.listen(1337, () => {
    console.log('Server started on 1337');
});
