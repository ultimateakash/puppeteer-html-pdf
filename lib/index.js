const puppeteer = require('puppeteer');
const omit = require('lodash/omit');
const isUrl = require('is-url');
const fs = require('fs').promises;

class PuppeteerHTMLPDF {
  constructor() {
    this.args = ['--no-sandbox', '--disable-setuid-sandbox'];
    this.browser = null;
    this.options = null;
    this.browserPromise = null;
    this.autoCloseBrowser = true;
  }

  async setOptions(options) {
    this.options = options;
    this.browserPromise = this.initializeBrowser();
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

    const timeout = this.options?.timeout 
      ? { timeout: this.options.timeout } 
      : {};

    if (isUrl(content)) {
      await page.goto(content, { waitUntil: ['load', 'networkidle0'], ...timeout });
    } else {
      await page.setContent(content, { waitUntil: 'networkidle0', ...timeout });
    }

    const pdfBuffer = await this.generatePDF(page);
    await this.closeBrowserIfNeeded();

    if (this.options?.browserWSEndpoint && this.browser.wsEndpoint() && !page.isClosed()) {
      await page.close();
    }

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
      return;
    }

    try {
      if (this.options?.browserWSEndpoint) {
        this.autoCloseBrowser = false;
        this.browser = await puppeteer.connect({
          browserWSEndpoint: this.options.browserWSEndpoint
        });
      } else {
        if (this.options?.args) {
          this.args = this.options.args;
        }
        const headless = (this.options?.headless !== undefined)
          ? this.options.headless
          : 'new';

        const launchOptions = {
          args: this.args,
          headless
        }

        if (this.options?.executablePath) {
          launchOptions.executablePath = this.options.executablePath;
        }

        this.browser = await puppeteer.launch(launchOptions);
      }

      this.browser.on('disconnected', () => {
        this.browser = null;
      });

      this.browser.on('error', (error) => {
        console.error('Browser error:', error);
      });

    } catch (error) {
      throw new Error(`Failed to connect to browser: ${error.message}`);
    }
  }

  setPageHeaders(page) {
    const headers = {
      ...this.options?.authorization ? { Authorization: this.options.authorization } : {},
      ...this.options?.headers || {}
    };

    if (Object.keys(headers).length > 0) {
      page.setExtraHTTPHeaders(headers);
    }
  }


  async generatePDF(page) {
    const data = await page.pdf({
      ...omit(this.options, ['authorization', 'executablePath', 'args', 'headless', 'headers']),
      printBackground: (this.options?.printBackground !== undefined)
        ? this.options.printBackground
        : true
    });
    return Buffer.from(data);
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async closeBrowserTabs() {
    const pages = await this.browser.pages();
    for (let i = 1; i < pages.length; i++) {
      await pages[i].close();
    }
  }
}

module.exports = PuppeteerHTMLPDF;
