import type { BreadcrumbList, ListItem, WithContext } from 'schema-dts';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    } as ListItem)),
  };
}
