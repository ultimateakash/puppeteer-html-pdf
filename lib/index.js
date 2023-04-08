const puppeteer = require('puppeteer');
const { omit, has } = require('lodash');
const hbs = require('handlebars');
const isUrl = require('is-url');

/**
 * @param {String} content HTML | URL
 * @param {Object} options
 * @param {String} [options.context] Dynamic Data For PDF Template
 * @param {Function} [callback]   
 * @return {Promise|Function} Promise OR Callback
 */
const create = async (content, options, callback) => {
  let args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ];
  if (options.args) args = options.args;
  const headless = options.headless || true;
  const isCallback = (typeof callback === 'function');

  const browser = await puppeteer.launch({ args, headless });
  const page = await browser.newPage();

  options = omit(options, ['args', 'headless']);

  if (isUrl(content)) {
    await page.goto(content, { waitUntil: ['load', 'networkidle0'] });
  } else {
    const template = hbs.compile(content);
    const html = template(options.context || {});
    await page.setContent(html, { waitUntil: 'networkidle0' });
  }

  const promise = new Promise((resolve) => {
    resolve(page.pdf({
      ...omit(options, 'context'),
      printBackground: has(options, 'printBackground')
        ? options.printBackground
        : true
    }))
  });

  return promise.then(async (data) => {
    await browser.close();
    const pdfBuffer = Buffer.from(data);
    return isCallback ? callback(null, pdfBuffer) : pdfBuffer;
  }, error => {
    return isCallback ? callback(err, null) : error;
  });

}

module.exports = { create }; 
