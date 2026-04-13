import * as rootParams from 'next/root-params';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const parameterValue = await rootParams.locale();
    locale = hasLocale(routing.locales, parameterValue) ? parameterValue : routing.defaultLocale;
  }
  console.log('locale', locale);

  const messagesModule = await import(`../../messages/${locale}.json`);
  const { default: messages } = messagesModule;

  return {
    locale,
    messages,
  };
});
