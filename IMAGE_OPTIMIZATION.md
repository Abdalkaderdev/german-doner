# Image Optimization Guide

## 🚀 Performance Improvements

This guide explains how to optimize images for faster loading and better performance.

## Quick Start

1. **Optimize all images:**
   ```bash
   npm run images:optimize
   ```

2. **Convert PNG to WebP:**
   ```bash
   npm run images:webp
   ```

## What the Optimization Script Does

The `scripts/optimize-images.mjs` script:

- **Compresses images** using Sharp with optimal quality settings
- **Generates multiple sizes** for responsive loading:
  - `thumbnail` (150px) - for small previews
  - `small` (300px) - for mobile devices
  - `medium` (600px) - for tablets
  - `large` (1200px) - for desktop
  - `full` (800px) - for high-res displays
- **Converts to WebP** format for modern browsers
- **Provides JPG fallbacks** for older browsers
- **Maintains aspect ratios** without distortion

## Expected Results

Based on current image sizes:
- **Original total**: ~115MB (including large TIF files)
- **Expected optimized**: ~15-25MB
- **Performance gain**: 70-80% size reduction
- **Loading speed**: 3-5x faster on mobile

## How It Works

1. **Responsive Images**: The `ImageOptimized` component automatically serves the right image size based on device
2. **WebP First**: Modern browsers get WebP, older browsers get JPG fallbacks
3. **Lazy Loading**: Images load only when needed (except priority images like logos)
4. **Proper Sizing**: Images are sized appropriately for their display context

## File Structure After Optimization

```
public/images/
├── optimized/           # New optimized images
│   ├── logo-thumbnail.webp
│   ├── logo-small.webp
│   ├── logo-medium.webp
│   ├── logo-large.webp
│   ├── logo.webp
│   └── logo.jpg
└── original/            # Original images (can be deleted after testing)
```

## Browser Support

- **WebP**: Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
- **Fallback**: JPG for older browsers
- **Progressive**: Images load progressively for better UX

## Performance Tips

1. **Run optimization** before each deployment
2. **Delete unused images** to reduce bundle size
3. **Use appropriate sizes** in your components
4. **Set priority loading** for above-the-fold images
5. **Monitor Core Web Vitals** in production

## Monitoring Performance

Check these metrics after optimization:
- **Largest Contentful Paint (LCP)**: Should improve significantly
- **Cumulative Layout Shift (CLS)**: Should remain stable
- **First Input Delay (FID)**: Should improve slightly

## Troubleshooting

If images don't load:
1. Check that optimization script completed successfully
2. Verify `public/images/optimized/` directory exists
3. Ensure image paths in `imageMap.ts` are correct
4. Check browser console for 404 errors

## Advanced Configuration

You can modify quality settings in `scripts/optimize-images.mjs`:
```javascript
const QUALITY = {
  webp: 80,    // Lower = smaller files, lower quality
  jpg: 85,     // Adjust based on your needs
  png: 90
};
```

## Next Steps

After optimization:
1. Test the site thoroughly
2. Monitor performance metrics
3. Consider implementing a CDN for global delivery
4. Set up proper caching headers
5. Monitor Core Web Vitals in production
