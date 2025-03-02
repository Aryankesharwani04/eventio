const cluster = require('cluster');
const os = require('os');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seatRoutes = require('./routes/seatRoutes');
const morgan = require('morgan');

dotenv.config();

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
    const port = process.env.PORT || 3003;

    app.use(morgan('dev'));

    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true // Add this option
    });

    app.use(express.json());
    app.use('/seats', seatRoutes);

    app.listen(port, () => {
        console.log(`Seat service running on port ${port} with PID ${process.pid}`);
    });
}
