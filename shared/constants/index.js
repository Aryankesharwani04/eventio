// Shared constants across Eventio microservices

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

const SERVICE_PORTS = {
  AUTH: process.env.AUTH_SERVICE_PORT || 3001,
  BOOKING: process.env.BOOKING_SERVICE_PORT || 3002,
  SEAT: process.env.SEAT_SERVICE_PORT || 3003,
  PAYMENT: process.env.PAYMENT_SERVICE_PORT || 3004,
  NOTIFICATION: process.env.NOTIFICATION_SERVICE_PORT || 3005,
  GATEWAY: process.env.GATEWAY_PORT || 3000
};

const SERVICE_NAMES = {
  AUTH: 'auth-service',
  BOOKING: 'booking-service',
  SEAT: 'seat-service',
  PAYMENT: 'payment-service',
  NOTIFICATION: 'notification-service',
  GATEWAY: 'api-gateway'
};

module.exports = {
  HTTP_STATUS,
  SERVICE_PORTS,
  SERVICE_NAMES
};
