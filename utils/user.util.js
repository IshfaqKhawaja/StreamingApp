require('dotenv').config();
const express = require('express');

// const router = express.Router();
const crypto = require('crypto');
// const request = require('request');
// const { promisify } = require('util');
// const User = require('../models/userModel.js');
// const AuthToken = require('../models/authModel.js');
// const ErrorParser = require('./errorParse.js');

exports.createEmailverificationCode = function() {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  return crypto
    .createHash('sha1')
    .update(current_date + random)
    .digest('hex');
};

exports.createMobileOtp = function() {
  return Math.floor(Math.random() * (1000000 - 1000 + 1) + 1000);
};

exports.createMobileOtpNew = function(length) {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};

exports.createAuthToken = function() {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  return crypto
    .createHash('sha1')
    .update(current_date + random)
    .digest('hex');
};