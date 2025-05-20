document.addEventListener('DOMContentLoaded', () => {
    /**
     * Toggle section visibility with enhanced functionality
     */
    const toggleButtons = document.querySelectorAll('.toggle-button');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSectionId = button.getAttribute('data-target');
            
            if (!targetSectionId) {
                console.warn('Toggle button missing data-target attribute');
                return;
            }

            const targetSection = document.getElementById(targetSectionId);
            
            if (!targetSection) {
                console.error(`Target section not found: ${targetSectionId}`);
                return;
            }

            const isHidden = targetSection.style.display === 'none' || 
                           getComputedStyle(targetSection).display === 'none';
            
            // Toggle visibility
            targetSection.style.display = isHidden ? 'block' : 'none';
            
            // Update button text and ARIA attributes
            button.textContent = isHidden ? 'Hide Details' : 'Show Details';
            button.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
            
            // Smooth scroll to show the expanded content
            if (isHidden) {
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 50);
            }
        });

        // Initialize button state based on section visibility
        const initialTarget = document.getElementById(button.getAttribute('data-target'));
        if (initialTarget) {
            const isInitiallyHidden = getComputedStyle(initialTarget).display === 'none';
            button.setAttribute('aria-expanded', !isInitiallyHidden);
        }
    });

    /**
     * Enhanced smooth scrolling for navigation
     */
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            
            if (!targetId || targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);
            
            if (!targetElement) {
                console.error(`Target element not found: ${targetId}`);
                return;
            }

            event.preventDefault();
            
            // Calculate offset considering fixed headers if needed
            const offset = 80; // Adjust based on your header height
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL without jumping (for single-page applications)
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }

            // Update active link styling if needed
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });

    /**
     * Handle print events to ensure all sections are visible when printing
     */
    window.addEventListener('beforeprint', () => {
        toggleButtons.forEach(button => {
            const targetSection = document.getElementById(button.getAttribute('data-target'));
            if (targetSection) {
                targetSection.style.display = 'block';
                button.style.display = 'none';
            }
        });
    });

    window.addEventListener('afterprint', () => {
        toggleButtons.forEach(button => {
            button.style.display = 'block';
        });
    });

    /**
     * Initialize sections based on URL hash
     */
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});