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

    // Look for forms with email inputs
    const forms = $('form');

    for (let i = 0; i < forms.length; i++) {
      const form = forms.eq(i);

      // Look for email input
      const hasEmailInput = 
        form.find('input[type="email"]').length > 0 ||
        form.find('input[name*="email" i]').length > 0 ||
        form.find('input[placeholder*="email" i]').length > 0 ||
        form.find('input#email').length > 0 ||
        form.find('input.email').length > 0;

      // Check for unwanted elements (name fields, checkboxes, radio buttons)
      const hasNameField = 
        form.find('input[name*="name" i]').length > 0 ||
        form.find('input[placeholder*="name" i]').length > 0 ||
        form.find('input#name').length > 0 ||
        form.find('input#firstName').length > 0 ||
        form.find('input#lastName').length > 0 ||
        form.find('input.name').length > 0;

      const hasCheckbox = form.find('input[type="checkbox"]').length > 0;
      const hasRadio = form.find('input[type="radio"]').length > 0;

      // Look for submit button
      const hasSubmitButton = 
        form.find('button[type="submit"]').length > 0 ||
        form.find('input[type="submit"]').length > 0 ||
        form.find('button:contains("Subscribe")').length > 0 ||
        form.find('button:contains("Sign up")').length > 0 ||
        form.find('input[value*="Subscribe" i]').length > 0;

      // Only return forms that have email + submit button but no name fields, checkboxes, or radio buttons
      if (hasEmailInput && hasSubmitButton && !hasNameField && !hasCheckbox && !hasRadio) {
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