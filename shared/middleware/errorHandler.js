// Global error handling middleware

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack}`);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
};

export default errorHandler;
