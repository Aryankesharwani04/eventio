// Request ID middleware for distributed tracing
const { v4: uuidv4 } = require('uuid');

const requestIdMiddleware = (req, res, next) => {
  // Generate or use existing request ID
  const requestId = req.headers['x-request-id'] || uuidv4();
  
  // Attach to request object
  req.id = requestId;
  
  // Add to response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
};

module.exports = requestIdMiddleware;
