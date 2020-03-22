const express = require('express');
const cors = require('cors');
const sequelize = require('./utils/database');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 4000;
const log = require('./utils/log')(module);
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

app.use(function(req, res, next){
  res.status(404);
  log.debug('Not found URL: %s',req.url);
  res.send({ error: 'Not found' });
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  log.error('Internal error(%d): %s',res.statusCode,err.message);
  res.send({ error: err.message });
});

(async function start() {
  try {
    await sequelize.sync();
    app.listen(PORT, () => log.info(`Сервер запущен на ${PORT} порту`))
  } catch (e) {
    console.log(e)
  }
})();
