# puppeteer-html-pdf

> HTML to PDF converter

[![NPM](https://img.shields.io/npm/v/puppeteer-html-pdf.svg)](https://www.npmjs.com/package/puppeteer-html-pdf) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Known Vulnerabilities](https://snyk.io/test/github/ultimateakash/puppeteer-html-pdf/badge.svg)](https://snyk.io/test/github/ultimateakash/puppeteer-html-pdf/badge.svg)
 
## Installation

```sh
npm install puppeteer-html-pdf
```

## Signature
```js
htmlPDF.create(content, options, callback)
```

## Usage
### Example 1
```js
const fs = require('fs');
const util = require('util');
const htmlPDF = require('puppeteer-html-pdf');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const pdfContext = {
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
    total_amount: 141.5,
  },
  baseUrl: 'https://ultimateakash.com'
}

const options = {
  format: 'A4',
  context: pdfContext,
} 
const content = await readFile(__dirname + '/sample.html','utf8'); 

try {
  const buffer = await htmlPDF.create(content, options);
  await writeFile('sample.pdf', buffer);
} catch (error) {
  console.log('htmlPDF error', error);
}
```
 
### Example 2
```js 
const htmlPDF = require('puppeteer-html-pdf'); 
 
const options = { 
  format: 'A4',
  path: `${__dirname}/sample.pdf` 
}

const content = '<h1>Welcome to puppeteer-html-pdf</h1>'; 

try {
  await htmlPDF.create(content, options); 
} catch (error) {
  console.log('htmlPDF error', error);
}
```

### Example 3
```js 
const htmlPDF = require('puppeteer-html-pdf'); 
 
const options = { 
  format: 'A4',
  path: `${__dirname}/sample.pdf` 
}

const content = 'https://www.google.com';

try {
  await htmlPDF.create(content, options); 
} catch (error) {
  console.log('htmlPDF error', error);
}
```

## Options

| Property            | Modifiers             | Type                                      | Description                                                                                                                                                                                                                                                                                                                                                                     | Default                                                                  |
| ------------------- | --------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| displayHeaderFooter | `optional` | boolean                                   | Whether to show the header and footer.                                                                                                                                                                                                                                                                                                                                          | `false`                                                       |
| footerTemplate      | `optional` | string                                    | HTML template for the print footer. Has the same constraints and support for special classes as [PDFOptions.headerTemplate](./puppeteer.pdfoptions.md).                                                                                                                                                                                                                         |                                                                          |
| format              | `optional` | [PaperFormat](./puppeteer.paperformat.md) |                                                                                                                                                                                                                                                                                                                                                                                 | `letter`.                                                     |
| headerTemplate      | `optional` | string                                    | <p>HTML template for the print header. Should be valid HTML with the following classes used to inject values into them:</p><p>- `date` formatted print date</p><p>- `title` document title</p><p>- `url` document location</p><p>- `pageNumber` current page number</p><p>- `totalPages` total pages in the document</p> |                                                                          |
| height              | `optional` | string \| number                          | Sets the height of paper. You can pass in a number or a string with a unit.                                                                                                                                                                                                                                                                                                     |                                                                          |
| landscape           | `optional` | boolean                                   | Whether to print in landscape orientation.                                                                                                                                                                                                                                                                                                                                      | `false`                                                       |
| margin              | `optional` | [PDFMargin](./puppeteer.pdfmargin.md)     | Set the PDF margins.                                                                                                                                                                                                                                                                                                                                                            | `undefined` no margins are set.                               |
| omitBackground      | `optional` | boolean                                   | Hides default white background and allows generating pdfs with transparency.                                                                                                                                                                                                                                                                                                    | `false`                                                       |
| pageRanges          | `optional` | string                                    | Paper ranges to print, e.g. `1-5, 8, 11-13`.                                                                                                                                                                                                                                                                                                                         | The empty string, which means all pages are printed.                     |
| path                | `optional` | string                                    | The path to save the file to.                                                                                                                                                                                                                                                                                                                                                   | `undefined`, which means the PDF will not be written to disk. |
| preferCSSPageSize   | `optional` | boolean                                   | Give any CSS `@page` size declared in the page priority over what is declared in the `width` or `height` or `format` option.                                                                                                                                                                                                        | `false`, which will scale the content to fit the paper size.  |
| printBackground     | `optional` | boolean                                   | Set to `true` to print background graphics.                                                                                                                                                                                                                                                                                                                          | `false`                                                       |
| scale               | `optional` | number                                    | Scales the rendering of the web page. Amount must be between `0.1` and `2`.                                                                                                                                                                                                                                                                               | `1`                                                           |
| timeout             | `optional` | number                                    | Timeout in milliseconds. Pass `0` to disable timeout.                                                                                                                                                                                                                                                                                                                | `30_000`                                                      |
| width               | `optional` | string \| number                          | Sets the width of paper. You can pass in a number or a string with a unit.                                                                                                                                                                                                                                                                                                      |                                                                          |


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