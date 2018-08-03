const { WebClient } = require('@slack/client');
const gif = require('./gif');
const twilio = require('./twilio');
const { SLACK_TOKEN } = require('./utils');

const web = new WebClient(SLACK_TOKEN);

const ping = () => web.api.test();

const getChannels = () => web.channels.list().then(res => res.channels);

const getIms = () => web.im.list().then(res => res.ims);

const sendMessage = (text, channel) => {
  console.log(`Sending ${text} to ${channel}!`);

  return web.chat.postMessage({ channel, text });
};

const handleVideoEvent = (channel, files = []) => {
  const promises = files
    .filter(file => file.mimetype.indexOf('video') !== -1)
    .map(file => {
      const { url_private: url } = file;

      return gif
        .createFromSlackUrl(url)
        .then(result => sendMessage(result, channel))
        .catch(err => console.log('Error uploading url:', url, err));
    });

  return Promise.all(promises);
};

const handleCallbackId = (callbackId, actions = []) => {
  // Currently unused
  switch (callbackId) {
    default:
      return console.log('Unimplemented:', callbackId, actions);
  }
};

const sendSms = (user, message = '') => {
  return twilio.send(message, user)
    .then(msg => console.log(`Successfully sent "${message}" to @${user}!`));
};

module.exports = {
  ping,
  getChannels,
  getIms,
  sendMessage,
  handleVideoEvent,
  handleCallbackId,
  sendSms
};
