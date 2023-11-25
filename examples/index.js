const PuppeteerHTMLPDF = require('../lib');
const hbs = require('handlebars');

const createPDF = async () => {
  const htmlPDF = new PuppeteerHTMLPDF();
  const options = {
    format: 'A4'
  }
  htmlPDF.setOptions(options); 

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
}

createPDF();