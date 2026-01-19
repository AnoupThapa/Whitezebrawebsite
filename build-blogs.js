/**
 * Blog HTML Generator with 3-Column Professional Layout
 * Generates individual HTML pages with TOC, Content, and Related Posts
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BLOG_FOLDER = './src/blogs';
const OUTPUT_FOLDER = './src';
const BASE_URL = 'https://whitezebraconsulting.netlify.app';

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
    const imageUrl = post.image ? `${BASE_URL}/src/blogs_images/${post.image}` : `${BASE_URL}/src/assets/whitezebra.jpeg`;

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
            <div class="post-tags">
                <strong style="color: #64748b; font-size: 0.9rem;">Tags:</strong>
                <div>${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
            </div>
        `;
    }

    // Generate related posts
    const relatedPosts = getRelatedPosts(post, allPosts);
    let relatedPostsHTML = relatedPosts.length > 0 ? relatedPosts.map(rPost => `
        <div class="related-post">
            <a href="${rPost.slug}.html" class="related-post-title">${rPost.title}</a>
            <div class="related-post-meta">
                ${new Date(rPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${rPost.readTime}
            </div>
        </div>
    `).join('') : '<p style="color: #9ca3af; font-size: 0.9rem;">No related posts found</p>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/jpeg" href="./assets/whitezebra.jpeg">
    
    <!-- Primary Meta Tags -->
    <title>${metaTitle}</title>
    <meta name="title" content="${metaTitle}">
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
    
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../style.css">
    <style>
        body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.8;color:#333}
        .blog-post-layout{max-width:1400px;margin:100px auto 0;padding:3rem 2rem;display:grid;grid-template-columns:280px 1fr 320px;gap:3rem}
        .toc-sidebar,.related-sidebar{position:sticky;top:100px;height:fit-content}
        .toc-card,.related-card{background:#f8f9fa;border-radius:12px;padding:1.5rem;border:1px solid #e9ecef}
       .related-card{background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.05)}
        .toc-card h3,.related-card h3{font-size:1rem;font-weight:700;color:#1a365d;margin-bottom:1rem;text-transform:uppercase;letter-spacing:0.5px}
        .toc-list{list-style:none;padding:0;margin:0}
        .toc-list li{margin-bottom:0.75rem}
        .toc-list a{color:#64748b;text-decoration:none;font-size:0.9rem;transition:all 0.2s;display:block;padding:0.25rem 0}
        .toc-list a:hover{color:#2d6bc9;font-weight:600;padding-left:0.5rem}
        .post-title{font-size:2.5rem;color:#1a365d;margin-bottom:1rem;line-height:1.2}
        .post-meta{display:flex;gap:1.5rem;margin-bottom:1rem;flex-wrap:wrap}
        .post-meta-item{display:flex;align-items:center;gap:0.5rem;color:#64748b;font-size:0.9rem}
        .post-meta-item i{color:#2d6bc9}
        .post-excerpt{font-size:1.2rem;color:#555;font-style:italic;border-left:4px solid #38b2ac;padding-left:1.5rem;margin:2rem 0}
        .post-image{width:100%;height:auto;border-radius:12px;margin:2rem 0;box-shadow:0 10px 40px rgba(0,0,0,0.1)}
        .post-content h2{font-size:1.8rem;color:#1a365d;margin:2.5rem 0 1rem;scroll-margin-top:100px}
        .post-content p{margin-bottom:1.5rem;font-size:1.05rem;color:#374151}
        .post-tags{margin-top:3rem;padding-top:2rem;border-top:1px solid #e5e7eb}
        .tag{display:inline-block;padding:0.4rem 1rem;background:#e0f2fe;color:#1a56db;border-radius:50px;font-size:0.85rem;margin:0.25rem}
        .related-post{margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid #f3f4f6}
        .related-post:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
        .related-post-title{font-size:0.95rem;font-weight:600;color:#1a365d;text-decoration:none;display:block;margin-bottom:0.5rem;line-height:1.4;transition:color 0.2s}
        .related-post-title:hover{color:#2d6bc9}
        .related-post-meta{font-size:0.8rem;color:#9ca3af}
        .back-to-blog{display:inline-flex;align-items:center;gap:0.5rem;color:#2d6bc9;text-decoration:none;font-weight:600;margin-bottom:2rem;transition:gap 0.3s}
        .back-to-blog:hover{gap:1rem}
        @media (max-width:1200px){.blog-post-layout{grid-template-columns:240px 1fr 280px;gap:2rem}}
        @media (max-width:992px){.blog-post-layout{grid-template-columns:1fr;gap:2rem}.toc-sidebar,.related-sidebar{position:static}.toc-card,.related-card{margin-bottom:2rem}}
        @media (max-width:768px){.post-title{font-size:2rem}.blog-post-layout{padding:2rem 1rem;margin-top:80px}}
    </style>
</head>
<body>
    <nav id="mainNav">
        <div class="nav-container">
            <div class="logo">
                <img src="./assets/whitezebra.jpeg" alt="Whitezebra Consulting" class="logo-img">
                <a href="../index.html" class="logo-text">Whitezebra Consulting</a>
            </div>
            <ul class="nav-links" id="navLinks">
                <li><a href="../index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="services.html">Services</a></li>
                <li><a href="blog.html" class="active">Blog</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
            <div class="mobile-menu" id="mobileMenu" onclick="toggleMenu()">
                <span class="bar bar1"></span>
                <span class="bar bar2"></span>
                <span class="bar bar3"></span>
            </div>
        </div>
    </nav>

    <div class="blog-post-layout">
        <aside class="toc-sidebar">
            <div class="toc-card">
                <h3><i class="fas fa-list"></i> Table of Contents</h3>
                <ul class="toc-list">${tocHTML}</ul>
            </div>
        </aside>

        <article class="main-content">
            <a href="blog.html" class="back-to-blog">
                <i class="fas fa-arrow-left"></i> Back to Blog
            </a>

            <div class="post-meta">
                <div class="post-meta-item">
                    <i class="far fa-calendar"></i>
                    <span>${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="post-meta-item">
                    <i class="far fa-clock"></i>
                    <span>${post.readTime}</span>
                </div>
                <div class="post-meta-item">
                    <i class="far fa-user"></i>
                    <span>${post.author}</span>
                </div>
            </div>

            <h1 class="post-title">${post.title}</h1>

            ${post.image ? `<img src="./blogs_images/${post.image}" alt="${post.title}" class="post-image">` : ''}

            <p class="post-excerpt">${post.content?.introduction || post.excerpt || ''}</p>

            <div class="post-content">${contentHTML}</div>

            ${tagsHTML}
        </article>

        <aside class="related-sidebar">
            <div class="related-card">
                <h3><i class="fas fa-newspaper"></i> Related Posts</h3>
                <div>${relatedPostsHTML}</div>
            </div>
        </aside>
    </div>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-column footer-logo">
                    <div class="logo" style="color:white;margin-bottom:1.5rem">
                        <img src="./assets/whitezebra.jpeg" alt="Whitezebra Consulting" class="logo-img" style="height:50px">
                        <span>Whitezebra Consulting</span>
                    </div>
                    <p>Your trusted offshore operations partner delivering premium backend support services for digital businesses worldwide.</p>
                    <div class="social-links">
                        <a href="https://www.linkedin.com/company/whitezebraconsulting/" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                <div class="footer-column footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="services.html">Services</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-column footer-contact">
                    <h3>Contact Us</h3>
                    <p><i class="fas fa-map-marker-alt"></i> Phulbari Nagar Marg, Kathmandu 44600, Nepal</p>
                    <p><i class="fas fa-phone"></i> +977-9851324698</p>
                    <p><i class="fas fa-envelope"></i> info.whitezebraconsulting@gmail.com</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Whitezebra Consulting Pvt. Ltd. All rights reserved.</p>
            </div>
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

console.log(`\\n✨ Successfully generated ${generatedCount} blog HTML files with 3-column layout!`);
console.log('📍 Files saved to: ./src/\\n');
