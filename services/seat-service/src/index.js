import cluster from 'cluster';
import os from 'os';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import seatRoutes from './routes/seatRoutes.js';
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
    app.use('/seats', seatRoutes);

    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
        console.log(`Seat service running on port ${PORT} with PID ${process.pid}`);
    });
}
