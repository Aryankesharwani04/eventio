// Database configuration
export default {
  mongooseOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  databaseURL: process.env.DATABASE_URL || 'mongodb://localhost:27017/eventio_booking'
};
