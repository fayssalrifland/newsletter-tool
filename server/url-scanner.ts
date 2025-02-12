import * as cheerio from 'cheerio';

export async function scanUrlForNewsletterForm(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Look for newsletter-specific forms and inputs
    const forms = $('form');

    for (let i = 0; i < forms.length; i++) {
      const form = forms.eq(i);

      // Check for common newsletter form indicators
      const hasNewsletterContext = form.text().toLowerCase().includes('newsletter') ||
                                form.text().toLowerCase().includes('subscribe') ||
                                form.closest('div').text().toLowerCase().includes('newsletter') ||
                                form.closest('div').text().toLowerCase().includes('subscribe');

      // Look for email input with various attributes
      const hasEmailInput = 
        form.find('input[type="email"]').length > 0 ||
        form.find('input[name*="email" i]').length > 0 ||
        form.find('input[placeholder*="email" i]').length > 0 ||
        form.find('input#email').length > 0 ||
        form.find('input.email').length > 0;

      // Look for submit button with newsletter-related text
      const hasSubmitButton = 
        form.find('button[type="submit"]').length > 0 ||
        form.find('input[type="submit"]').length > 0 ||
        form.find('button:contains("Subscribe")').length > 0 ||
        form.find('button:contains("Sign up")').length > 0 ||
        form.find('input[value*="Subscribe" i]').length > 0;

      // Additional check for single input form with submit button
      const isSingleInputForm = form.find('input').length === 1 && hasEmailInput && hasSubmitButton;

      if ((hasEmailInput && hasSubmitButton && (hasNewsletterContext || isSingleInputForm))) {
        const formAction = form.attr('action');
        return formAction || url;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error scanning ${url}:`, error);
    return null;
  }
}