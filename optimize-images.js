const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processImages() {
  console.log('🚀 Starting image optimization process...\n');

  const assetsDir = './src/assets';
  const blogsImagesDir = './src/blogs_images';

  // 1. Optimize whitezebra logo
  const logoPath = path.join(assetsDir, 'whitezebra.jpeg');
  if (fs.existsSync(logoPath)) {
    console.log('📦 Optimizing logo (whitezebra.jpeg)...');
    // Create a small 160px width logo (AVIF, WebP, PNG)
    await sharp(logoPath)
      .resize(160)
      .avif({ quality: 85 })
      .toFile(path.join(assetsDir, 'whitezebra-logo.avif'));
      
    await sharp(logoPath)
      .resize(160)
      .webp({ quality: 85 })
      .toFile(path.join(assetsDir, 'whitezebra-logo.webp'));

    await sharp(logoPath)
      .resize(160)
      .png({ compressionLevel: 9 })
      .toFile(path.join(assetsDir, 'whitezebra-logo.png'));
      
    // Create optimized high-res version for metadata (og:image)
    await sharp(logoPath)
      .resize(1200)
      .jpeg({ quality: 80 })
      .toFile(path.join(assetsDir, 'whitezebra-meta.jpg'));

    console.log('✅ Logo optimized! Created whitezebra-logo.avif/webp/png and whitezebra-meta.jpg');
  }

  // 2. Optimize hero-operations image
  const heroPath = path.join(assetsDir, 'hero-operations.png');
  if (fs.existsSync(heroPath)) {
    console.log('\n📦 Optimizing hero image (hero-operations.png)...');
    const widths = [400, 800, 1200];
    for (const w of widths) {
      // AVIF
      await sharp(heroPath)
        .resize(w)
        .avif({ quality: 80 })
        .toFile(path.join(assetsDir, `hero-operations-${w}.avif`));
      
      // WebP
      await sharp(heroPath)
        .resize(w)
        .webp({ quality: 80 })
        .toFile(path.join(assetsDir, `hero-operations-${w}.webp`));

      // PNG (fallback)
      await sharp(heroPath)
        .resize(w)
        .png({ compressionLevel: 8 })
        .toFile(path.join(assetsDir, `hero-operations-${w}.png`));
    }
    console.log('✅ Hero image responsive versions created!');
  }

  // 3. Optimize aboutus image
  const aboutPath = path.join(assetsDir, 'aboutus.png');
  if (fs.existsSync(aboutPath)) {
    console.log('\n📦 Optimizing about us image (aboutus.png)...');
    const widths = [400, 800, 1200];
    for (const w of widths) {
      // AVIF
      await sharp(aboutPath)
        .resize(w)
        .avif({ quality: 80 })
        .toFile(path.join(assetsDir, `aboutus-${w}.avif`));
      
      // WebP
      await sharp(aboutPath)
        .resize(w)
        .webp({ quality: 80 })
        .toFile(path.join(assetsDir, `aboutus-${w}.webp`));

      // PNG (fallback)
      await sharp(aboutPath)
        .resize(w)
        .png({ compressionLevel: 8 })
        .toFile(path.join(assetsDir, `aboutus-${w}.png`));
    }
    console.log('✅ About us image responsive versions created!');
  }

  // 4. Optimize blog images
  // offshore-operations.jpg (7.89MB source image!)
  const largeBlogPath = path.join(blogsImagesDir, 'offshore-operations.jpg');
  if (fs.existsSync(largeBlogPath)) {
    console.log('\n📦 Optimizing offshore-operations.jpg (7.89MB)...');
    // Save as offshore-operations.webp and offshore-operations.avif with max width 1200
    await sharp(largeBlogPath)
      .resize(1200)
      .avif({ quality: 80 })
      .toFile(path.join(blogsImagesDir, 'offshore-operations.avif'));

    await sharp(largeBlogPath)
      .resize(1200)
      .webp({ quality: 80 })
      .toFile(path.join(blogsImagesDir, 'offshore-operations.webp'));
      
    const offshoreJpgBuffer = fs.readFileSync(largeBlogPath);
    await sharp(offshoreJpgBuffer)
      .resize(800)
      .jpeg({ quality: 75 })
      .toFile(largeBlogPath);

    console.log('✅ Large blog image compressed!');
  }

  // Optimize shopify-management.jpg
  const shopifyMgmtPath = path.join(blogsImagesDir, 'shopify-management.jpg');
  if (fs.existsSync(shopifyMgmtPath)) {
    console.log('\n📦 Optimizing shopify-management.jpg...');
    await sharp(shopifyMgmtPath)
      .resize(800)
      .webp({ quality: 85 })
      .toFile(path.join(blogsImagesDir, 'shopify-management.webp'));
    await sharp(shopifyMgmtPath)
      .resize(800)
      .avif({ quality: 85 })
      .toFile(path.join(blogsImagesDir, 'shopify-management.avif'));
    console.log('✅ shopify-management.jpg optimized to WebP and AVIF');
  }

  // Optimize digital-marketing-2024.png
  const dmPath = path.join(blogsImagesDir, 'digital-marketing-2024.png');
  if (fs.existsSync(dmPath)) {
    console.log('\n📦 Optimizing digital-marketing-2024.png...');
    await sharp(dmPath)
      .resize(800)
      .webp({ quality: 85 })
      .toFile(path.join(blogsImagesDir, 'digital-marketing-2024.webp'));
    await sharp(dmPath)
      .resize(800)
      .avif({ quality: 85 })
      .toFile(path.join(blogsImagesDir, 'digital-marketing-2024.avif'));
    console.log('✅ digital-marketing-2024.png optimized to WebP and AVIF');
  }

  console.log('\n🎉 Image optimization completed successfully!');
}

processImages().catch(err => {
  console.error('❌ Error during image optimization:', err);
});
