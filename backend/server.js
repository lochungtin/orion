const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;

connection.once('open', () => console.log('MongoDB database connection established successfully'));
app.listen(42070, () => console.log('MongoDB Server is running on port: 42070'));

const accountRouter = require('./routes/accounts');
const deviceRouter = require('./routes/devices');
const reportRouter = require('./routes/reports');

app.use('/accounts', accountRouter);
app.use('/devices', deviceRouter);
app.use('/reports', reportRouter);
