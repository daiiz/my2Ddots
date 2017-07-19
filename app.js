const PORT = process.env.PORT || 3000;
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/static', express.static('static'));

// run server
http.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});