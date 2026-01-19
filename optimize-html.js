/**
 * Performance Optimization Script
 * Applies resource loading optimizations to HTML files
 */

const fs = require('fs');
const path = require('path');

// Files to process
const srcDir = path.join(__dirname, 'src');
const htmlFiles = [
  'about.html',
  'services.html',
  'blog.html',
  'contact.html',
  'ourteam.html',
  'blog-post.html',
  'digital-marketing-trends-2024.html',
  'digital-marketing-upcoming-trends.html',
  'offshore-backend-operations.html',
  'shopify-best-practice.html',
  'shopify-store-management.html'
];

function optimizeHTML(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Add preconnect hints if not present
  if (!html.includes('rel="preconnect"')) {
    const preconnectHints = `    <!-- Performance Optimizations -->
    <link rel="preconnect" href="https://www.googletagmanager.com">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="https://www.google-analytics.com">
    `;
    
    html = html.replace('<head>', '<head>\n' + preconnectHints);
    modified = true;
  }

  // 2. Optimize Font Awesome loading
  const fontAwesomeRegex = /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">/g;
  if (fontAwesomeRegex.test(html)) {
    html = html.replace(
      fontAwesomeRegex,
      `<!-- Optimize Font Awesome loading -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>`
    );
    modified = true;
  }

  // 3. Add defer to script tags (except inline scripts)
  const scriptRegex = /<script src="([^"]+)"(?!.*defer)>/g;
  if (scriptRegex.test(html)) {
    html = html.replace(scriptRegex, '<script src="$1" defer>');
    modified = true;
  }

  // 4. Add width/height to logo images
  const logoRegex = /<img src="(\.\.\/)?\.?\/src\/assets\/whitezebra\.jpeg" alt="Whitezebra Consulting" class="logo-img"(?![^>]*width)>/g;
  if (logoRegex.test(html)) {
    html = html.replace(
      logoRegex,
      '<img src="$1./src/assets/whitezebra.jpeg" alt="Whitezebra Consulting" class="logo-img" width="45" height="45" loading="eager">'
    );
    modified = true;
  }

  // 5. Add aria-label to LinkedIn links
  const linkedinRegex = /<a href="https:\/\/www\.linkedin\.com\/company\/whitezebraconsulting\/"(?![^>]*aria-label)><i class="fab fa-linkedin-in"><\/i><\/a>/g;
  if (linkedinRegex.test(html)) {
    html = html.replace(
      linkedinRegex,
      '<a href="https://www.linkedin.com/company/whitezebraconsulting/" aria-label="Visit our LinkedIn page"><i class="fab fa-linkedin-in"></i></a>'
    );
    modified = true;
  }

  // 6. Change Google Analytics from async to defer
  const gtagAsyncRegex = /<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-YHBBRVH6XS"><\/script>/g;
  if (gtagAsyncRegex.test(html)) {
    html = html.replace(
      gtagAsyncRegex,
      '<script defer src="https://www.googletagmanager.com/gtag/js?id=G-YHBBRVH6XS"></script>'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ Optimized: ${path.basename(filePath)}`);
    return true;
  }
  
  console.log(`⊘ No changes: ${path.basename(filePath)}`);
  return false;
}

// Process all files
console.log('Starting HTML optimization...\n');
let optimizedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    if (optimizeHTML(filePath)) {
      optimizedCount++;
    }
  } else {
    console.log(`⚠ File not found: ${file}`);
  }
});

console.log(`\n✓ Optimization complete! ${optimizedCount} files modified.`);
