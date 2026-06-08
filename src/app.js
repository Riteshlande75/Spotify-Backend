const express = require('express');
const cookieparser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const musicRoutes = require('./routes/music.route')


const app = express();
app.use(express.json());
app.use(cookieparser());

app.use('/api/auth',authRoutes);
app.use('/api/music', musicRoutes)

module.exports = app;