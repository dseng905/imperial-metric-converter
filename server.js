const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const convert = require('./convert.js');
const app = express();

app.use(cors());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', (req,res) => res.sendFile(process.cwd() + '/views/index.html'));

app.get('/api/convert', convert);

app.use((req,res,next) => {
  res.status(404)
    .type('text')
    .send('Page could not be found.')
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening...");
});