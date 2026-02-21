const cluster = require('cluster');
const os = require('os');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bookingRoutes = require('./routes/bookingRoutes');
const dbConfig = require('./config/database');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Restart the worker
    });
} else {
    const app = express();

    // Setup morgan to log to the console
    app.use(morgan('dev'));

    // Connect to MongoDB
    mongoose.connect(dbConfig.databaseURL, dbConfig.mongooseOptions);

    app.use(express.json());
    app.use('/api', bookingRoutes);

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`Booking service running on port http://localhost:${PORT} with PID ${process.pid}`);
    });
}
