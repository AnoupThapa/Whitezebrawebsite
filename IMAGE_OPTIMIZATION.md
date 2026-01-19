# Image Optimization Guide

## Current Images to Optimize

This guide outlines the images that need optimization for better performance.

### Logo Images

1. **whitezebra.jpeg** (`src/assets/whitezebra.jpeg`)
   - Current: JPEG format
   - Appears on every page (nav + footer)
   - Recommendations:
     - Convert to WebP with JPEG fallback
     - Target size: < 5KB
     - Already has width/height attributes added ✓

2. **logo.png** (root directory)
   - Current: PNG format, 2.6 KB
   - Status: Good file size, consider WebP conversion

3. **zebra.png** (root directory)
   - Current: PNG format, 15.9 KB
   - Recommendations:
     - Compress PNG or convert to WebP
     - Target size: < 10KB

### Blog Images (`src/blogs_images/`)

All images in this directory should be:

- Converted to WebP format
- Compressed to reduce file size
- Served with `<picture>` element for fallbacks

## Image Optimization Tools

### Option 1: Online Tools (Quick)

- **TinyPNG** (https://tinypng.com/) - PNG/JPEG compression
- **Squoosh** (https://squoosh.app/) - Convert to WebP, adjust quality
- **Optimizilla** (https://imagecompressor.com/) - Batch compression

### Option 2: Command Line (Automated)

Install Sharp (Node.js):

```bash
npm install sharp --save-dev
```

Then run the optimization script (see `optimize-images.js`)

### Option 3: Build-Time Optimization

Use the optimization script provided to automatically:

1. Compress existing images
2. Generate WebP versions
3. Update HTML to use `<picture>` elements

## Implementation Steps

1. **Backup original images**

   ```bash
   mkdir src/assets/originals
   copy src/assets/*.jpeg src/assets/originals/
   copy src/assets/*.png src/assets/originals/
   copy src/assets/*.jpg src/assets/originals/
   ```

2. **Run image optimization**

   ```bash
   node optimize-images.js
   ```

3. **Update HTML** (Optional - if using `<picture>` element)
   Replace:

   ```html
   <img src="image.jpeg" alt="Description" />
   ```

   With:

   ```html
   <picture>
     <source srcset="image.webp" type="image/webp" />
     <img
       src="image.jpeg"
       alt="Description"
       width="X"
       height="Y"
       loading="lazy"
     />
   </picture>
   ```

4. **Test**
   - Verify images load correctly in all browsers
   - Check file sizes reduced
   - Re-run PageSpeed Insights

## Expected Results

- **Estimated savings**: ~1,016 KiB (as per PageSpeed report)
- **LCP improvement**: Faster Largest Contentful Paint
- **Overall performance**: +5-10 points increase in mobile score

## Notes

- All images now have explicit `width` and `height` attributes ✓
- Logo images use `loading="eager"` for immediate visibility ✓
- Below-the-fold images can use `loading="lazy"` for deferred loading
