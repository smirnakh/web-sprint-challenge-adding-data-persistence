// start your server here
const server = require('./api/server.js');

const PORT = 9000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
