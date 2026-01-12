// Mobile menu toggle with hamburger/cross animation
let isMenuOpen = false;
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    // Toggle menu visibility
    navLinks.classList.toggle('active');
    
    // Toggle hamburger/cross animation
    mobileMenu.classList.toggle('open');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    const isClickInsideNav = navLinks.contains(event.target) || mobileMenu.contains(event.target);
    
    if (!isClickInsideNav && isMenuOpen) {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = 'auto';
        isMenuOpen = false;
    }
});

// Navbar hide/show on scroll
let lastScrollTop = 0;
const navbar = document.getElementById('mainNav');
const scrollThreshold = 100; // Minimum scroll distance before hiding
let isNavbarVisible = true;

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Determine scroll direction
    if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        // Scrolling DOWN - hide navbar
        if (isNavbarVisible) {
            navbar.classList.add('hide-nav');
            isNavbarVisible = false;
        }
    } else {
        // Scrolling UP - show navbar
        if (!isNavbarVisible) {
            navbar.classList.remove('hide-nav');
            isNavbarVisible = true;
        }
    }
    
    lastScrollTop = scrollTop;
    
    // Navbar background on scroll
    if (scrollTop > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    }
});

// Show navbar when mouse is near top of screen
document.addEventListener('mousemove', function(e) {
    if (e.clientY < 100 && !isNavbarVisible) {
        navbar.classList.remove('hide-nav');
        isNavbarVisible = true;
    }
});

// Scroll to next section when clicking scroll indicator
function scrollToNextSection() {
    const nextSection = document.querySelector('#about');
    nextSection.scrollIntoView({ behavior: 'smooth' });
}

// Keep navbar visible when hovering over it
navbar.addEventListener('mouseenter', function() {
    if (!isNavbarVisible) {
        navbar.classList.remove('hide-nav');
        isNavbarVisible = true;
    }
});

// Handle mobile viewport height for hero section
function setHeroHeight() {
    const hero = document.querySelector('.hero');
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Set hero section height to full viewport
    hero.style.height = `${window.innerHeight}px`;
}

// Set initial hero height
setHeroHeight();

// Update hero height on resize and orientation change
window.addEventListener('resize', setHeroHeight);
window.addEventListener('orientationchange', setHeroHeight);

// Close menu on window resize if it becomes desktop view
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && isMenuOpen) {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = 'auto';
        isMenuOpen = false;
    }
});