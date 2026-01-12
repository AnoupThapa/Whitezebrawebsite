// Blog admin functions
function createBlogPost() {
    alert('In production: This would open a blog post editor. For now, manually create new HTML files.');
}

function editBlogPost(postId) {
    alert('In production: This would open the editor for post: ' + postId);
}

function deleteBlogPost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        alert('In production: Post ' + postId + ' would be deleted.');
    }
}