const Twilio = require('twilio');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER
} = process.env;

const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// TODO: store somewhere else
const recipients = {
  alex: '+16508239124',
  bot: '+16508239124' // same as above, just testing multiple users
};

const send = (msg, recipient) => {
  if (!msg) return Promise.reject(new Error('A message is required!'));
  if (!recipient || !recipients[recipient]) {
    return Promise.reject(new Error(`"${recipient}" is not a valid recipient!`));
  }

  const to = recipients[recipient];
  const message = {
    to,
    body: msg,
    from: TWILIO_PHONE_NUMBER
  };

  return client.messages.create(message);
};

module.exports = {
  send
};
