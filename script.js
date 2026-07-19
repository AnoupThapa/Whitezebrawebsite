/**
 * Whitezebra Consulting - Core Navigation & Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('mainHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (!header || !menuToggle || !navLinks) return;

  let isMenuOpen = false;

  // --- 1. Header Scroll State ---
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load and add listener
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- 2. Accessible Mobile Hamburger Toggle ---
  const toggleMenu = (open) => {
    isMenuOpen = typeof open === 'boolean' ? open : !isMenuOpen;
    
    // Toggle active state on menu list
    navLinks.classList.toggle('open', isMenuOpen);
    
    // Update ARIA attribute
    menuToggle.setAttribute('aria-expanded', isMenuOpen.toString());
    
    // Update SVG states or styling if any
    menuToggle.classList.toggle('open', isMenuOpen);
    
    // Prevent background scroll when mobile menu is active
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    // If menu is opened, set focus to first item for keyboard accessibility
    if (isMenuOpen) {
      const firstLink = navLinks.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    }
  };

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close mobile menu when clicking outside of nav area
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !header.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close mobile menu when ESC is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      toggleMenu(false);
      menuToggle.focus();
    }
  });

  // Close mobile menu when nav links are clicked (useful for in-page anchors)
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) {
        toggleMenu(false);
      }
    });
  });

  // Clean reset of mobile navigation states when window is resized above 992px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && isMenuOpen) {
      toggleMenu(false);
    }
  });

  // --- 3. Auto-rotating Testimonial Slider ---
  const slides = document.querySelectorAll('.testimonial-slide');
  if (slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 6000);
  }

  // --- 4. Statistics Counter Animation ---
  const stats = document.querySelectorAll('.stats-section .stat-number');
  
  if (stats.length > 0) {
    const animateCounter = (el) => {
      const originalText = el.textContent.trim();
      const numbers = originalText.match(/\d+/g);
      if (!numbers) return;
      
      const targets = numbers.map(num => parseInt(num, 10));
      const nonNumbers = originalText.split(/\d+/);
      
      const duration = 1500; // 1.5 seconds animation duration
      let startTime = null;
      
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        let newText = '';
        for (let i = 0; i < nonNumbers.length; i++) {
          newText += nonNumbers[i];
          if (i < targets.length) {
            const currentVal = Math.floor(progress * targets[i]);
            newText += currentVal;
          }
        }
        
        el.textContent = newText;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = originalText;
        }
      };
      
      requestAnimationFrame(step);
    };

    const observerOptions = {
      root: null,
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el);
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
  }
});