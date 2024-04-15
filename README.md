# puppeteer-html-pdf

> HTML to PDF converter for Node.js

[![NPM](https://img.shields.io/npm/v/puppeteer-html-pdf.svg)](https://www.npmjs.com/package/puppeteer-html-pdf) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Known Vulnerabilities](https://snyk.io/test/github/ultimateakash/puppeteer-html-pdf/badge.svg)](https://snyk.io/test/github/ultimateakash/puppeteer-html-pdf/badge.svg)

---
## Versions

| Node.js          | puppeteer-html-pdf |
|------------------|:---------:|
| >=20.0.0 |   v4.x   |
|  <20.0.0 |   v3.x   |

## Installation

```sh
npm install puppeteer-html-pdf
```

```js
const htmlPDF = new PuppeteerHTMLPDF();
```

## Methods
```js
htmlPDF.setOptions(options)
htmlPDF.create(content, callback)
htmlPDF.writeFile(pdfBuffer, filePath, callback)
htmlPDF.readFile(filePath, encoding, callback)
htmlPDF.setAutoCloseBrowser(flag)
htmlPDF.closeBrowser()
```

## Usage
### Example 1
```js
const PuppeteerHTMLPDF = require('puppeteer-html-pdf');
const hbs = require('handlebars');

const htmlPDF = new PuppeteerHTMLPDF();
htmlPDF.setOptions({ format: 'A4' });

const pdfData =  {
  invoiceItems: [
    { item: 'Website Design', amount: 5000 },
    { item: 'Hosting (3 months)', amount: 2000 },
    { item: 'Domain (1 year)', amount: 1000 },
  ],
  invoiceData: {
    invoice_id: 123,
    transaction_id: 1234567,
    payment_method: 'Paypal',
    creation_date: '04-05-1993',
    total_amount: 8000,
  },
  baseUrl: 'https://ultimateakash.com'
}
const html = await htmlPDF.readFile(__dirname + '/sample.html','utf8');  
const template = hbs.compile(html);
const content = template(pdfData);
  
try {
  const pdfBuffer = await htmlPDF.create(content); 
  const filePath = `${__dirname}/sample.pdf`
  await htmlPDF.writeFile(pdfBuffer, filePath);
} catch (error) {
  console.log('PuppeteerHTMLPDF error', error);
}
```
 
### Example 2
```js 
const PuppeteerHTMLPDF = require('puppeteer-html-pdf');

const htmlPDF = new PuppeteerHTMLPDF();
const options = { 
  format: 'A4',
  path: `${__dirname}/sample.pdf`, // you can pass path to save the file
}
htmlPDF.setOptions(options);

const content = "<style> h1 {color:red;} </style> <h1>Welcome to puppeteer-html-pdf</h1>";
  
try {
  await htmlPDF.create(content); 
} catch (error) {
  console.log('PuppeteerHTMLPDF error', error);
}
```

### Example 3
```js 
const PuppeteerHTMLPDF = require('puppeteer-html-pdf');

const htmlPDF = new PuppeteerHTMLPDF();
const options = {  
  width: '219mm',
  height: '297mm', 
  margin: {
    left: '25px',
    right: '25px',
    top: '20px'
  },
  path: `${__dirname}/sample.pdf`, // you can pass path to save the file
  browserWSEndpoint: 'wss://chrome.browserless.io?token=YOUR_TOKEN'
}
htmlPDF.setOptions(options);

const content = 'https://www.google.com';
  
try {
  await htmlPDF.create(content); 
} catch (error) {
  console.log('PuppeteerHTMLPDF error', error);
}
```

### Example 4
```js 
const PuppeteerHTMLPDF = require('puppeteer-html-pdf');

const htmlPDF = new PuppeteerHTMLPDF();
htmlPDF.setOptions({ format: 'A4', timeout: 60000 });
htmlPDF.setAutoCloseBrowser(false)

const urls = [
  'https://www.google.com', 
  'https://www.yahoo.com', 
  'https://www.bing.com',
  'https://www.yandex.com',
  'https://www.duckduckgo.com',
  'https://www.ask.com',
  'https://www.aol.com',
];
try {
  const pdfPromises = urls.map(async (url, index) => {

    const pdfBuffer = await htmlPDF.create(url);

    const filePath = `${__dirname}/PDF_${index + 1}.pdf`
    await htmlPDF.writeFile(pdfBuffer, filePath);

    console.log(`Generated PDF from ${url}`);
  });

  await Promise.all(pdfPromises);

} catch (error) {
  console.log('PuppeteerHTMLPDF error', error);
}
finally {
  await htmlPDF.closeBrowser();
}
```

### Example 5
```js 
const PuppeteerHTMLPDF = require('puppeteer-html-pdf');

const htmlPDF = new PuppeteerHTMLPDF();
htmlPDF.setOptions({ format: 'A4' }); 

const content1 = 'https://www.google.com'; 
const content2 = 'https://www.yahoo.com'; 
  
try {
  htmlPDF.setAutoCloseBrowser(false)
  const pdfBuffer1 = await htmlPDF.create(content1); 
  const filePath1 = `${__dirname}/google.pdf`
  await htmlPDF.writeFile(pdfBuffer1, filePath1);

  const pdfBuffer2 = await htmlPDF.create(content2); 
  const filePath2 = `${__dirname}/yahoo.pdf`
  await htmlPDF.writeFile(pdfBuffer2, filePath2);
} catch (error) {
  console.log('PuppeteerHTMLPDF error', error);
}
finally {
  await htmlPDF.closeBrowser();
}
```

## Options

| Property            | Modifiers             | Type                                      | Description                                                                                                                                                                                                                                                                                                                                                                     | Default                                                                  |
| ------------------- | --------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| displayHeaderFooter | `optional` | boolean                                   | Whether to show the header and footer.                                                                                                                                                                                                                                                                                                                                          | `false`                                                       |
| footerTemplate      | `optional` | string                                    | HTML template for the print footer. Has the same constraints and support for special classes as PDFOptions.headerTemplate.                                                                                                                                                                                                                         |                                                                          |
| format              | `optional` | PaperFormat                               |                                                                                                                                                                                                                                                                                                                                                                                 | `letter`.                                                     |
| headerTemplate      | `optional` | string                                    | <p>HTML template for the print header. Should be valid HTML with the following classes used to inject values into them:</p><p>- `date` formatted print date</p><p>- `title` document title</p><p>- `url` document location</p><p>- `pageNumber` current page number</p><p>- `totalPages` total pages in the document</p> |                                                                          |
| height              | `optional` | string \| number                          | Sets the height of paper. You can pass in a number or a string with a unit.                                                                                                                                                                                                                                                                                                     |                                                                          |
| landscape           | `optional` | boolean                                   | Whether to print in landscape orientation.                                                                                                                                                                                                                                                                                                                                      | `false`                                                       |
| margin              | `optional` | PDFMargin                                 | Set the PDF margins.                                                                                                                                                                                                                                                                                                                                                            | `undefined` no margins are set.                               |
| omitBackground      | `optional` | boolean                                   | Hides default white background and allows generating pdfs with transparency.                                                                                                                                                                                                                                                                                                    | `false`                                                       |
| pageRanges          | `optional` | string                                    | Paper ranges to print, e.g. `1-5, 8, 11-13`.                                                                                                                                                                                                                                                                                                                         | The empty string, which means all pages are printed.                     |
| path                | `optional` | string                                    | The path to save the file to.                                                                                                                                                                                                                                                                                                                                                   | `undefined`, which means the PDF will not be written to disk. |
| preferCSSPageSize   | `optional` | boolean                                   | Give any CSS `@page` size declared in the page priority over what is declared in the `width` or `height` or `format` option.                                                                                                                                                                                                        | `false`, which will scale the content to fit the paper size.  |
| printBackground     | `optional` | boolean                                   | Set to `true` to print background graphics.                                                                                                                                                                                                                                                                                                                          | `true`                                                       |
| scale               | `optional` | number                                    | Scales the rendering of the web page. Amount must be between `0.1` and `2`.                                                                                                                                                                                                                                                                               | `1`                                                           |
| timeout             | `optional` | number                                    | Timeout in milliseconds. Pass `0` to disable timeout.                                                                                                                                                                                                                                                                                                                | `30_000`                                                      |
| width               | `optional` | string \| number                          | Sets the width of paper. You can pass in a number or a string with a unit.                                                                                                                                                                                                                                                                                                      |                                                                          |
| headless               | `optional` | boolean \| string                          | Sets Chromium launch mode.                                                                                                                                                                                                                                                                                                      |                                                                    `new`      |
| args               | `optional` | array                          | Sets Chromium flags mode.                                                                                                                                                                                                                                                                                                      |                                                                    `['--no-sandbox', '--disable-setuid-sandbox']`      |
| authorization               | `optional` | string                          | HTTP header to be sent with every request.                                                                                                                                                                                                                                                                                                 |                    |
| browserWSEndpoint               | `optional` | string                          | WS Endpoint(`wss://chrome.browserless.io?token=YOUR_TOKEN`).                                                                                                                                                                                                                                                                                                 |                    |
| executablePath               | `optional` | string                          | Executable path(`C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`).                                                                                                                                                                                                                                                                                                 |                    |
### Format

The sizes of each format are as follows:

- `Letter`: 8.5in x 11in

- `Legal`: 8.5in x 14in

- `Tabloid`: 11in x 17in

- `Ledger`: 17in x 11in

- `A0`: 33.1in x 46.8in

- `A1`: 23.4in x 33.1in

- `A2`: 16.54in x 23.4in

- `A3`: 11.7in x 16.54in

- `A4`: 8.27in x 11.7in

- `A5`: 5.83in x 8.27in

- `A6`: 4.13in x 5.83in


### Margin

| Property | Modifiers             | Type             |
| -------- | --------------------- | ---------------- |
| bottom   | <code>optional</code> | string \| number |
| left     | <code>optional</code> | string \| number |
| right    | <code>optional</code> | string \| number |
| top      | <code>optional</code> | string \| number |

### Linux Troubleshooting
Install chromium 
```sh
sudo apt update
```
```sh
sudo apt install chromium
```
After chromium installation, if you still get missing dependencies issue. Install below dependencies.
```sh
sudo apt install ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
```
https://pptr.dev/troubleshooting#chrome-headless-doesnt-launch-on-unix
