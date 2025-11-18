// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Submission
function handleSubmit(event) {
    event.preventDefault();
    alert('Thank you! We will contact you within 24 hours to discuss your requirements.');
    event.target.reset();
}

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.background = 'var(--primary)';
    navLinks.style.flexDirection = 'column';
    navLinks.style.padding = '1rem';
}

// Update footer year
document.addEventListener('DOMContentLoaded', function() {
    const year = new Date().getFullYear();
    const footerText = document.querySelector('footer p');
    if (footerText) {
        footerText.innerHTML = `&copy; ${year} Whitezebra Consulting Pvt. Ltd. All Rights Reserved.`;
    }
});