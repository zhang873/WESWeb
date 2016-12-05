var express = require('express');

var config = module.exports = {
  port: 80,
  db: {
    uri: 'mongodb://127.0.0.1/wes',
    options: {
      user: '',
      pass: ''
    },
    delay: 3000
  },
  log: {
    format: 'dev',
    options: {}
  }
};

express.transMedia = 0;
express.userSpace = [];



