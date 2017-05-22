'use strict';

const util = require('util');
const axios = require('axios');

const defaultOptions = {
  fallback: 'global.tonic = function(){};',
  urlEnvVar: 'APOTHECARY_URL',
  axiosConfig: undefined
}

module.exports = function (options) {
  const {fallback, urlEnvVar, axiosConfig} = Object.assign(defaultOptions, options);
  const url = process.env[urlEnvVar];
  if (url) {
    return axios(url, axiosConfig)
      .catch(err => {
        console.log(`apothecary disabled: ${util.inspect(err, { depth: null })}`);
        return fallback;
      });
  }

  console.log(`apothecary disabled: process.env.${urlEnvVar} not set`);
  return new Promise((resolve) => resolve(fallback));
};