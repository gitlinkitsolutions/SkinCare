/**
 * GitLink Hair & Skin Care Clinic
 * Main JavaScript - Core Functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initCarousels();
    initCounters();
    initScrollAnimations();
    initBookingModal();
    initToast();
    initRippleEffects();
    initSmoothScroll();
    initScrollProgress();
    initGallery();
});

/**
 * Navbar Scroll Effect
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuClose = document.querySelector('.mobile-menu-close');

    if (!menuToggle || !mobileMenu) return;

    const openMenu = () => {
        mobileMenu.classList.add('active');
        menuOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        menuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', openMenu);
    menuClose?.addEventListener('click', closeMenu);
    menuOverlay?.addEventListener('click', closeMenu);

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

/**
 * Carousel Functionality
 */
function initCarousels() {
    document.querySelectorAll('.carousel-container').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let slidesPerView = getSlidesPerView(carousel);
        let autoPlayInterval;

        function getSlidesPerView(container) {
            if (container.classList.contains('carousel-packages')) return 3;
            if (container.classList.contains('carousel-services')) return 3;
            return 3;
        }

        function updateCarousel() {
            const slideWidth = slides[0].offsetWidth + 24; // Include gap
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }

        function nextSlide() {
            const maxIndex = slides.length - slidesPerView;
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            updateCarousel();
        }

        function prevSlide() {
            const maxIndex = slides.length - slidesPerView;
            currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
            updateCarousel();
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        prevBtn?.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });

        nextBtn?.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Handle resize
        window.addEventListener('resize', () => {
            slidesPerView = getSlidesPerView(carousel);
            currentIndex = Math.min(currentIndex, slides.length - slidesPerView);
            updateCarousel();
        });

        startAutoPlay();
    });
}

/**
 * Animated Counters
 */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';

    function update() {
        current += increment;
        if (current < target) {
            element.textContent = prefix + Math.floor(current) + suffix;
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + target + suffix;
        }
    }

    update();
}

/**
 * Scroll Animations (AOS fallback and custom)
 */
function initScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('[data-animate]');

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.85;

            if (isVisible) {
                el.classList.add('animated');
            }
        });
    };

    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });

    // Fade in elements
    window.addEventListener('scroll', animateOnScroll, { passive: true });
    animateOnScroll();
}

/**
 * Booking Modal
 */
function initBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;

    const overlay = modal.querySelector('.modal-overlay') || modal;
    const closeBtn = modal.querySelector('.modal-close');
    const triggerBtns = document.querySelectorAll('[data-modal="booking"]');

    const openModal = () => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    triggerBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeBtn?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Form submission
    const form = modal.querySelector('form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Consultation booked successfully! We will contact you shortly.', 'success');
        closeModal();
        form.reset();
    });
}

/**
 * Toast Notifications
 */
function initToast() {
    window.showToast = function (message, type = 'info') {
        const existingToast = document.querySelector('.toast');
        existingToast?.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';

        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-times-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <p class="toast-message">${message}</p>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => toast.classList.remove('show'), 4000);
        setTimeout(() => toast.remove(), 4500);
    };
}

/**
 * Ripple Effect
 */
function initRippleEffects() {
    document.querySelectorAll('.btn, .ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.offsetTop - offset;
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Progress Indicator
 */
function initScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressPercent = (scrollTop / docHeight);
        progress.style.transform = `scaleX(${progressPercent})`;
    }, { passive: true });
}

/**
 * Gallery Functionality
 */
function initGallery() {
    // Before/After slider
    const beforeAfterContainers = document.querySelectorAll('.before-after');

    beforeAfterContainers.forEach(container => {
        const slider = container.querySelector('.before-after-slider');
        if (!slider) return;

        const handleMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

            slider.style.left = percent + '%';

            const beforeImage = container.querySelector('.before-image');
            const afterImage = container.querySelector('.after-image');
            if (beforeImage) beforeImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        };

        container.addEventListener('mousemove', handleMove);
        container.addEventListener('touchmove', handleMove);
    });

    // Gallery filter
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-answer')?.style.setProperty('max-height', '0');
            });

            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/**
 * Lazy Loading Images
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * Parallax Effect
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(window.scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

/**
 * Contact Form Handler
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (isValid) {
            showToast('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
        } else {
            showToast('Please fill in all required fields.', 'error');
        }
    });
}

/**
 * AI Skin Analyzer Interaction
 */
function initAISkinAnalyzer() {
    const analyzerSection = document.querySelector('.ai-analyzer');
    const analyzeBtn = document.querySelector('[data-action="analyze"]');

    if (!analyzerSection || !analyzeBtn) return;

    analyzeBtn.addEventListener('click', () => {
        // Simulate scanning animation
        analyzerSection.classList.add('scanning');

        setTimeout(() => {
            analyzerSection.classList.remove('scanning');
            showToast('AI Analysis complete! Book a consultation to discuss your results.', 'success');
        }, 3000);
    });
}

// Initialize additional modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initLazyLoading();
    initParallax();
    initContactForm();
    initAISkinAnalyzer();
});

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}