const PuppeteerHTMLPDF = require('../lib');

describe('PuppeteerHTMLPDF', () => {
  let htmlPDF;

  beforeEach(() => {
    htmlPDF = new PuppeteerHTMLPDF();
  });

  afterEach(async () => {
    if (htmlPDF.browser) {
      await htmlPDF.closeBrowser();
    }
  });

  test('PDF creation from URL', async () => {
    const content = 'https://google.com';
    const options = {
      format: 'A4'
    };

    await htmlPDF.setOptions(options);
    const pdfBuffer = await htmlPDF.create(content);

    expect(pdfBuffer instanceof Buffer).toBe(true);
  });

  test('PDF creation from HTML content', async () => {
    const content = '<html><body><h1>Hello, World!</h1></body></html>';
    const options = {
      format: 'A4'
    };

    await htmlPDF.setOptions(options);
    const pdfBuffer = await htmlPDF.create(content);

    expect(pdfBuffer instanceof Buffer).toBe(true);
  });

  test('Save PDF to file', async () => {
    const content = 'https://google.com';
    const options = {
      format: 'A4'
    };

    await htmlPDF.setOptions(options);
    const pdfBuffer = await htmlPDF.create(content);

    const filePath = `${__dirname}/test3-sample.pdf`
    const savedFilePath = await htmlPDF.writeFile(pdfBuffer, filePath);

    expect(savedFilePath).toBe(filePath);
  });
});
