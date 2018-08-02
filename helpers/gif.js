const fs = require('fs');
const request = require('request');
const { get } = require('lodash');
const {
  SLACK_TOKEN,
  GIPHY_API_KEY,
  GIPHY_UPLOAD_API,
  GET,
  POST
} = require('./utils');

const getGiphyUrl = response => {
  const id = get(response, 'data.id');

  return `https://media2.giphy.com/media/${id}/giphy.gif`;
};

const upload = file => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: GIPHY_UPLOAD_API,
        method: POST,
        formData: {
          file,
          api_key: GIPHY_API_KEY
        }
      },
      (err, result) => {
        if (err) return reject(err);

        try {
          const { body } = result;
          const json = JSON.parse(body);

          return resolve(json);
        } catch (e) {
          return reject(e);
        }
      }
    );
  });
};

const uploadStream = stream => {
  return upload(stream);
};

const uploadBuffer = (buffer, options = {}) => {
  const file = {
    options,
    value: buffer
  };

  return upload(file);
};

const createFromSlackUrl = url => {
  console.log('Uploading from Slack url:', url);
  const stream = request({
    url,
    method: GET,
    responseType: 'stream',
    rejectUnauthorized: 'false',
    headers: {
      Authorization: `Bearer ${SLACK_TOKEN}`
    }
  });

  return uploadStream(stream)
    .then(response => getGiphyUrl(response))
    .catch(err => console.log('Error uploading!', err));
};

const createFromFile = src => {
  console.log('Uploading from file:', src);
  const stream = fs.createReadStream(src);

  return uploadStream(stream)
    .then(response => getGiphyUrl(response))
    .catch(err => console.log('Error uploading!', err));
};

module.exports = {
  uploadStream,
  uploadBuffer,
  createFromSlackUrl,
  createFromFile
};
