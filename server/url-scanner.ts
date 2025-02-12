import puppeteer from "puppeteer";

export async function scanUrlForNewsletterForm(url: string): Promise<string | null> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Look for forms with email inputs
    const hasNewsletterForm = await page.evaluate(() => {
      const forms = Array.from(document.getElementsByTagName('form'));
      
      for (const form of forms) {
        const emailInput = form.querySelector('input[type="email"]') || 
                          form.querySelector('input[placeholder*="email" i]') ||
                          form.querySelector('input[name*="email" i]');
                          
        const submitButton = form.querySelector('input[type="submit"]') ||
                           form.querySelector('button[type="submit"]') ||
                           form.querySelector('button');
                           
        if (emailInput && submitButton) {
          // Get the form's action URL or default to the page URL
          const formUrl = form.getAttribute('action') || window.location.href;
          return formUrl;
        }
      }
      
      return null;
    });

    return hasNewsletterForm;
  } catch (error) {
    console.error(`Error scanning ${url}:`, error);
    return null;
  } finally {
    await browser.close();
  }
}
