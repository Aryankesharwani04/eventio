const express = require('express');
const healthRoute = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use('/health', healthRoute);

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
