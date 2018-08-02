const SLACK_TOKEN = process.env.SLACK_TOKEN;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const GIPHY_UPLOAD_API = 'https://upload.giphy.com/v1/gifs';
const DEFAULT_SLACK_CHANNEL = 'DBY330P9N'; // For testing
const GET = 'GET';
const POST = 'POST';

module.exports = {
  SLACK_TOKEN,
  GIPHY_API_KEY,
  GIPHY_UPLOAD_API,
  DEFAULT_SLACK_CHANNEL,
  GET,
  POST
};
