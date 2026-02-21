// Database configuration
module.exports = {
  mongooseOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  databaseURL: process.env.DATABASE_URL || 'mongodb://localhost:27017/eventio_seats'
};
