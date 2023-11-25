declare module 'puppeteer-html-pdf' {
    import { Page } from 'puppeteer';
  
    interface PuppeteerHTMLPDFOptions {
      args?: string[];
      headless?: boolean;
      printBackground?: boolean;
      authorization?: string;
      browserWSEndpoint?: string;
      // Add any additional options properties here
    }
  
    class PuppeteerHTMLPDF {
      constructor();
  
      setOptions(options: PuppeteerHTMLPDFOptions): Promise<void>;
  
      getPage(): Promise<Page>;
  
      create(
        content: string,
        callback?: (error: Error | null, pdfBuffer?: Buffer) => void
      ): Promise<Buffer>;
  
      writeFile(
        pdfBuffer: Buffer,
        filePath: string,
        callback?: (error: Error | null, filePath?: string) => void
      ): Promise<string>;
  
      readFile(
        filePath: string,
        encoding: string,
        callback?: (error: Error | null, content?: string) => void
      ): Promise<string>;
  
      setAutoCloseBrowser(flag: boolean): void;
  
      closeBrowserIfNeeded(): Promise<void>;
  
      initializeBrowser(): Promise<void>;
  
      setPageHeaders(page: Page): void;
  
      generatePDF(page: Page): Promise<Buffer>;
  
      closeBrowser(): Promise<void>;
    }
  
    export = PuppeteerHTMLPDF;
  }
  