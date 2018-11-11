require('dotenv').config();
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

const Dailymotion = require('../lib/Dailymotion');
const dailymotion = new Dailymotion({
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  redirect_uri: REDIRECT_URI
});

(async function() {
  let url = dailymotion.getAuthorizeUrl();
  console.log(url);

  let access = await dailymotion.grantAccess('{CODE}');
  console.log(access);

  let channels = await dailymotion.getChannels();
  console.log(channels.list);

  let content = await Promise.all(channels.list.map(async channel => {
    return dailymotion.getChannel(channel.id);
  }));
  console.log(content);
})();
