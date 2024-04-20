declare module 'puppeteer-html-pdf' {
  import { Page, PDFOptions } from 'puppeteer';
  
  interface PuppeteerHTMLPDFOptions extends PDFOptions {
    args?: string[];
    headless?: boolean;
    authorization?: string;
    browserWSEndpoint?: string;
    executablePath?: string;
    headers?: { [key: string]: string };
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

      closeBrowserTabs(): Promise<void>;
    }
  
    export = PuppeteerHTMLPDF;
  }
  