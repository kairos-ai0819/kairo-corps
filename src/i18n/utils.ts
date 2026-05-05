import ja from './ja.json';
import en from './en.json';

export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ja';

const dictionaries = { ja, en } as const;

export type Dictionary = typeof ja;

export function isLocale(value: string | undefined): value is Locale {
  return value === 'ja' || value === 'en';
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getLocaleFromUrl(url: URL): Locale {
  const segment = url.pathname.split('/').filter(Boolean)[0];
  return isLocale(segment) ? segment : defaultLocale;
}

export function localizedPath(locale: Locale, path = ''): string {
  const trimmed = path.replace(/^\//, '');
  if (locale === defaultLocale) {
    return trimmed ? `/${trimmed}` : '/';
  }
  return trimmed ? `/${locale}/${trimmed}` : `/${locale}`;
}

type DotPath<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : T[K] extends Record<string, unknown>
      ? DotPath<T[K], `${P}${K}.`>
      : never;
}[keyof T & string];

export type TranslationKey = DotPath<Dictionary>;

export function createTranslator(locale: Locale) {
  const dict = getDictionary(locale);
  return function t(key: TranslationKey): string {
    const segments = key.split('.');
    let cursor: unknown = dict;
    for (const segment of segments) {
      if (cursor && typeof cursor === 'object' && segment in (cursor as Record<string, unknown>)) {
        cursor = (cursor as Record<string, unknown>)[segment];
      } else {
        return key;
      }
    }
    return typeof cursor === 'string' ? cursor : key;
  };
}
