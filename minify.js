const CleanCSS = require('clean-css');
const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

async function runMinification() {
  console.log('🚀 Starting minification process...\n');

  // 1. Minify CSS
  const cssPath = './style.css';
  const cssOutputPath = './style.min.css';
  if (fs.existsSync(cssPath)) {
    console.log('📦 Minifying style.css...');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    const minified = new CleanCSS({ level: 2 }).minify(cssContent);
    if (minified.errors.length > 0) {
      console.error('❌ CSS Minification Errors:', minified.errors);
    }
    if (minified.warnings.length > 0) {
      console.warn('⚠️ CSS Minification Warnings:', minified.warnings);
    }
    fs.writeFileSync(cssOutputPath, minified.styles, 'utf-8');
    console.log(`✅ CSS Minified: ${cssPath} -> ${cssOutputPath} (${cssContent.length} bytes -> ${minified.styles.length} bytes)`);
  }

  // 2. Minify core script.js
  const jsPath = './script.js';
  const jsOutputPath = './script.min.js';
  if (fs.existsSync(jsPath)) {
    console.log('\n📦 Minifying script.js...');
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    try {
      const minified = await minify(jsContent, {
        mangle: true,
        compress: true
      });
      fs.writeFileSync(jsOutputPath, minified.code, 'utf-8');
      console.log(`✅ Core JS Minified: ${jsPath} -> ${jsOutputPath} (${jsContent.length} bytes -> ${minified.code.length} bytes)`);
    } catch (err) {
      console.error('❌ JS Minification Error:', err);
    }
  }

  // 3. Minify blog-engine.js
  const enginePath = './src/js/blog-engine.js';
  const engineOutputPath = './src/js/blog-engine.min.js';
  if (fs.existsSync(enginePath)) {
    console.log('\n📦 Minifying blog-engine.js...');
    const engineContent = fs.readFileSync(enginePath, 'utf-8');
    try {
      const minified = await minify(engineContent, {
        mangle: true,
        compress: true
      });
      fs.writeFileSync(engineOutputPath, minified.code, 'utf-8');
      console.log(`✅ Blog Engine JS Minified: ${enginePath} -> ${engineOutputPath} (${engineContent.length} bytes -> ${minified.code.length} bytes)`);
    } catch (err) {
      console.error('❌ JS Minification Error:', err);
    }
  }

  console.log('\n🎉 Minification completed successfully!');
}

runMinification().catch(err => {
  console.error('❌ Error during minification:', err);
});
