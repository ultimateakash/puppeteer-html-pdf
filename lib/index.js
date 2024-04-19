const puppeteer = require('puppeteer');
const omit = require('lodash/omit');
const pick = require('lodash/pick');
const has = require('lodash/has');
const isUrl = require('is-url');
const fs = require('fs').promises;

class PuppeteerHTMLPDF {
  constructor() {
    this.args = ['--no-sandbox', '--disable-setuid-sandbox'];
    this.browser = null;
    this.options = null;
    this.browserPromise = null;
    this.autoCloseBrowser = true; // Default behavior is to close the browser after generating a PDF
  }

  async setOptions(options) {
    this.options = options;
    if (has(options, 'browserWSEndpoint')) {
      this.autoCloseBrowser = false;
      this.browserPromise = puppeteer.connect({ browserWSEndpoint: options.browserWSEndpoint });
      this.browser = await this.browserPromise;
    } else {
      this.browserPromise = this.initializeBrowser();
      await this.browserPromise;
    }
  }

  async getPage() {
    await this.browserPromise;
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }
    const page = await this.browser.newPage();
    this.setPageHeaders(page);
    return page;
  }

  async create(content, callback) {
    await this.browserPromise;
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }
    const isCallback = typeof callback === 'function';
    const page = await this.getPage();
    const timeout = pick(this.options, 'timeout')

    if (isUrl(content)) {
      await page.goto(content, { waitUntil: ['load', 'networkidle0'], ...timeout });
    } else {
      await page.setContent(content, { waitUntil: 'networkidle0', ...timeout });
    }

    const pdfBuffer = await this.generatePDF(page);
    await this.closeBrowserIfNeeded(); // Close the browser if needed after generating PDF

    if (isCallback) {
      return callback(null, pdfBuffer);
    } else {
      return pdfBuffer;
    }
  }

  async writeFile(pdfBuffer, filePath, callback) {
    try {
      await fs.writeFile(filePath, pdfBuffer);
      if (typeof callback === 'function') {
        callback(null, filePath);
      }
      return filePath;
    } catch (error) {
      if (typeof callback === 'function') {
        callback(error, null);
      }
      throw error;
    }
  }

  async readFile(filePath, encoding, callback) {
    try {
      const content = await fs.readFile(filePath, encoding);
      if (typeof callback === 'function') {
        callback(null, content);
      }
      return content;
    } catch (error) {
      if (typeof callback === 'function') {
        callback(error, null);
      }
      throw new Error(`Error reading file: ${filePath}. ${error.message}`);
    }
  }

  setAutoCloseBrowser(flag) {
    this.autoCloseBrowser = flag;
  }

  async closeBrowserIfNeeded() {
    if (this.browser && this.autoCloseBrowser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async initializeBrowser() {
    if (this.browser) {
      return; // Browser already initialized
    }

    if (this.options && this.options.args) {
      this.args = this.options.args;
    }

    const headless = this.options && has(this.options, 'headless') ? this.options.headless : 'new';

    const launchOptions = {
      args: this.args,
      headless
    }

    if (this.options && this.options.executablePath) {
      launchOptions.executablePath = this.options.executablePath;
    }

    this.browser = await puppeteer.launch(launchOptions);

    this.browser.on('disconnected', () => {
      this.browser = null;
    });
  }

  setPageHeaders(page) {
    if (this.options && has(this.options, 'authorization')) {
      page.setExtraHTTPHeaders({ Authorization: this.options.authorization });
    }
  }

  async generatePDF(page) {
    const data = await page.pdf({
      ...omit(this.options, ['authorization', 'args', 'headless']),
      printBackground: has(this.options, 'printBackground') ? this.options.printBackground : true,
    });
    return Buffer.from(data);
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = PuppeteerHTMLPDF;
