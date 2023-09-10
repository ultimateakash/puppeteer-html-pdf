const puppeteer = require('puppeteer');
const omit = require('lodash.omit');
const has = require('lodash.has');
const isUrl = require('is-url');

/**
 * @param {String} content HTML | URL
 * @param {Object} options
 * @param {Function} [callback]
 * @return {Promise|Function} Promise | Callback
 */
const create = async (content, options, callback) => {
  let args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ];

  if (options.args) args = options.args;
  const headless = has(options, 'headless') ? options.headless : 'new';
  const isCallback = typeof callback === 'function';
  let browser = null;

  if (has(args, 'browserWSEndpoint')) {
    browser = await puppeteer.connect({
      browserWSEndpoint: args.browserWSEndpoint,
    });
  } else {
    browser = await puppeteer.launch({ args, headless });
  }

  const page = await browser.newPage();
  if (has(options, 'authorization')) {
    page.setExtraHTTPHeaders({ Authorization: options.authorization });
  }

  options = omit(options, ['authorization', 'args', 'headless']);

  if (isUrl(content)) {
    await page.goto(content, { waitUntil: ['load', 'networkidle0'] });
  } else {
    await page.setContent(content, { waitUntil: 'networkidle0' });
  }

  const promise = new Promise((resolve) => {
    resolve(
      page.pdf({
        ...options,
        printBackground: has(options, 'printBackground')
          ? options.printBackground
          : true,
      })
    );
  });

  return promise.then(
    async (data) => {
      await browser.close();
      const pdfBuffer = Buffer.from(data);
      return isCallback ? callback(null, pdfBuffer) : pdfBuffer;
    },
    (error) => {
      return isCallback ? callback(err, null) : error;
    }
  );
};

module.exports = { create };
