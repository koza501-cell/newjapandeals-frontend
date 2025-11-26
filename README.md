# New Japan Deals - SEO-Optimized Frontend

A fully SEO-optimized Next.js frontend for the Japanese watch e-commerce store.

## SEO Features

- ✅ Server-Side Rendering (SSR) for all pages
- ✅ JSON-LD Schema.org markup (Product, Organization, BreadcrumbList, WebSite)
- ✅ Dynamic sitemap.xml generation
- ✅ robots.txt configuration
- ✅ Open Graph & Twitter Card meta tags
- ✅ Clean, SEO-friendly URLs
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Mobile-first responsive design
- ✅ Fast page load with image optimization
- ✅ Canonical URLs on all pages

## Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. Create a GitHub repository
2. Push this code to the repository
3. Go to [vercel.com](https://vercel.com)
4. Click "Add New Project"
5. Import your GitHub repository
6. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://api.newjapandeals.com`
7. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
cd njd-frontend
vercel
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=https://api.newjapandeals.com
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Domain Configuration

After deployment, add your custom domain in Vercel:

1. Go to your project in Vercel
2. Settings → Domains
3. Add `newjapandeals.com`
4. Follow DNS configuration instructions

## Post-Deployment SEO Checklist

1. [ ] Submit sitemap to Google Search Console
2. [ ] Submit sitemap to Bing Webmaster Tools
3. [ ] Set up Google Analytics
4. [ ] Verify site ownership in Search Console
5. [ ] Monitor Core Web Vitals
