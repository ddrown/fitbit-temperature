const Influx = require('influx');
const express = require('express');
const http = require('http');
const os = require('os');

const app = express();

const influx = new Influx.InfluxDB({
 host: 'localhost',
 database: 'rtl433',
});

http.createServer(app).listen(3001, function () {
    console.log('Listening on port 3001')
    });

app.get('/', function (req, res) {
  influx.query(`
    select * from "Sharp-SPC775"
    order by time desc
    limit 1
  `).then(result => {
    res.json(result[0]);
  }).catch(err => {
    res.status(500).send(err.stack);
  });
});
