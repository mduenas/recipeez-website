// Recipeez Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            
            // Change hamburger icon to X when open
            mobileMenuToggle.innerHTML = isExpanded ? '✕' : '☰';
        });
        
        // Close menu when clicking on a link (mobile)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.innerHTML = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.innerHTML = '☰';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, false);
    
    // Screenshot carousel touch/swipe support
    const carousel = document.querySelector('.screenshot-carousel');
    if (carousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.cursor = 'grabbing';
        });
        
        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });
        
        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchScrollLeft = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchScrollLeft = carousel.scrollLeft;
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            const touchX = e.touches[0].clientX;
            const walk = (touchStartX - touchX) * 2;
            carousel.scrollLeft = touchScrollLeft + walk;
        });
        
        carousel.addEventListener('touchend', () => {
            touchStartX = 0;
        });
    }
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    // Download button tracking (placeholder for analytics)
    const downloadButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .store-badge');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Placeholder for analytics tracking
            const buttonText = this.getAttribute('alt') || this.textContent || this.innerText;
            console.log('Download button clicked:', buttonText.trim());

            // Only prevent default for placeholder links, allow real store links
            if (this.href === '#' || this.href.endsWith('#')) {
                e.preventDefault();
                alert('Coming soon! This feature is currently in development.');
            }
        });
    });
    
    // Form handling for contact forms (if any)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                alert('Thank you for your message! We\'ll get back to you soon.');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.innerHTML = '☰';
        }
        
        // Tab navigation for carousel
        if (e.key === 'Tab' && carousel) {
            const focusableElements = carousel.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    });
    
    // Performance optimization: Preload critical images
    const criticalImages = [
        '/assets/images/app-mockup.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Initialize any third-party integrations
    initAnalytics();
    initCookieConsent();
});

// Analytics initialization (placeholder)
function initAnalytics() {
    // Google Analytics 4 would go here
    // gtag('config', 'GA_MEASUREMENT_ID');
    console.log('Analytics initialized (placeholder)');
}

// Cookie consent (placeholder for future implementation)
function initCookieConsent() {
    // Cookie consent banner logic would go here
    console.log('Cookie consent initialized (placeholder)');
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce, throttle };
}

// ============ Trending Recipes Functionality ============

// Store recipe data for modal display
let trendingRecipesData = [];

// Load trending recipes on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('trending-grid')) {
        loadTrendingRecipes();
    }

    // Setup modal event listeners
    const modal = document.getElementById('recipe-modal');
    if (modal) {
        modal.querySelector('.modal-close').addEventListener('click', closeRecipeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeRecipeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeRecipeModal();
            }
        });
    }
});

async function loadTrendingRecipes() {
    const grid = document.getElementById('trending-grid');
    const errorContainer = document.getElementById('trending-error');

    if (!grid) return;

    // Show loading state
    grid.innerHTML = generateSkeletonCards(6);
    if (errorContainer) errorContainer.style.display = 'none';

    try {
        const response = await fetch('/api/trending-recipes');

        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }

        const data = await response.json();

        if (!data.success || !data.recipes || data.recipes.length === 0) {
            throw new Error('No recipes available');
        }

        trendingRecipesData = data.recipes;
        grid.innerHTML = data.recipes.map(recipe => generateRecipeCard(recipe)).join('');

        // Add click handlers to cards
        grid.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', () => openRecipeModal(card.dataset.recipeId));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openRecipeModal(card.dataset.recipeId);
                }
            });
        });

    } catch (error) {
        console.error('Failed to load trending recipes:', error);
        grid.innerHTML = '';
        errorContainer.style.display = 'block';
    }
}

function generateSkeletonCards(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += '<div class="recipe-skeleton" aria-hidden="true">' +
            '<div class="skeleton-image"></div>' +
            '<div class="skeleton-content">' +
            '<div class="skeleton-title"></div>' +
            '<div class="skeleton-meta"></div>' +
            '</div></div>';
    }
    return html;
}

function generateRecipeCard(recipe) {
    const imageHtml = recipe.imageUrl
        ? '<img class="recipe-card-image" src="' + escapeHtml(recipe.imageUrl) + '" alt="' + escapeHtml(recipe.title) + '" loading="lazy">'
        : '<div class="recipe-card-image placeholder">🍳</div>';

    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
    const difficultyClass = (recipe.difficulty || 'BEGINNER').toLowerCase();

    return '<article class="recipe-card" data-recipe-id="' + escapeHtml(recipe.id) + '" tabindex="0" role="button" aria-label="View ' + escapeHtml(recipe.title) + ' recipe">' +
        imageHtml +
        '<div class="recipe-card-content">' +
        '<h3 class="recipe-card-title">' + escapeHtml(recipe.title) + '</h3>' +
        '<p class="recipe-card-description">' + escapeHtml(recipe.description || '') + '</p>' +
        '<div class="recipe-card-meta">' +
        (totalTime > 0 ? '<span>⏱️ ' + totalTime + ' min</span>' : '') +
        (recipe.servings ? '<span>👥 ' + recipe.servings + ' servings</span>' : '') +
        '<span class="difficulty-badge ' + difficultyClass + '">' + formatDifficulty(recipe.difficulty) + '</span>' +
        '</div>' +
        '<div class="recipe-card-stats">' +
        '<span class="recipe-stat"><span class="icon">❤️</span> ' + formatNumber(recipe.likeCount || 0) + '</span>' +
        '<span class="recipe-stat"><span class="icon">👁️</span> ' + formatNumber(recipe.viewCount || 0) + '</span>' +
        '<span class="recipe-stat"><span class="icon">🔖</span> ' + formatNumber(recipe.saveCount || 0) + '</span>' +
        '</div></div></article>';
}

function openRecipeModal(recipeId) {
    const recipe = trendingRecipesData.find(r => r.id === recipeId);
    if (!recipe) return;

    const modal = document.getElementById('recipe-modal');

    // Populate modal content
    const modalImage = document.getElementById('modal-image');
    if (recipe.imageUrl) {
        modalImage.src = recipe.imageUrl;
        modalImage.alt = recipe.title;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }

    document.getElementById('modal-title').textContent = recipe.title;
    document.getElementById('modal-description').textContent = recipe.description || 'No description available.';

    // Meta info
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
    let metaHtml = '';
    if (totalTime > 0) metaHtml += '<span>⏱️ ' + totalTime + ' min total</span>';
    if (recipe.prepTime) metaHtml += '<span>📋 ' + recipe.prepTime + ' min prep</span>';
    if (recipe.cookTime) metaHtml += '<span>🔥 ' + recipe.cookTime + ' min cook</span>';
    if (recipe.servings) metaHtml += '<span>👥 ' + recipe.servings + ' servings</span>';
    if (recipe.cuisine) metaHtml += '<span>🌍 ' + escapeHtml(recipe.cuisine) + '</span>';
    document.getElementById('modal-meta').innerHTML = metaHtml;

    // Ingredients
    const ingredientsList = document.getElementById('modal-ingredients');
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        ingredientsList.innerHTML = recipe.ingredients.map(ing =>
            '<li>' + escapeHtml(ing) + '</li>'
        ).join('');
    } else {
        ingredientsList.innerHTML = '<li>No ingredients listed</li>';
    }

    // Instructions
    const instructionsList = document.getElementById('modal-instructions');
    if (recipe.instructions && recipe.instructions.length > 0) {
        instructionsList.innerHTML = recipe.instructions.map(inst => {
            const text = typeof inst === 'string' ? inst : (inst.instruction || '');
            return '<li>' + escapeHtml(text) + '</li>';
        }).join('');
    } else {
        instructionsList.innerHTML = '<li>No instructions available</li>';
    }

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus management
    modal.querySelector('.modal-close').focus();
}

function closeRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Utility functions for trending recipes
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDifficulty(difficulty) {
    const map = {
        'BEGINNER': 'Easy',
        'INTERMEDIATE': 'Medium',
        'ADVANCED': 'Hard'
    };
    return map[difficulty] || 'Easy';
}