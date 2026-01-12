# Blog Image Guidelines

## Adding Images to Blog Posts

### Step 1: Prepare Your Image

1. **Recommended Dimensions:**
   - Featured Image (blog post detail): 1200x630px (16:9 ratio)
   - Thumbnail (blog listing): 800x450px minimum
2. **File Format:**

   - Use JPG for photographs
   - Use PNG for graphics with transparency
   - Use WebP for best compression (modern browsers)

3. **File Size:**

   - Keep under 500KB for fast loading
   - Use tools like TinyPNG or Squoosh to compress

4. **Naming Convention:**
   - Use lowercase with hyphens
   - Match your blog post slug
   - Example: `offshore-backend-operations.jpg`

### Step 2: Add Image to Project

1. Place your image in: `src/blogs_images/`
2. Full path example: `src/blogs_images/offshore-backend-operations.jpg`

### Step 3: Reference in JSON

In your blog post JSON file:

```json
{
  "image": "offshore-backend-operations.jpg",
  "imageAlt": "Team working on offshore operations"
}
```

**Note:** Only include the filename, not the full path. The system automatically looks in `blogs_images/` folder.

### Step 4: Image Display

Images will automatically display:

- **On blog listing page (blog.html):** As a gradient overlay (decorative)
- **On blog post page (blog-post.html):** As a featured image at the top of the article

### Optional: No Image

If you don't have an image:

- Leave the `image` field as an empty string: `"image": ""`
- The blog listing will show a gradient background
- The blog post page will skip the featured image section

### Image Best Practices

1. **Relevance:** Choose images that relate to your content
2. **Quality:** Use high-resolution images
3. **Alt Text:** Always provide descriptive alt text for accessibility
4. **Consistency:** Maintain similar style across all blog images
5. **Copyright:** Only use images you have rights to use

### Free Image Resources

- Unsplash (unsplash.com)
- Pexels (pexels.com)
- Pixabay (pixabay.com)
- Freepik (freepik.com)

### Example

```json
{
  "id": "my-blog-post",
  "title": "How to Scale Your Business",
  "image": "business-scaling.jpg",
  "imageAlt": "Business growth chart showing upward trend"
}
```

The image will be loaded from: `src/blogs_images/business-scaling.jpg`
