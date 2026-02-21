const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'notification-service' });
});

module.exports = router;
