/**
 * Blog HTML Generator
 * Generates individual HTML pages for each blog post with proper SEO meta tags
 * Works for both GitHub Pages and Netlify deployments
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BLOG_FOLDER = './src/blogs';
const OUTPUT_FOLDER = './src';
const BASE_URL = 'https://pujanjoci.github.io/WhiteZebraConsulting';

// Read all blog JSON files
function getBlogPosts() {
    const files = fs.readdirSync(BLOG_FOLDER);
    const blogPosts = [];

    files.forEach(file => {
        if (file.endsWith('.json') && file !== 'template.json') {
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

// Generate HTML for a blog post
function generateBlogHTML(post) {
    // Validate required fields
    if (!post.slug || !post.title) {
        console.warn(`Skipping invalid post: missing slug or title`);
        return null;
    }

    // Auto-generate SEO fields if missing
    const seo = post.seo || {};
    const metaTitle = seo.metaTitle || `${post.title} | Whitezebra Consulting`;
    
    // Safely get meta description with fallbacks
    let metaDescription = seo.metaDescription || post.excerpt || '';
    if (!metaDescription && post.content && post.content.introduction) {
        metaDescription = post.content.introduction.substring(0, 155);
    }
    if (!metaDescription) {
        metaDescription = post.title; // Ultimate fallback
    }
    
    const keywords = seo.keywords || post.tags || [];
    
    const pageUrl = `${BASE_URL}/src/${post.slug}.html`;
    const imageUrl = post.image ? `${BASE_URL}/src/blogs_images/${post.image}` : `${BASE_URL}/src/assets/whitezebra.jpeg`;

    // Generate content sections
    let contentSections = '';
    if (post.content && post.content.sections && Array.isArray(post.content.sections)) {
        post.content.sections.forEach(section => {
            contentSections += `
                <h2>${section.heading}</h2>
                <p>${section.content}</p>
            `;
        });
    }

    // Generate tags
    let tagsHTML = '';
    if (post.tags && post.tags.length > 0) {
        tagsHTML = `
            <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
                <h3 style="font-size: 1rem; color: #6b7280; margin-bottom: 1rem;">Tags:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${post.tags.map(tag => `<span style="padding: 0.4rem 1rem; background: #f3f4f6; color: #1a56db; border-radius: 50px; font-size: 0.9rem;">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Generate featured image
    let featuredImage = '';
    if (post.image) {
        featuredImage = `
            <div style="margin: 2rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                <img src="./blogs_images/${post.image}" 
                     alt="${post.title}" 
                     style="width: 100%; height: auto; display: block;">
            </div>
        `;
    }

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
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="./css/footer.css">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.8;
            color: #333;
        }

        .post-header {
            background: linear-gradient(135deg, #1a2a4a 0%, #2d4379 100%);
            padding: 140px 0 60px;
            color: white;
        }

        .post-header-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .post-category {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 1rem;
            text-transform: uppercase;
        }

        .post-header h1 {
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 3rem;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }

        .post-meta {
            display: flex;
            gap: 2rem;
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.95rem;
        }

        .post-meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .post-content {
            max-width: 800px;
            margin: 4rem auto;
            padding: 0 2rem;
        }

        .post-content h2 {
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 2rem;
            margin: 2.5rem 0 1rem;
            color: #1a2a4a;
        }

        .post-content p {
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }

        .post-introduction {
            font-size: 1.2rem;
            color: #555;
            font-style: italic;
            border-left: 4px solid #3498db;
            padding-left: 1.5rem;
            margin: 2rem 0;
        }

        .post-conclusion {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 12px;
            margin: 3rem 0;
        }

        .back-to-blog {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #3498db;
            text-decoration: none;
            font-weight: 600;
            margin-bottom: 2rem;
            transition: all 0.3s ease;
        }

        .back-to-blog:hover {
            gap: 1rem;
        }

        @media (max-width: 768px) {
            .post-header h1 {
                font-size: 2rem;
            }

            .post-meta {
                flex-direction: column;
                gap: 0.5rem;
            }

            .post-content h2 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
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
                <li><a href="ourteam.html">Our Team</a></li>
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

    <!-- Post Header -->
    <header class="post-header">
        <div class="post-header-content">
            <span class="post-category">${post.category}</span>
            <h1>${post.title}</h1>
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
        </div>
    </header>

    <!-- Post Content -->
    <main>
        <article class="post-content">
            <a href="blog.html" class="back-to-blog">
                <i class="fas fa-arrow-left"></i> Back to Blog
            </a>

            ${featuredImage}

            <p class="post-introduction">${post.content && post.content.introduction ? post.content.introduction : post.excerpt || ''}</p>

            ${contentSections}

            <div class="post-conclusion">
                <h2>Conclusion</h2>
                <p>${post.content && post.content.conclusion ? post.content.conclusion : 'Thank you for reading.'}</p>
            </div>

            ${tagsHTML}
        </article>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-column footer-logo">
                    <div class="logo" style="color: white; margin-bottom: 1.5rem;">
                        <img src="./assets/whitezebra.jpeg" alt="Whitezebra Consulting" class="logo-img" style="height: 50px;">
                        <span>Whitezebra Consulting</span>
                    </div>
                    <p>Your trusted offshore operations partner delivering premium backend support services for digital businesses worldwide.</p>
                    <div class="social-links">
                        <a href="https://www.linkedin.com/company/whitezebraconsulting/"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                
                <div class="footer-column footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="services.html">Services</a></li>
                        <li><a href="ourteam.html">Our Team</a></li>
                        <li><a href="blog.html" class="active">Blog</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-column footer-links">
                    <h3>Services</h3>
                    <ul>
                        <li><a href="services.html#digital-marketing">Digital Marketing</a></li>
                        <li><a href="services.html#ecommerce">E-Commerce Management</a></li>
                        <li><a href="services.html#graphic-design">Graphic Design</a></li>
                        <li><a href="services.html#admin">Admin Support</a></li>
                    </ul>
                </div>
                
                <div class="footer-column contact-info">
                    <h3>Contact Us</h3>
                    <p><i class="fas fa-map-marker-alt"></i> Phulbari Nagar Marg, Kathmandu 44600, Nepal</p>
                    <p><i class="fas fa-phone"></i> +977-9851324698</p>
                    <p><i class="fas fa-envelope"></i> info.whitezebraconsulting@gmail.com</p>
                    <p><i class="fas fa-clock"></i> Mon-Fri: 5:30 AM - 2:00 PM (NST)</p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 Whitezebra Consulting Pvt. Ltd. All rights reserved.</p>
                <p style="margin-top: 0.5rem; font-size: 0.8rem;">Designed with excellence for business growth</p>
            </div>
        </div>
    </footer>

    <script src="../script.js"></script>
</body>
</html>`;
}

// Main execution
console.log('🚀 Starting blog HTML generation...\n');

const posts = getBlogPosts();
console.log(`📝 Found ${posts.length} blog posts\n`);

let generatedCount = 0;
const blogFileNames = [];

posts.forEach(post => {
    const html = generateBlogHTML(post);
    
    // Skip if HTML generation failed
    if (!html) {
        console.warn(`⚠️  Skipped: ${post.slug || 'unknown'} (invalid or incomplete)`);
        return;
    }
    
    const outputPath = path.join(OUTPUT_FOLDER, `${post.slug}.html`);
    
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`✅ Generated: ${post.slug}.html`);
    generatedCount++;
    
    // Track JSON filenames for index
    blogFileNames.push(`${post.slug}.json`);
});

// Generate blog index file for dynamic loading
const blogIndex = {
    posts: blogFileNames,
    generated: new Date().toISOString(),
    count: blogFileNames.length
};

const indexPath = path.join(BLOG_FOLDER, 'blog-index.json');
fs.writeFileSync(indexPath, JSON.stringify(blogIndex, null, 2), 'utf-8');
console.log(`\n📑 Generated: blog-index.json with ${blogFileNames.length} posts`);

console.log(`\n✨ Successfully generated ${generatedCount} blog post HTML files!`);
console.log('📍 Files saved to: ./src/\n');
