const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(morgan('dev'));

app.use('/auth/login', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));
app.use('/api/bookings', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true}));
app.use('/api/book', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true}));
app.use('/seats/seat/A12', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));

app.listen(4000, () => {
  console.log('API Gateway running on http://localhost:4000');
});
