const PuppeteerHTMLPDF = require('../lib');
const hbs = require('handlebars');

const createPDF = async () => {
  const htmlPDF = new PuppeteerHTMLPDF();
  const options = {
    format: 'A4',
    // path: `${__dirname}/sample.pdf` 
  }
  htmlPDF.setOptions(options);

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
      total_amount: 141.5,
    },
    baseUrl: 'https://ultimateakash.com'
  }
  // const content = "<style> h1 {color:red;} </style> <h1>Welcome to puppeteer-html-pdf</h1>";
  // const content = 'https://www.google.com'; 
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
}

createPDF();