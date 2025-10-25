# 🚀 Netlify Deployment Guide

This guide will help you deploy your Cyclopedia Next.js application to Netlify.

## 📋 Prerequisites

- A Netlify account (free at [netlify.com](https://netlify.com))
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally

## 🔧 Configuration Files

The following files have been configured for Netlify deployment:

### `netlify.toml`
- Build command: `npm run build`
- Node.js version: 18
- Next.js plugin enabled
- CORS headers configured for API routes
- Caching headers for static assets

### `next.config.ts`
- CORS headers configured
- Optimized for Netlify deployment

## 🚀 Deployment Methods

### Method 1: Git Integration (Recommended)

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your `cyclopedia-next` repository
   - Click "Deploy site"

3. **Configure Build Settings**
   - Build command: `npm run build` (should be auto-detected)
   - Publish directory: `.next` (should be auto-detected)
   - Node version: 18 (should be auto-detected)

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be available at `https://your-site-name.netlify.app`

### Method 2: Manual Deploy

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder to the deploy area
   - Your site will be deployed instantly

### Method 3: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## 🔧 Environment Variables

No environment variables are required for this deployment. The application uses:
- Static JSON files for historical data
- Public APIs for live data (NOAA, FEMA)
- No database or external services requiring credentials

## 📁 File Structure for Deployment

```
cyclopedia-next/
├── .next/                    # Build output (auto-generated)
├── archive/                  # Historical storm data
│   ├── atl/                 # Atlantic storms (1851-2024)
│   └── pac/                 # Pacific storms (1949-2024)
├── app/                     # Next.js app directory
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/              # React components
├── contexts/                # React context
├── libs/                    # Utility libraries
├── public/                  # Static assets
├── netlify.toml            # Netlify configuration
├── next.config.ts          # Next.js configuration
└── package.json            # Dependencies
```

## 🌐 API Endpoints

Your deployed application will have the following API endpoints:

- `GET /api/archive/{basin}/{year}` - Historical storm data
- `GET /api/areas-of-interest` - Current areas of interest
- `GET /api/forecast-cone` - Forecast cone data
- `GET /api/live-hurdat` - Live storm data
- `GET /api/points-of-interest` - Points of interest
- `GET /api/wind-field` - Wind field data
- `GET /api/wind-field-forecast` - Wind field forecast

## 🔍 Troubleshooting

### Build Failures

1. **Node Version Issues**
   - Ensure Node.js 18+ is specified in `netlify.toml`
   - Check Netlify build logs for version conflicts

2. **Dependency Issues**
   ```bash
   npm install
   npm run build
   ```

3. **API Route Issues**
   - Verify CORS headers in `next.config.ts`
   - Check that API routes are properly exported

### Runtime Issues

1. **API Routes Not Working**
   - Ensure `@netlify/plugin-nextjs` is enabled
   - Check function timeout settings
   - Verify CORS configuration

2. **Static Assets Not Loading**
   - Check file paths in `public/` directory
   - Verify caching headers in `netlify.toml`

3. **Map Not Loading**
   - Ensure Leaflet CSS/JS are properly imported
   - Check for HTTPS/HTTP mixed content issues

## 📊 Performance Optimization

### Caching
- Static assets are cached for 1 year
- API responses are cached appropriately
- Images are optimized for web delivery

### Build Optimization
- Next.js automatically optimizes bundles
- Tree shaking removes unused code
- Code splitting reduces initial load time

## 🔄 Continuous Deployment

Once connected to Git:
- Every push to `main` branch triggers a new deployment
- Pull requests can be previewed with deploy previews
- Rollback to previous deployments is available

## 📱 Mobile Optimization

The application is fully responsive and includes:
- Touch-friendly interface
- Progressive Web App capabilities
- Optimized for mobile performance

## 🛡️ Security

- CORS headers properly configured
- No sensitive data exposed
- HTTPS enforced by default on Netlify
- API rate limiting handled by external services

## 📈 Monitoring

Netlify provides:
- Build logs and deployment status
- Performance metrics
- Error tracking
- Analytics (with Netlify Analytics)

## 🆘 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify all configuration files
3. Test locally with `npm run build`
4. Check Netlify documentation
5. Review this deployment guide

## 🎉 Success!

Once deployed, your Cyclopedia application will be available at your Netlify URL with:
- ✅ Historical storm data (1851-2024)
- ✅ Live storm tracking
- ✅ Interactive maps
- ✅ Mobile-responsive design
- ✅ Fast loading times
- ✅ Global CDN distribution

**Happy tracking! 🌪️**
