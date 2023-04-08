const puppeteer = require('puppeteer');
const { omit, has } = require('lodash');
const hbs = require('handlebars'); 
const isUrl = require('is-url');

const create = async (content, options, callback) => {
  let args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ];
  if (options.args) args = options.args;
  const headless = options.headless || true;

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
    return callback ? callback(null, pdfBuffer) : pdfBuffer;
  }, error => {
    return callback ? callback(err, null) : error;
  });

}

module.exports = { create }; 
