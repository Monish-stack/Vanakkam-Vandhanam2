document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Animation (Safety first)
    const hideLoader = () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => { if(loader.parentNode) loader.remove(); }, 1500);
        }
        triggerHeroAnimations();
    };

    // Force loader removal after 5 seconds as absolute fallback
    setTimeout(hideLoader, 5000);

    // Standard loader removal
    window.addEventListener('load', () => {
        setTimeout(hideLoader, 1000);
    });

    // 2. Advanced Hover Image Reveal for Services
    const hoverPreviewImg = document.getElementById('hoverPreviewImg');
    
    document.addEventListener('mousemove', (e) => {
        if (hoverPreviewImg && hoverPreviewImg.classList.contains('active')) {
            hoverPreviewImg.style.left = e.clientX + 'px';
            hoverPreviewImg.style.top = e.clientY + 'px';
        }
    });

    document.querySelectorAll('.scc-sub').forEach(item => {
        const imgSource = item.querySelector('img').src;
        item.addEventListener('mouseenter', () => {
            if (hoverPreviewImg) {
                hoverPreviewImg.src = imgSource;
                hoverPreviewImg.classList.add('active');
            }
        });
        item.addEventListener('mouseleave', () => {
            if (hoverPreviewImg) {
                hoverPreviewImg.classList.remove('active');
            }
        });
    });

    // 3. Magnetic Buttons
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const magnetics = document.querySelectorAll('.magnetic');
    
    if (!isTouchDevice) {
        magnetics.forEach(btn => {
            btn.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const strength = this.getAttribute('data-strength') || 20;
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.style.transform = `translate(${x / rect.width * strength}px, ${y / rect.height * strength}px)`;
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // 4. Hero Animations (Triggered after loader)
    function triggerHeroAnimations() {
        const lineContents = document.querySelectorAll('.line-content');
        lineContents.forEach((el, index) => {
            el.style.transform = 'translateY(100%) rotateX(-20deg)';
            el.style.opacity = '0';
            el.style.transformOrigin = 'top center';
            el.style.transition = `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2 + 0.3}s, opacity 1s ease ${index * 0.2 + 0.3}s`;
            
            setTimeout(() => {
                el.style.transform = 'translateY(0) rotateX(0deg)';
                el.style.opacity = '1';
                el.classList.add('visible');
            }, 50);
        });

        const fadeUps = document.querySelectorAll('.hero-content .reveal-text');
        fadeUps.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200 + 900);
        });
    }

    // 5. Scroll Animations & Counters
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2500;
        const startTime = performance.now();

        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.ceil(easedProgress * target);

            el.innerText = current + (target === 100 ? '' : '+');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        requestAnimationFrame(updateCounter);
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counters
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    if(!counter.classList.contains('counted')) {
                        animateCounter(counter);
                        counter.classList.add('counted');
                    }
                });

                // Trigger stat underlines
                const statItems = entry.target.querySelectorAll('.stat-item');
                statItems.forEach((item, i) => {
                    setTimeout(() => item.classList.add('visible'), i * 200);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll, .stagger-reveal').forEach(el => scrollObserver.observe(el));

    // Interactive Card Glow Tracking (mouse-following highlight)
    document.querySelectorAll('.service-category-card, .journal-card, .pricing-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });


    // 6. 3D Tilt Effect on Gallery Cards with Glare
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        const inner = card.querySelector('.card-inner');
        
        // Add glare element if not exists
        let glare = inner.querySelector('.glare');
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'glare';
            inner.appendChild(glare);
        }
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg
            const rotateY = ((x - centerX) / centerX) * 15;
            
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Glare effect
            const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) - 90;
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const opacity = Math.min(distance / (rect.width/2), 0.5);
            glare.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`;
            glare.style.opacity = opacity;
        });
        
        card.addEventListener('mouseleave', () => {
            inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
            glare.style.opacity = '0';
        });
    });

    // 7. Scroll Events (Progress, Navbar, Back to Top)
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / totalHeight) * 100;
        
        // Update progress bar
        if(scrollProgress) scrollProgress.style.width = progress + '%';
        

        
        // Dynamic Hero Scroll Indicator Fade
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            const fadeProgress = Math.max(0, 1 - (scrolled / 300));
            scrollIndicator.style.opacity = fadeProgress;
            scrollIndicator.style.transform = `translateY(${scrolled * 0.2}px)`;
        }

        // Hero Window Parallax Effect
        const heroBg = document.querySelector('.hero-bg-wrapper');
        const heroContent = document.querySelector('.hero-content');
        if (heroBg && scrolled < window.innerHeight) {
            const scrollRatio = scrolled / window.innerHeight;
            // Scale down slightly and push down
            heroBg.style.transform = `scale(${1 - (scrollRatio * 0.15)}) translateY(${scrolled * 0.4}px)`;
            heroBg.style.borderRadius = `${scrollRatio * 100}px`;
            heroContent.style.transform = `translateY(${scrolled * 0.6}px)`;
            heroContent.style.opacity = 1 - (scrollRatio * 1.5);
        }
        
        // Show/Hide back to top
        if(scrolled > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
        
        // Navbar
        const navbar = document.querySelector('.navbar');
        if (scrolled > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        
        // Floating Ornament Parallax Depth
        document.querySelectorAll('.floating-ornament').forEach((orn, i) => {
            const speed = (i + 1) * 0.03;
            orn.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
        });
    });

    // No replacement, deleting block.

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Hero Parallax on mouse move
    const hero = document.querySelector('.hero');
    const heroBgImg = document.querySelector('.hero .bg-img');
    if (hero && heroBgImg) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            requestAnimationFrame(() => {
                heroBgImg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
            });
        });
        hero.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => heroBgImg.style.transform = `scale(1.1) translate(0px, 0px)`);
        });
    }

    // 8. Gallery Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => card.style.display = 'none', 400);
                }
            });
            // Re-trigger scroll observer to ensure visible ones show
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
            }, 100);
        });
    });

    // 9. Accordion Services
    const accordions = document.querySelectorAll('.accordion-item');
    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = acc.classList.contains('active');
            accordions.forEach(other => other.classList.remove('active'));
            if (!isActive) acc.classList.add('active');
        });
    });

    // 9b. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(other => other.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // 9c. Mobile Menu
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if(hamburgerBtn && mobileMenu) {
        const toggleMobileMenu = (active) => {
            if(active) mobileMenu.classList.add('active');
            else mobileMenu.classList.remove('active');
        };

        hamburgerBtn.addEventListener('click', () => toggleMobileMenu(true));
        if(mobileClose) mobileClose.addEventListener('click', () => toggleMobileMenu(false));
        mobileLinks.forEach(link => link.addEventListener('click', () => toggleMobileMenu(false)));
    }

    // 9d. Lightbox for Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    if(lightbox) {
        document.querySelectorAll('.gallery-card').forEach(card => {
            card.addEventListener('click', () => {
                const imgSrc = card.querySelector('img').src;
                const title = card.querySelector('h3').innerText;
                if(lightboxImg) lightboxImg.src = imgSrc;
                if(lightboxCaption) lightboxCaption.innerText = title;
                lightbox.classList.add('active');
            });
        });

        if(lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox) lightbox.classList.remove('active');
        });
    }

    // 10. Modal Stylist
    const modal = document.getElementById('stylistModal');
    const openBtn = document.getElementById('openStylist');
    const closeBtn = document.querySelector('.close-modal');
    const genBtn = document.getElementById('generateBtn');
    const modalBody = document.getElementById('modalBody');

    openBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('active');
    });

    genBtn.addEventListener('click', () => {
        const eventType = document.getElementById('aiEvent').value || "special celebration";
        const palette = document.getElementById('aiPalette').value || "royal hues";
        
        genBtn.innerText = "Designing Magic...";
        genBtn.disabled = true;

        setTimeout(() => {
            modalBody.innerHTML = `
                <div class="ai-result-card" style="background: rgba(212,175,55,0.05); padding: 30px; border-radius: 25px; border: 1px solid var(--accent-gold); box-shadow: 0 20px 50px rgba(128,0,0,0.1);">
                    <h4 class="gradient-text font-serif" style="margin-bottom: 15px; font-size: 1.5rem;">Bespoke Concept Design</h4>
                    <p id="typewriterText" style="line-height: 1.8; font-size: 1.1rem; color: var(--text-dark); min-height: 100px;"></p>
                    <div class="header-line" style="margin: 20px 0;"></div>
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <span class="badge" style="background: rgba(128,0,0,0.1); color: var(--primary-maroon); border: none;">Luxury Styling</span>
                        <span class="badge" style="background: rgba(212,175,55,0.1); color: var(--accent-gold); border: none;">Hand-Crafted</span>
                    </div>
                </div>
                <button class="btn-primary magnetic glow-effect" data-strength="20" style="width: 100%; margin-top: 25px; padding: 1.2rem;" onclick="window.open('https://wa.me/919788742627', '_blank')">Discuss this Design on WhatsApp</button>
            `;
            
            const text = `For your ${eventType}, we envision a masterpiece using ${palette}. We will blend organic floral textures with majestic golden architecture, accented by intelligent mood lighting to create a cinematic atmosphere that whispers luxury in every detail.`;
            let i = 0;
            const typewriter = () => {
                const textEl = document.getElementById('typewriterText');
                if (textEl && i < text.length) {
                    textEl.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typewriter, 30);
                } else {
                    genBtn.innerText = "Concept Ready";
                    genBtn.disabled = false;
                }
            };
            typewriter();

            // Add keyframes for popIn dynamically
            if (!document.getElementById('popInStyles')) {
                const style = document.createElement('style');
                style.id = 'popInStyles';
                style.innerHTML = `@keyframes popIn { to { transform: scale(1); opacity: 1; } }`;
                document.head.appendChild(style);
            }
            
            // Re-bind magnetics for new button
            const newMag = modalBody.querySelector('.magnetic');
            if(newMag) {
                newMag.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const strength = this.getAttribute('data-strength') || 20;
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    this.style.transform = `translate(${x / rect.width * strength}px, ${y / rect.height * strength}px)`;
                });
                newMag.addEventListener('mouseleave', function() {
                    this.style.transform = `translate(0px, 0px)`;
                });
            }
        }, 1500);
    });

    // 11. Canvas Particle System
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor(type = 'star') {
                this.type = type;
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = this.type === 'star' ? (Math.random() * 2.5 + 0.5) : (Math.random() * 150 + 50);
                this.speedY = this.type === 'star' ? (Math.random() * 0.4 + 0.1) : (Math.random() * 0.1 + 0.05);
                this.speedX = (Math.random() - 0.5) * (this.type === 'star' ? 0.3 : 0.1);
                const isGold = Math.random() > 0.4;
                this.baseColor = isGold ? '212, 175, 55' : '128, 0, 0';
                this.sparkle = Math.random() * 0.02 + 0.01;
                this.alpha = Math.random();
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.x += Math.sin(this.y * 0.01) * (this.type === 'star' ? 0.5 : 0.2);
                
                this.alpha += this.sparkle;
                if(this.alpha > 0.8 || this.alpha < 0.1) this.sparkle *= -1;

                if (this.y > h + 100) {
                    this.y = -100;
                    this.x = Math.random() * w;
                }
            }
            draw() {
                ctx.beginPath();
                if (this.type === 'star') {
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${this.baseColor}, ${this.alpha})`;
                    ctx.fill();
                } else {
                    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                    gradient.addColorStop(0, `rgba(${this.baseColor}, ${this.alpha * 0.15})`);
                    gradient.addColorStop(1, `rgba(${this.baseColor}, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        const initParticles = () => {
            particles = [];
            const starCount = window.innerWidth < 768 ? 150 : 500;
            const glowCount = window.innerWidth < 768 ? 5 : 12;
            
            for (let i = 0; i < starCount; i++) particles.push(new Particle('star'));
            for (let i = 0; i < glowCount; i++) particles.push(new Particle('glow'));
        };
        initParticles();

        const animateParticles = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }
});
