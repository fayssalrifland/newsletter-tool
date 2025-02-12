import * as cheerio from 'cheerio';

export async function scanUrlForNewsletterForm(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Look for forms with email inputs
    const forms = $('form');
    for (let i = 0; i < forms.length; i++) {
      const form = forms.eq(i);

      // Look for email input
      const hasEmailInput = form.find('input[type="email"]').length > 0 ||
                          form.find('input[placeholder*="email" i]').length > 0 ||
                          form.find('input[name*="email" i]').length > 0;

      // Look for submit button
      const hasSubmitButton = form.find('input[type="submit"]').length > 0 ||
                             form.find('button[type="submit"]').length > 0 ||
                             form.find('button:not([type])').length > 0;

      if (hasEmailInput && hasSubmitButton) {
        // Get the form's action URL or default to the page URL
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