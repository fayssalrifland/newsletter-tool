import puppeteer from "puppeteer";

export async function scanUrlForNewsletterForm(url: string): Promise<string | null> {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(15000);

    // Try to navigate to the URL
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    } catch (error) {
      console.error(`Navigation error for ${url}:`, error);
      return null;
    }

    // Look for forms with email inputs
    const hasNewsletterForm = await page.evaluate(() => {
      const forms = Array.from(document.getElementsByTagName('form'));

      for (const form of forms) {
        // Look for email input
        const emailInput = form.querySelector('input[type="email"]') || 
                         form.querySelector('input[placeholder*="email" i]') ||
                         form.querySelector('input[name*="email" i]');

        // Look for submit button
        const submitButton = form.querySelector('input[type="submit"]') ||
                          form.querySelector('button[type="submit"]') ||
                          form.querySelector('button:not([type])');

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