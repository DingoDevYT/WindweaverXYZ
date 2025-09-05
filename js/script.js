document.addEventListener('DOMContentLoaded', function () {
    // Navigation visibility on scroll
    let lastScrollTop = 0;
    const nav = document.querySelector('.navigation');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > window.innerHeight * 0.1) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gallery functionality
    const galleryTrack = document.querySelector('.gallery-track');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    let currentIndex = 0;
    let autoRotateInterval;

    if (galleryTrack && prevBtn && nextBtn) {
        const slides = document.querySelectorAll('.gallery-slide');
        const slideCount = slides.length;

        // Only proceed if we have slides
        if (slideCount > 0) {
            function updateGallery() {
                const translateX = -currentIndex * 100;
                galleryTrack.style.transform = `translateX(${translateX}%)`;
                
                // Update button visibility for better UX
                prevBtn.style.opacity = slideCount <= 1 ? '0.3' : '1';
                nextBtn.style.opacity = slideCount <= 1 ? '0.3' : '1';
            }

            function startAutoRotate() {
                if (slideCount > 1) {
                    autoRotateInterval = setInterval(() => {
                        currentIndex = (currentIndex + 1) % slideCount;
                        updateGallery();
                    }, 5000); // 5 seconds between slides
                }
            }

            function stopAutoRotate() {
                if (autoRotateInterval) {
                    clearInterval(autoRotateInterval);
                }
            }

            // Next button functionality
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (slideCount > 1) {
                    stopAutoRotate();
                    currentIndex = (currentIndex + 1) % slideCount;
                    updateGallery();
                    // Restart auto-rotate after user interaction
                    setTimeout(startAutoRotate, 3000);
                }
            });

            // Previous button functionality
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (slideCount > 1) {
                    stopAutoRotate();
                    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                    updateGallery();
                    // Restart auto-rotate after user interaction
                    setTimeout(startAutoRotate, 3000);
                }
            });

            // Pause auto-rotate on hover
            const galleryContainer = document.querySelector('.gallery-container');
            if (galleryContainer) {
                galleryContainer.addEventListener('mouseenter', stopAutoRotate);
                galleryContainer.addEventListener('mouseleave', startAutoRotate);
            }

            // Touch/swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            galleryTrack.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            galleryTrack.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50; // Minimum distance for swipe
                const swipeDistance = touchStartX - touchEndX;

                if (Math.abs(swipeDistance) > swipeThreshold && slideCount > 1) {
                    stopAutoRotate();
                    
                    if (swipeDistance > 0) {
                        // Swipe left - go to next slide
                        currentIndex = (currentIndex + 1) % slideCount;
                    } else {
                        // Swipe right - go to previous slide
                        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                    }
                    
                    updateGallery();
                    setTimeout(startAutoRotate, 3000);
                }
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                // Only handle keys when gallery is in viewport
                const galleryRect = galleryContainer.getBoundingClientRect();
                const isInViewport = galleryRect.top < window.innerHeight && galleryRect.bottom > 0;
                
                if (isInViewport && slideCount > 1) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        stopAutoRotate();
                        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                        updateGallery();
                        setTimeout(startAutoRotate, 3000);
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        stopAutoRotate();
                        currentIndex = (currentIndex + 1) % slideCount;
                        updateGallery();
                        setTimeout(startAutoRotate, 3000);
                    }
                }
            });

            // Initialize gallery
            updateGallery();
            startAutoRotate();
        }
    }

    // Intersection Observer for animations
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        scrollObserver.observe(section);
    });

    // Active navigation item tracking
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Parallax effect for hero video
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVideo = document.querySelector('.hero-video');
        const heroSection = document.querySelector('.hero-section');
        
        if (heroVideo && scrolled < heroSection.offsetHeight) {
            const rate = scrolled * -0.5;
            heroVideo.style.transform = `translateX(-50%) translateY(calc(-50% + ${rate}px))`;
        }
    });

    // Enhanced wind-like cursor effect
    document.addEventListener('mousemove', (e) => {
        const cursor = document.querySelector('.cursor');
        if (!cursor) {
            const newCursor = document.createElement('div');
            newCursor.className = 'cursor';
            newCursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(0,255,136,0.8) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: screen;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(newCursor);
        }
        
        const activeCursor = document.querySelector('.cursor');
        if (activeCursor) {
            activeCursor.style.left = e.clientX - 10 + 'px';
            activeCursor.style.top = e.clientY - 10 + 'px';
        }
    });

    // Add floating particles effect
    function createFloatingParticles() {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(0, 255, 136, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                animation: float ${Math.random() * 20 + 10}s infinite linear;
            `;
            
            document.body.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, (Math.random() * 20 + 10) * 1000);
        }
    }
    
    // Create particles periodically
    setInterval(createFloatingParticles, 1000);
    createFloatingParticles(); // Initial particles

    // Add CSS for floating particles animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            from {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            to {
                transform: translateY(-10vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});