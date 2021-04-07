const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
// const url = require('url');
const redis = require('redis');

// Add variables from .env file for connection string
require('dotenv').config();

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const redisCredentials = {
  hostname: '',
  port: '',
  pass: '',
};

if (process.env.REDISCLOUD_URL && process.env.REDISCLOUD_PORT && process.env.REDISCLOUD_PASS) {
  redisCredentials.hostname = process.env.REDISCLOUD_URL;
  redisCredentials.port = process.env.REDISCLOUD_PORT;
  redisCredentials.pass = process.env.REDISCLOUD_PASS;
}
const redisClient = redis.createClient({
  host: redisCredentials.hostname,
  port: redisCredentials.port,
  password: redisCredentials.pass,
});

const router = require('./router.js');

const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// app.use(session({
//   key: 'sessionid',
//   secret: 'Domo Arigato',
//   resave: true,
//   saveUninitalized: true,
// }));

app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitalized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
