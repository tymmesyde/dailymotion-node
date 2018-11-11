require('dotenv').config();

const TIMEOUT = 5000;
const SHOULD_BE_NOT_NULL = 'should be not null';
const SHOULD_BE_OBJECT = 'should be an object';
const SHOULD_BE_STRING = 'should be a string';
const SHOULD_HAVE_KEY = 'should have the key ';
const SHOULD_NOT_HAVE_KEY = 'should not have the key ';

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, CODE } = process.env;

const assert = require('assert');
const Dailymotion = require('../lib/Dailymotion');
const dailymotion = new Dailymotion({
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  redirect_uri: REDIRECT_URI
});

describe('Construct', () => {
  it('Construct the dailymotion object', (done) => {
    assert(typeof (dailymotion) === 'object', SHOULD_BE_OBJECT);
    done();
  }).timeout(TIMEOUT);
});

describe('Fetch Channels', () => {
  it('should return a JSON object', (done) => {
    dailymotion.getChannels().then(channels => {
      assert(typeof (channels) === 'object', SHOULD_BE_OBJECT);
      assert(channels !== null, SHOULD_BE_NOT_NULL);
      assert(!Object.prototype.hasOwnProperty.call(channels, 'error'), `${SHOULD_NOT_HAVE_KEY}error`);
      assert(Object.prototype.hasOwnProperty.call(channels, 'list'), `${SHOULD_HAVE_KEY}list`);
      done();
    });
  }).timeout(TIMEOUT);
});

describe('Fetch Channel content', () => {
  it('should return a JSON object', (done) => {
    dailymotion.getChannel('music').then(content => {
      assert(typeof (content) === 'object', SHOULD_BE_OBJECT);
      assert(content !== null, SHOULD_BE_NOT_NULL);
      assert(!Object.prototype.hasOwnProperty.call(content, 'error'), `${SHOULD_NOT_HAVE_KEY}error`);
      assert(Object.prototype.hasOwnProperty.call(content, 'list'), `${SHOULD_HAVE_KEY}list`);
      done();
    });
  }).timeout(TIMEOUT);
});

describe('oAuth Authorize', () => {
  it('should return a string url', (done) => {
    let url = dailymotion.getAuthorizeUrl();
    assert(typeof (url) === 'string', SHOULD_BE_STRING);
    assert(url !== null, SHOULD_BE_NOT_NULL);
    done();
  }).timeout(TIMEOUT);
});

describe('oAuth Grant Access', () => {
  it('should return a JSON object', (done) => {
    dailymotion.grantAccess(CODE).then(token => {
      assert(typeof (token) === 'object', SHOULD_BE_OBJECT);
      assert(token !== null, SHOULD_BE_NOT_NULL);
      assert(!Object.prototype.hasOwnProperty.call(token, 'error'), `${SHOULD_NOT_HAVE_KEY}error`);
      done();
    });
  }).timeout(TIMEOUT);
});
