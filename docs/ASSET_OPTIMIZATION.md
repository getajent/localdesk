# Asset Optimization Guidelines

## Current Implementation

The LocalDesk landing page currently uses **inline SVG elements** for all decorative graphics rather than external image files. This approach provides several performance benefits:

1. **No HTTP requests**: SVG elements are embedded directly in the HTML
2. **Minimal file size**: Simple geometric shapes are extremely lightweight
3. **Scalable**: SVG graphics scale perfectly at any resolution
4. **CSS controllable**: Colors, opacity, and transforms can be controlled via CSS

## Inline SVG Assets

### Hero Section Decorative Elements
- Top-right circle: ~200 bytes (inline SVG)
- Bottom-left rectangle: ~250 bytes (inline SVG)
- Center accent circle: ~200 bytes (inline SVG)

Total decorative asset size: **~650 bytes** (well under the 200KB requirement)

## Future Image Guidelines

If external images are added to the landing page in the future, follow these guidelines:

### Image Format Selection

1. **WebP with fallbacks**: Use WebP format for modern browsers with JPEG/PNG fallbacks
   ```tsx
   <picture>
     <source srcSet="/image.webp" type="image/webp" />
     <img src="/image.jpg" alt="Description" loading="lazy" />
   </picture>
   ```

2. **SVG for icons and logos**: Use SVG format for scalable graphics
3. **JPEG for photographs**: Use JPEG with 80-85% quality for photographic content
4. **PNG for transparency**: Use PNG only when transparency is required

### Size Constraints

- **Background images**: Maximum 200KB per image
- **Decorative assets**: Maximum 100KB per asset
- **Icons**: Use SVG or icon fonts (minimal size)
- **Hero images**: Maximum 300KB (if added)

### Optimization Tools

1. **ImageOptim** (Mac): Lossless compression for PNG/JPEG
2. **Squoosh** (Web): Google's image compression tool
3. **SVGO**: SVG optimization tool
4. **Sharp** (Node.js): Automated image processing

### Next.js Image Optimization

Use Next.js `<Image>` component for automatic optimization:

```tsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Description"
  width={1200}
  height={600}
  priority={false} // Set to true for above-fold images
  quality={85}
  placeholder="blur"
/>
```

Benefits:
- Automatic format conversion (WebP/AVIF)
- Responsive image sizing
- Lazy loading by default
- Blur placeholder support

## Verification

To verify asset sizes in the future:

```bash
# Check file sizes in public directory
du -sh public/**/*.{jpg,png,webp,svg}

# Run Lighthouse audit
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Run audit
```

## Current Status

✅ All decorative elements use inline SVG (optimal)
✅ No external image files to optimize
✅ Total decorative asset size: ~650 bytes
✅ Meets requirement: Assets < 200KB

## Recommendations

1. **Keep using inline SVG** for simple decorative elements
2. **Use Next.js Image component** if adding photographs or complex images
3. **Implement LazyImage component** (already created) for below-fold images
4. **Monitor bundle size** with `npm run build` to ensure CSS remains minimal
