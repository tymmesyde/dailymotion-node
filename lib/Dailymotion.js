const fetch = require('node-fetch');
const qs = require('querystring');

const API_URL = "https://api.dailymotion.com/";
const OAUTH_URL = "https://www.dailymotion.com/oauth/";
const ENDPOINTS = {
  CHANNELS: {
    url: `${API_URL}channels`,
    fields: ['id', 'name', 'slug', 'description', 'item_type', 'created_time', 'updated_time']
  },
  CHANNEL: {
    url: `${API_URL}channel/{id}/videos`,
    fields: ['id', 'owner', 'title', 'description', 'tags', 'duration', 'thumbnail_url', 'created_time', 'updated_time']
  },
  AUTH: {
    url: `${OAUTH_URL}authorize`
  },
  TOKEN: {
    url: `${API_URL}oauth/token`
  }
};

function Dailymotion({client_id, client_secret, redirect_uri}) {
  this.CLIENT_ID = client_id;
  this.CLIENT_SECRET = client_secret;
  this.REDIRECT_URI = redirect_uri;
}

function _preRequest(method = 'GET', endpoint, ndpnt_params, url_params) {
  let url = endpoint.url;
  if(ndpnt_params)
    Object.keys(ndpnt_params).forEach(p => {
      url = endpoint.url.replace(`{${p}}`, ndpnt_params[p]);
    });

  let params
  if(url_params)
    params = qs.stringify(url_params);

  if(method === 'GET') {
    return {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      url: `${url}?${params || ''}`
    };
  }else {
    return {
      method: method,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${url}`,
      body: `${params || ''}`
    };
  }
}

function _request(req) {
  return fetch(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.body
  }).then((res) => {
    return res.json();
  }).catch((err) => {
    return Promise.reject(err);
  });
}

Dailymotion.prototype.getAuthorizeUrl = function() {
  return _preRequest('GET', ENDPOINTS.AUTH, {}, { response_type: 'code', client_id: this.CLIENT_ID, redirect_uri: this.REDIRECT_URI }).url;
}

Dailymotion.prototype.grantAccess = function(code) {
  return _request(_preRequest('POST', ENDPOINTS.TOKEN, {}, { grant_type: 'authorization_code', client_id: this.CLIENT_ID, client_secret: this.CLIENT_SECRET, redirect_uri: this.REDIRECT_URI, code: code }));
}

Dailymotion.prototype.getChannels = function (fields = null) {
  return _request(_preRequest('GET', ENDPOINTS.CHANNELS, {}, { fields: fields || ENDPOINTS.CHANNELS.fields.toString() }));
}

Dailymotion.prototype.getChannel = function (id, fields = null, sort = null) {
  return _request(_preRequest('GET', ENDPOINTS.CHANNEL, { id: id }, { fields: fields || ENDPOINTS.CHANNEL.fields.toString(), sort: sort || 'trending' }));
}

module.exports = Dailymotion;
