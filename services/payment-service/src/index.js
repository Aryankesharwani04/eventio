const express = require('express');
const healthRoute = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use('/health', healthRoute);

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
