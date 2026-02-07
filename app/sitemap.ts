import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://localdesk.dk';

    // Base routes that are available in all locales
    const routes = [
        '', // Home page
        '/guidance',
        '/knowledge',
        '/privacy',
        '/services',
        '/terms',
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    for (const locale of routing.locales) {
        for (const route of routes) {
            // Construct the URL: https://localdesk.dk/[locale]/[route]
            // Note: route already starts with / except for home page which is empty string
            // So we need to handle the slash carefully

            const path = route === '' ? '' : route;
            const url = `${baseUrl}/${locale}${path}`;

            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8,
            });
        }
    }

    return sitemapEntries;
}
