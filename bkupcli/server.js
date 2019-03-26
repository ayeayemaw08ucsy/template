const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

const port = process.env.PORT || 4200;
app.use(express.static (__dirname + '/dist/fam-cli'));
app.get ('/*', (req, res) => res.sendFile(path.join(__filename)));

const server = http.createServer(app);

server.listen(port, () => console.log('Running.....'));