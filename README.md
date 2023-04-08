# puppeteer-html-pdf

> HTML to PDF converter

## Installation

```sh
npm install puppeteer-html-pdf
```

## Usage

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

// const content = '<h1>Welcome to puppeteer-html-pdf</h1>';
// const content = 'https://www.google.com';
const content  = await readFile(__dirname + '/sample.html','utf8'); 

try {
  const buffer = await htmlPDF.create(content, options);
  await writeFile('sample.pdf', buffer);
} catch (error) {
  console.log('htmlPDF error', error);
}
```

### htmlPDF.create(content, options, callback)
 
