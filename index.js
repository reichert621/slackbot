const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./helpers/bot');

module.exports = express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .get('/ping', (req, res) => {
    // Test that the bot is available
    return bot.ping().then(result => res.json({ ok: !!result.ok }));
  })
  .post('/sms', (req, res) => {
    const { text = '' } = req.body;
    const [user, ...msg] = text.split(' ');
    const message = msg.join(' ');

    return bot.sendSms(user, message)
      .then(() => res.send('Sent!'))
      .catch(err => res.send(err && err.message));
  })
  .post('/component', (req, res) => {
    // Placeholder in case we want to add interactive components
    try {
      const { payload } = req.body;
      const json = JSON.parse(payload);
      const { callback_id: id, actions = [] } = json;

      bot.handleCallbackId(id, actions);

      return res.send(true);
    } catch (err) {
      return res.send(err);
    }
  })
  .post('/event', (req, res) => {
    const { token, challenge, type, event = {} } = req.body;
    console.log('Processing event:', event);
    const { channel, files = [] } = event;
    const hasVideo = files.some(file => file.mimetype.indexOf('video') !== -1);

    if (channel && hasVideo) {
      bot.handleVideoEvent(channel, files);

      return res.send(true);
    } else {
      return res.send(challenge);
    }
  })
  .listen(1337, () => {
    console.log('Listening on port 1337');
  });
