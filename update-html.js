/**
 * update-html.js
 * Batch applies performance, accessibility & SEO optimizations to all HTML files:
 * - Switches to minified CSS/JS
 * - Replaces logo <img> with <picture> tags (WebP/AVIF)
 * - Adds defer to script tags
 * - Removes unused cdnjs preconnect
 * - Updates og:image & favicon to optimized assets
 * - Updates JSON-LD logo references
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

// Files to process (relative to SRC_DIR)
const FILES = [
  'services.html',
  'contact.html',
  'blog.html',
  'ourteam.html',
];

// Root-level files
const ROOT_FILES = [
  '404.html',
];

function assetPath(file, assetName) {
  // Returns relative path to src/assets from the file's location
  return `assets/${assetName}`;
}

function applyOptimizations(content, isRoot = false) {
  const assetPrefix = isRoot ? 'src/assets' : 'assets';
  const scriptPrefix = isRoot ? '' : '../';
  const stylePrefix = isRoot ? '' : '../';

  // 1. Fix og:image to absolute URL
  content = content.replace(
    /(<meta property="og:image" content=")[^"]*(")/g,
    `$1https://whitezebraconsulting.com/src/assets/whitezebra-meta.jpg$2`
  );

  // 2. Fix twitter:image to absolute URL
  content = content.replace(
    /(<meta property="twitter:image" content=")[^"]*(")/g,
    `$1https://whitezebraconsulting.com/src/assets/whitezebra-meta.jpg$2`
  );

  // 3. Fix favicon to use PNG logo
  content = content.replace(
    /<link rel="icon"[^>]*>/g,
    `<link rel="icon" type="image/png" href="${assetPrefix}/whitezebra-logo.png">`
  );

  // 4. Switch stylesheet to minified
  content = content.replace(
    /(<link rel="stylesheet" href=")[^"]*style\.css(")/g,
    `$1${stylePrefix}style.min.css$2`
  );

  // 5. Remove cdnjs preconnect
  content = content.replace(
    /\s*<link rel="preconnect" href="https:\/\/cdnjs\.cloudflare\.com">\n?/g,
    '\n'
  );

  // 6. Replace "Preconnect and Google Analytics" comment with improved version
  content = content.replace(
    /<!-- Preconnect and Google Analytics -->/g,
    `<!-- Preconnect for critical origins -->\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
  );

  // 7. Replace nav logo <img> with <picture>
  const logoImgPattern = /(<a[^>]+class="logo"[^>]*>)\s*<img[^>]+class="logo-img"[^>]*>\s*(<span>whitezebra\.<\/span>)/gs;
  content = content.replace(logoImgPattern, (match, anchor, span) => {
    return `${anchor}\n        <picture>\n          <source type="image/avif" srcset="${assetPrefix}/whitezebra-logo.avif">\n          <source type="image/webp" srcset="${assetPrefix}/whitezebra-logo.webp">\n          <img src="${assetPrefix}/whitezebra-logo.png" alt="Whitezebra Consulting Logo" class="logo-img" width="38" height="38">\n        </picture>\n        ${span}`;
  });

  // 8. Replace footer logo <img> with <picture> (Whitezebra Consulting span)
  const footerLogoPattern = /(<a[^>]+class="logo"[^>]*>)\s*<img[^>]+class="logo-img"[^>]*>\s*(<span>Whitezebra Consulting<\/span>)/gs;
  content = content.replace(footerLogoPattern, (match, anchor, span) => {
    return `${anchor}\n          <picture>\n            <source type="image/avif" srcset="${assetPrefix}/whitezebra-logo.avif">\n            <source type="image/webp" srcset="${assetPrefix}/whitezebra-logo.webp">\n            <img src="${assetPrefix}/whitezebra-logo.png" alt="Whitezebra Consulting Logo" class="logo-img" width="38" height="38" loading="lazy">\n          </picture>\n          ${span}`;
  });

  // 9. Update JSON-LD logo references
  content = content.replace(
    /"logo":\s*"https:\/\/whitezebraconsulting\.com\/src\/assets\/whitezebra\.(jpeg|jpg)"/g,
    `"logo": "https://whitezebraconsulting.com/src/assets/whitezebra-logo.png"`
  );

  // 10. Switch script.js to script.min.js and add defer
  content = content.replace(
    /<script src="([.\/]*)script\.js"><\/script>/g,
    `<script src="${scriptPrefix}script.min.js" defer></script>`
  );

  return content;
}

// Process src/ files
FILES.forEach(file => {
  const filePath = path.join(SRC_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`  [SKIP] ${file} — not found`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  content = applyOptimizations(content, false);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  [OK]   ${file}`);
});

// Process root-level files
ROOT_FILES.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`  [SKIP] ${file} — not found`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  content = applyOptimizations(content, true);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  [OK]   ${file} (root)`);
});

console.log('\nDone! All HTML files updated.');
