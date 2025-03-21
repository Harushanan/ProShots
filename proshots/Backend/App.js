const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDatabase = require('./config/connectdb');
const delivery = require('./route/delivery')
dotenv.config({path: path.join(__dirname, 'config', 'config.env')})
const feedback =require('./route/feedback')
connectDatabase();
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
app.use(express.json());
app.use(cors());
app.use('/pro/',feedback)
app.use('/pro/',delivery)

if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend',  'dist', 'frontend', 'browser')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'frontend', 'browser', 'index.html'))
    })}

app.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}in ${process.env.node_env} mode`);
})