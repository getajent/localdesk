import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://localdesk.dk';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/dashboard/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
