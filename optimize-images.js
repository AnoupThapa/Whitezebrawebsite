/**
 * Image Optimization Script
 * Compresses images and generates WebP versions
 * 
 * Note: This script requires 'sharp' package
 * Install with: npm install sharp --save-dev
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Error: sharp package not found!');
  console.log('\nTo use this script, install sharp:');
  console.log('npm install sharp --save-dev\n');
  console.log('Alternatively, use online tools like:');
  console.log('- https://squoosh.app/');
  console.log('- https://tinypng.com/');
  console.log('- https://imagecompressor.com/\n');
  process.exit(1);
}

const assetsDir = path.join(__dirname, 'src', 'assets');
const blogsImagesDir = path.join(__dirname, 'src', 'blogs_images');

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const { quality = 80, width, height } = options;
    
    let pipeline = sharp(inputPath);
    
    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Determine format and optimize
    const ext = path.extname(inputPath).toLowerCase();
    
    if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline
        .jpeg({ quality, progressive: true, mozjpeg: true })
        .toFile(outputPath);
    } else if (ext === '.png') {
      await pipeline
        .png({ quality, compressionLevel: 9, palette: true })
        .toFile(outputPath);
    }
    
    // Generate WebP version
    const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await sharp(inputPath)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: quality - 5 })
      .toFile(webpPath);
    
    return true;
  } catch (error) {
    console.error(`Error optimizing ${path.basename(inputPath)}:`, error.message);
    return false;
  }
}

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }
  
  const files = fs.readdirSync(dir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );
  
  console.log(`\nProcessing ${imageFiles.length} images in ${path.basename(dir)}/...`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(dir, file);
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024).toFixed(2);
    
    // Create backup
    const backupDir = path.join(dir, 'originals');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupPath = path.join(backupDir, file);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
    }
    
    // Optimize based on file name/purpose
    let options = { quality: 85 };
    
    if (file.includes('logo') || file.includes('whitezebra')) {
      // Logo images - smaller size, higher quality
      options = { quality: 90, width: 200 };
    }
    
    const outputPath = inputPath + '.tmp';
    const success = await optimizeImage(inputPath, outputPath, options);
    
    if (success) {
      const newStats = fs.statSync(outputPath);
      const newSize = (newStats.size / 1024).toFixed(2);
      const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
      
      // Replace original with optimized version
      fs.renameSync(outputPath, inputPath);
      
      console.log(`✓ ${file}: ${originalSize}KB → ${newSize}KB (saved ${savings}%)`);
    }
  }
}

async function main() {
  console.log('=".='.repeat(25));
  console.log('  Image Optimization Tool');
  console.log('='.repeat(50));
  
  // Process assets directory
  await processDirectory(assetsDir);
  
  // Process blog images directory
  if (fs.existsSync(blogsImagesDir)) {
    await processDirectory(blogsImagesDir);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✓ Optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Check your images look correct');
  console.log('2. Original images saved in "originals/" folders');
  console.log('3. WebP versions created alongside originals');
  console.log('4. Update HTML to use <picture> elements (optional)');
  console.log('5. Test website and run PageSpeed Insights\n');
}

main().catch(console.error);
