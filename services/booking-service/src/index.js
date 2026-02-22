import cluster from 'cluster';
import os from 'os';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bookingRoutes from './routes/bookingRoutes.js';
import dbConfig from './config/database.js';

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const app = express();

    app.use(morgan('dev'));

    mongoose.connect(dbConfig.databaseURL, dbConfig.mongooseOptions);

    app.use(express.json());
    app.use('/api', bookingRoutes);

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`Booking service running on port http://localhost:${PORT} with PID ${process.pid}`);
    });
}
