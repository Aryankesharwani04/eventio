// Standard API response formatter

const responseFormatter = {
  success: (data, message = 'Success', statusCode = 200) => ({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }),
  error: (message, errors = null, statusCode = 500) => ({
    success: false,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString()
  }),
  paginated: (data, page, limit, total, message = 'Success') => ({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    timestamp: new Date().toISOString()
  })
};

export default responseFormatter;
