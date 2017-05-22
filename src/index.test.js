'use strict'

const test = require('ava');
const td = require('testdouble');

const processEnvClone = Object.assign({}, process.env);
const defaultFallback = 'global.tonic = function(){};';
let url, loadedCode, axios;

test.beforeEach(t => {
  url = 'https://notarealurl';
  loadedCode = 'This should be code!';
  axios = td.replace('axios', td.function());
});

test.afterEach.always(t => {
  td.reset();
  process.env = Object.assign({}, processEnvClone);
});

test.serial.cb('Returns loaded code with default inputs', t => {
  td.when(axios(url, undefined)).thenResolve(loadedCode);

  process.env.APOTHECARY_URL = url;

  const apothecary = require('./index');

  apothecary().then(tonic => {
    t.is(tonic, loadedCode);
    t.end();
  });
});

test.serial.cb('Returns fallback when request errors with default inputs', t => {
  td.when(axios(url, undefined)).thenReject('Error!');

  process.env.APOTHECARY_URL = url;

  const apothecary = require('./index');

  apothecary().then(tonic => {
    t.is(tonic, defaultFallback);
    t.end();
  });
});

test.serial.cb('Returns fallback when URL environment variable is not set', t => {
  const apothecary = require('./index');

  apothecary().then(tonic => {
    t.is(tonic, defaultFallback);
    t.end();
  });
});

test.serial.cb('Returns loaded code when custom env var is supplied', t => {
  td.when(axios(url, undefined)).thenResolve(loadedCode);

  process.env.PHARMACIST_URL = url;

  const apothecary = require('./index');

  apothecary({ urlEnvVar: 'PHARMACIST_URL' }).then(tonic => {
    t.is(tonic, loadedCode);
    t.end();
  })
});

test.serial.cb('Returns custom fallback after error when custom fallback is supplied', t => {
  const apothecary = require('./index');

  const customFallback = 'something else';
  apothecary({ fallback: customFallback }).then(tonic => {
    t.is(tonic, customFallback);
    t.end();
  });
});

test.serial.cb('Axios is called with custom config when it is provided', t => {
  const axiosConfig = { method: 'post' };
  td.when(axios(url, axiosConfig)).thenResolve(loadedCode);

  process.env.APOTHECARY_URL = url;

  const apothecary = require('./index');

  apothecary({ axiosConfig }).then(tonic => {
    t.is(tonic, loadedCode);
    t.end();
  })
});