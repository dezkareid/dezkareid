export type SocialPlatform = 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'direct';
export type EntityType = 'profile' | 'collection' | 'item';

/**
 * Appends UTM parameters to a URL for marketing analysis.
 */
export function getUtmTaggedUrl(
  baseUrl: string,
  platform: SocialPlatform,
  entityType: EntityType,
  campaign: string = 'share',
): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', platform);
    url.searchParams.set('utm_medium', 'social');
    url.searchParams.set('utm_campaign', campaign);
    url.searchParams.set('utm_content', entityType);
    return url.toString();
  }
  catch {
    // Return original if invalid URL
    return baseUrl;
  }
}

/**
 * Checks if the Web Share API is available in the current browser.
 */
export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Triggers the native Web Share API.
 */
export async function shareUrl(title: string, text: string, url: string): Promise<boolean> {
  if (canUseWebShare()) {
    try {
      await navigator.share({ title, text, url });
      return true;
    }
    catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  }
  return false;
}

/**
 * Copies text to the clipboard using the Clipboard API.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    }
    catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
  return false;
}
