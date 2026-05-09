require('dotenv').config();

const app = require('./app');
const config = require('./config');

const port = config.port;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log("DOCKER TEST");
});