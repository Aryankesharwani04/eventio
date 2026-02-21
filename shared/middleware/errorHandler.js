// Global error handling middleware

const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack}`);
  
  // Determine status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
