const scrape = require('website-scraper');
const request = require('request-promise');

const REGEX_URL = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/im;
const ROOT_URL = 'http://front.battlegroundsgame.com/index.html';

async function getUrl() {
  const response = await request(ROOT_URL);

  if (!REGEX_URL.test(response)) {
    throw 'No URL found in PUBG index.html';
  }

  url = response.match(REGEX_URL)[0];

  return url;
}

async function scrapeUrl(url) {
  const options = {
    urls: [url],
    directory: 'data'
  };

  const responses = await scrape(options);

  if (responses && responses[0] && responses[0].saved) {
    console.log('Successfully scrapped PUBG Main Menu UI.');
  } else {
    console.error('An error occured.');
  }
}

async function run() {
  const url = await getUrl();

  scrapeUrl(url);
}

try {
  run();
} catch (error) {
  console.error(error);
}
