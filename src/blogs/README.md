# Dynamic Blog System Documentation

## Overview

The Whitezebra Consulting website now features a dynamic blog system that loads posts from JSON files, making it easy to add and manage blog content without modifying HTML code.

## Directory Structure

```
src/
├── blogs/                          # Blog post JSON files
│   ├── template.json               # Template for creating new posts
│   ├── offshore-backend-operations.json
│   ├── shopify-store-management.json
│   └── digital-marketing-trends-2024.json
├── blogs_images/                   # Blog post images
│   └── (add your images here)
├── js/
│   └── blog-engine.js              # Dynamic rendering engine
├── blog.html                       # Blog listing page
└── blog-post.html                  # Individual post template
```

## How to Add a New Blog Post

### Step 1: Create the JSON File

1. Copy `src/blogs/template.json`
2. Rename it to match your post slug (e.g., `my-new-post.json`)
3. Fill in all the fields:

```json
{
  "id": "unique-post-id",
  "title": "Your Post Title",
  "slug": "your-post-slug",
  "category": "Operations|E-commerce|Marketing|Strategy|Case Study",
  "excerpt": "Brief summary (150-200 characters)",
  "author": "Author Name",
  "date": "2024-01-15",
  "readTime": "5 min read",
  "image": "image-filename.jpg",
  "featured": false,
  "tags": ["tag1", "tag2"],
  "content": {
    "introduction": "Opening paragraph",
    "sections": [
      {
        "heading": "Section Title",
        "content": "Section content"
      }
    ],
    "conclusion": "Closing paragraph"
  },
  "seo": {
    "metaTitle": "SEO title",
    "metaDescription": "SEO description",
    "keywords": ["keyword1", "keyword2"]
  }
}
```

### Step 2: Add Images (Optional)

1. Place your blog post images in `src/blogs_images/`
2. Reference the image filename in the JSON file's `image` field
3. Images will be displayed with gradient overlays on the blog listing page

### Step 3: Register the Post

Open `src/js/blog-engine.js` and add your new JSON file to the `postFiles` array:

```javascript
const postFiles = [
  "offshore-backend-operations.json",
  "shopify-store-management.json",
  "digital-marketing-trends-2024.json",
  "your-new-post.json", // Add your new post here
];
```

### Step 4: Test

1. Open `blog.html` in your browser
2. Your new post should appear in the blog grid
3. Click on it to view the full post on `blog-post.html`

## Features

### Dynamic Rendering

- Posts are loaded from JSON files using JavaScript
- No need to edit HTML for new posts
- Automatic sorting by date (newest first)

### Category Filtering

- Filter posts by category: All, Operations, E-commerce, Marketing, Strategy, Case Studies
- Filters update the display in real-time

### Pagination

- Displays 6 posts per page
- Automatic pagination controls
- Smooth scrolling to top when changing pages

### SEO Friendly

- Each post has customizable meta title and description
- Proper heading structure
- Semantic HTML

### Responsive Design

- Mobile-friendly layout
- Adaptive grid system
- Touch-friendly navigation

## Categories

Available categories:

- **Operations** - Offshore operations, business processes
- **E-commerce** - Online store management, Shopify
- **Marketing** - Digital marketing, strategies
- **Strategy** - Business growth, scaling
- **Case Study** - Client success stories

## Best Practices

1. **Consistent Naming**: Use kebab-case for slugs (e.g., `my-blog-post`)
2. **Image Optimization**: Compress images before uploading
3. **SEO**: Write unique meta descriptions for each post
4. **Content Length**: Aim for 800-1500 words for optimal engagement
5. **Categories**: Use existing categories for better filtering
6. **Dates**: Use YYYY-MM-DD format for dates
7. **Featured Posts**: Mark important posts as featured

## Troubleshooting

### Post Not Appearing

- Check that the JSON file is in `src/blogs/`
- Verify the filename is added to `blog-engine.js`
- Check browser console for errors
- Ensure JSON is valid (use a JSON validator)

### Images Not Loading

- Verify image path in JSON matches actual file
- Check that image is in `src/blogs_images/`
- Ensure image format is supported (jpg, png, webp)

### Filtering Not Working

- Clear browser cache
- Check that category name matches exactly
- Verify JavaScript console for errors

## Future Enhancements

Potential improvements:

- Search functionality
- Tags filtering
- Related posts
- Social sharing buttons
- Comments system
- RSS feed generation

## Support

For questions or issues, contact the development team or refer to the implementation plan in the artifacts folder.
