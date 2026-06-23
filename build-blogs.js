/**
 * Blog HTML Generator with 3-Column Professional Layout
 * Generates individual HTML pages with TOC, Content, and Related Posts
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BLOG_FOLDER = './src/blogs';
const OUTPUT_FOLDER = './src';
const BASE_URL = 'https://whitezebraconsulting.com';

// Read all blog JSON files
function getBlogPosts() {
    const files = fs.readdirSync(BLOG_FOLDER);
    const blogPosts = [];

    files.forEach(file => {
        if (file.endsWith('.json') && file !== 'template.json' && file !== 'blog-index.json') {
            const filePath = path.join(BLOG_FOLDER, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            try {
                const post = JSON.parse(content);
                blogPosts.push(post);
            } catch (error) {
                console.error(`Error parsing ${file}:`, error.message);
            }
        }
    });

    return blogPosts;
}

// Generate slug from heading for TOC
function slugify(text) {
    return text.toLowerCase().replace(/[^\w]+/g, '-');
}

// Get related posts by tags
function getRelatedPosts(currentPost, allPosts, limit = 3) {
    return allPosts
        .filter(post => post.slug !== currentPost.slug)
        .map(post => {
            const hasCommonTag = post.tags?.some(tag => currentPost.tags?.includes(tag));
            return { ...post, isRelated: hasCommonTag };
        })
        .sort((a, b) => {
            if (a.isRelated && !b.isRelated) return -1;
            if (!a.isRelated && b.isRelated) return 1;
            return new Date(b.date) - new Date(a.date);
        })
        .slice(0, limit);
}

// Generate HTML for a blog post with 3-column layout
function generateBlogHTML(post, allPosts) {
    if (!post.slug || !post.title) {
        console.warn(`Skipping invalid post: missing slug or title`);
        return null;
    }

    const seo = post.seo || {};
    const metaTitle = seo.metaTitle || `${post.title} | Whitezebra Consulting`;
    let metaDescription = seo.metaDescription || post.excerpt || '';
    if (!metaDescription && post.content?.introduction) {
        metaDescription = post.content.introduction.substring(0, 155);
    }
    if (!metaDescription) metaDescription = post.title;
    
    const keywords = seo.keywords || post.tags || [];
    const pageUrl = `${BASE_URL}/src/${post.slug}.html`;
    const imageUrl = post.image ? `${BASE_URL}/blogs_images/${post.image}` : `${BASE_URL}/src/assets/whitezebra.jpeg`;

    // Generate TOC
    let tocHTML = '';
    if (post.content?.sections && post.content.sections.length > 0) {
        tocHTML = post.content.sections.map(section => `
            <li><a href="#${slugify(section.heading)}">${section.heading}</a></li>
        `).join('');
    } else {
        tocHTML = '<li style="color: #9ca3af; font-size: 0.85rem;">No sections found</li>';
    }

    // Generate content sections
    let contentHTML = '';
    if (post.content?.sections) {
        contentHTML = post.content.sections.map(section => `
            <h2 id="${slugify(section.heading)}">${section.heading}</h2>
            <p>${section.content}</p>
        `).join('');
    }

    // Generate tags
    let tagsHTML = '';
    if (post.tags && post.tags.length > 0) {
        tagsHTML = `
            <div class="post-tags" style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
                <strong style="color: var(--color-accent-tan); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.75rem;">Tags</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">${post.tags.map(tag => `<span class="tag" style="display: inline-block; padding: 0.35rem 0.85rem; background-color: rgba(194,169,136,0.15); color: var(--color-text-dark); font-size: 0.8rem; font-weight: 500;">${tag}</span>`).join('')}</div>
            </div>
        `;
    }

    // Generate related posts
    const relatedPosts = getRelatedPosts(post, allPosts);
    let relatedPostsHTML = relatedPosts.length > 0 ? relatedPosts.map(rPost => `
        <div class="related-post" style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-border);">
            <a href="${rPost.slug}.html" class="related-post-title" style="font-family: var(--font-sans); font-size: 0.95rem; font-weight: 600; line-height: 1.4; color: var(--color-text-dark); transition: var(--transition-fast);">${rPost.title}</a>
            <div class="related-post-meta" style="font-size: 0.8rem; color: #777777; margin-top: 0.5rem;">
                ${new Date(rPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${rPost.readTime}
            </div>
        </div>
    `).join('') : '<p style="color: #9ca3af; font-size: 0.9rem;">No related posts found</p>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${keywords.join(', ')}">
  <meta name="author" content="${post.author}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${metaTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:image" content="${imageUrl}">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${pageUrl}">
  <meta property="twitter:title" content="${metaTitle}">
  <meta property="twitter:description" content="${metaDescription}">
  <meta property="twitter:image" content="${imageUrl}">

  <!-- Favicon -->
  <link rel="icon" type="image/jpeg" href="./assets/whitezebra.jpeg">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="../style.css">
  
  <style>
    body {
      background-color: var(--color-bg-cream);
      color: var(--color-text-dark);
      line-height: 1.8;
    }
    .blog-post-layout {
      max-width: 1200px;
      margin: 120px auto 0;
      padding: 3rem 1.5rem;
      display: grid;
      grid-template-columns: 240px 1fr 280px;
      gap: 3.5rem;
    }
    .toc-sidebar, .related-sidebar {
      position: sticky;
      top: 120px;
      height: fit-content;
    }
    .toc-card, .related-card {
      border: 1px solid var(--color-border);
      padding: 1.5rem;
      background: transparent;
    }
    .toc-card h3, .related-card h3 {
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-accent-tan);
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .toc-list a {
      color: #555555;
      text-decoration: none;
      font-size: 0.9rem;
      transition: var(--transition-fast);
      display: block;
      line-height: 1.4;
    }
    .toc-list a:hover {
      color: var(--color-text-dark);
      padding-left: 0.25rem;
    }
    .post-title {
      font-size: clamp(2rem, 4vw, 3rem);
      color: var(--color-text-dark);
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }
    .post-meta-items {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-accent-tan);
      font-weight: 600;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 1.5rem;
    }
    .post-meta-items span {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .post-excerpt {
      font-size: 1.15rem;
      color: #333333;
      font-style: italic;
      line-height: 1.7;
      margin-bottom: 2.5rem;
      border-left: 2px solid var(--color-accent-tan);
      padding-left: 1.5rem;
    }
    .post-image {
      width: 100%;
      height: auto;
      margin-bottom: 2.5rem;
      border: 1px solid var(--color-border);
    }
    .post-content h2 {
      font-size: 1.6rem;
      color: var(--color-text-dark);
      margin: 3.5rem 0 1.25rem;
      scroll-margin-top: 120px;
    }
    .post-content p {
      margin-bottom: 1.5rem;
      font-size: 1.05rem;
      color: #222222;
    }
    .back-to-blog {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-text-dark);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2rem;
      transition: var(--transition-fast);
    }
    .back-to-blog:hover {
      gap: 0.75rem;
      color: var(--color-accent-tan);
    }
    .related-post:last-child {
      border-bottom: none !important;
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
    }
    @media (max-width: 992px) {
      .blog-post-layout {
        grid-template-columns: 1fr;
        gap: 2.5rem;
        margin-top: 100px;
      }
      .toc-sidebar, .related-sidebar {
        position: static;
      }
    }
  </style>

  <!-- Preconnect and Google Analytics -->
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com">
  <script>
    function loadGA() {
      if (window.gaLoaded) return;
      window.gaLoaded = true;
      var script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YHBBRVH6XS';
      script.defer = true;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YHBBRVH6XS');
    }
    ['mousemove','scroll','keydown','click','touchstart'].forEach(e => 
      window.addEventListener(e, loadGA, {once:true, passive:true})
    );
    setTimeout(loadGA, 3000);
  </script>
</head>
<body>

  <!-- Header -->
  <header id="mainHeader">
    <div class="container nav-container">
      <a href="../index.html" class="logo" aria-label="Whitezebra Consulting Home">
        <svg class="logo-mark" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="2" y="2" width="4" height="20" fill="currentColor"/>
          <rect x="10" y="2" width="4" height="20" fill="currentColor"/>
          <rect x="18" y="2" width="4" height="20" fill="currentColor"/>
        </svg>
        <span>whitezebra.</span>
      </a>

      <button class="menu-toggle" id="menuToggle" aria-label="Toggle Menu" aria-expanded="false" aria-controls="navLinks">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" class="hamburger-line-1"></line>
          <line x1="3" y1="6" x2="21" y2="6" class="hamburger-line-2"></line>
          <line x1="3" y1="18" x2="21" y2="18" class="hamburger-line-3"></line>
        </svg>
      </button>

      <ul class="nav-links" id="navLinks">
        <li><a href="../index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="blog.html" class="active">Journal</a></li>
        <li><a href="contact.html" class="nav-cta">Start a project</a></li>
      </ul>
    </div>
  </header>

  <div class="blog-post-layout">
    <!-- TOC -->
    <aside class="toc-sidebar">
      <div class="toc-card">
        <h3>Contents</h3>
        <ul class="toc-list">${tocHTML}</ul>
      </div>
    </aside>

    <!-- Main Post Content -->
    <article class="main-content" style="overflow: hidden;">
      <a href="blog.html" class="back-to-blog">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-top:-2px;" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Journal
      </a>

      <h1 class="post-title">${post.title}</h1>

      <div class="post-meta-items">
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          ${post.readTime}
        </span>
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          ${post.author}
        </span>
      </div>

      ${post.image ? `<img src="./blogs_images/${post.image}" alt="${post.title}" class="post-image">` : ''}

      <div class="post-excerpt">${post.content?.introduction || post.excerpt || ''}</div>

      <div class="post-content">${contentHTML}</div>

      ${tagsHTML}
    </article>

    <!-- Related -->
    <aside class="related-sidebar">
      <div class="related-card">
        <h3>Related Guides</h3>
        <div>${relatedPostsHTML}</div>
      </div>
    </aside>
  </div>

  <!-- Footer -->
  <footer>
    <div class="container footer-grid">
      <div class="footer-column footer-brand">
        <a href="../index.html" class="logo" aria-label="Whitezebra Consulting Home">
          <svg class="logo-mark" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="2" y="2" width="4" height="20" fill="currentColor"/>
            <rect x="10" y="2" width="4" height="20" fill="currentColor"/>
            <rect x="18" y="2" width="4" height="20" fill="currentColor"/>
          </svg>
          <span>whitezebra.</span>
        </a>
        <p>Premium offshore operations partner delivering backend support, web management, and digital marketing support for global businesses.</p>
        <div class="footer-socials">
          <a href="https://www.linkedin.com/company/whitezebrating/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </div>
      </div>

      <div class="footer-column">
        <h3>Company</h3>
        <ul class="footer-links">
          <li><a href="../index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="blog.html">Journal</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h3>Services</h3>
        <ul class="footer-links">
          <li><a href="services.html#digital-marketing">Digital Marketing</a></li>
          <li><a href="services.html#ecommerce">E-Commerce</a></li>
          <li><a href="services.html#graphic-design">Graphic Design</a></li>
          <li><a href="services.html#web-management">Web Management</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h3>Contact</h3>
        <div class="footer-contact-details">
          <div class="footer-contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>Phulbari Nagar Marg, Kathmandu 44600, Nepal</span>
          </div>
          <div class="footer-contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>+977-9851324698</span>
          </div>
          <div class="footer-contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>info.whitezebraconsulting@gmail.com</span>
          </div>
          <div class="footer-contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Mon–Fri 5:30 AM–2:00 PM NST</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>&copy; 2026 Whitezebra Consulting Pvt. Ltd. All rights reserved.</p>
      <p>Nepal Offshore Operations Layer</p>
    </div>
  </footer>

  <script src="../script.js"></script>
  <script>
    // Smooth scroll for TOC
    document.querySelectorAll('.toc-list a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      });
    });
  </script>
</body>
</html>`;
}

// Generate Sitemap
function generateSitemap(allPosts) {
    console.log('🗺️  Generating sitemap.xml...');
    
    const today = new Date().toISOString().split('T')[0];
    
    let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- Home Page -->
    <url>
        <loc>${BASE_URL}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>

    <!-- About Page -->
    <url>
        <loc>${BASE_URL}/src/about.html</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Services Page -->
    <url>
        <loc>${BASE_URL}/src/services.html</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>

    <!-- Blog Page -->
    <url>
        <loc>${BASE_URL}/src/blog.html</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Contact Page -->
    <url>
        <loc>${BASE_URL}/src/contact.html</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>

    <!-- Blog Posts -->`;

    allPosts.forEach(post => {
        if (post.slug) {
            sitemapXML += `
    <url>
        <loc>${BASE_URL}/src/${post.slug}.html</loc>
        <lastmod>${post.date || today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
        }
    });

    sitemapXML += `
</urlset>`;

    fs.writeFileSync('./sitemap.xml', sitemapXML, 'utf-8');
    console.log('✅ Generated: sitemap.xml');
}

// Main execution
console.log('🚀 Generating blog HTML files with 3-column layout...\\n');

const allPosts = getBlogPosts();
console.log(`📝 Found ${allPosts.length} blog posts\\n`);

let generatedCount = 0;
const blogFileNames = [];

allPosts.forEach(post => {
    const html = generateBlogHTML(post, allPosts);
    
    if (!html) {
        console.warn(`⚠️  Skipped: ${post.slug || 'unknown'} (invalid or incomplete)`);
        return;
    }
    
    const outputPath = path.join(OUTPUT_FOLDER, `${post.slug}.html`);
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`✅ Generated: ${post.slug}.html`);
    generatedCount++;
    blogFileNames.push(`${post.slug}.json`);
});

// Generate blog index
const blogIndex = {
    posts: blogFileNames,
    generated: new Date().toISOString(),
    count: blogFileNames.length
};

const indexPath = path.join(BLOG_FOLDER, 'blog-index.json');
fs.writeFileSync(indexPath, JSON.stringify(blogIndex, null, 2), 'utf-8');
console.log(`\\n📑 Generated: blog-index.json with ${blogFileNames.length} posts`);

// Generate Sitemap
generateSitemap(allPosts);

console.log(`\\n✨ Successfully generated ${generatedCount} blog HTML files and updated sitemap!`);
console.log('📍 Files saved to: ./src/\\n');
