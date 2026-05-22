/* ==========================================================================
   DENTALCARE CLINIC - PREMIUM INTERACTIVE LAYER (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       1. STICKY HEADER & SCROLL SPY NAVIGATION
       -------------------------------------------------------------------------- */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Add scroll class to Header
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Highlight Nav Link on Scroll (Scroll Spy)
    const handleScrollSpy = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust offset for sticky header height (80px)
            if (window.scrollY >= (sectionTop - 120)) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        handleScrollSpy();
    });
    
    // Initial triggers on load
    handleHeaderScroll();
    handleScrollSpy();

    /* --------------------------------------------------------------------------
       2. MOBILE HAMBURGER MENU
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    const toggleMobileMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent body scrolling when menu is active
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };
    
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    /* --------------------------------------------------------------------------
       3. ANIMATED STATISTICS COUNTER (INTERSECTION OBSERVER)
       -------------------------------------------------------------------------- */
    const statsSection = document.getElementById('stats-counter-row');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const startCounting = () => {
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            let count = 0;
            // Adjust speeds based on the target magnitude
            const duration = 2000; // 2 seconds total duration
            const stepTime = Math.max(Math.floor(duration / target), 15);
            const increment = Math.ceil(target / (duration / stepTime));
            
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    num.innerText = target + (target === 12 || target === 15 ? '+' : target === 99 ? '%' : '+');
                    clearInterval(timer);
                } else {
                    // Formatting with commas for large numbers
                    num.innerText = count.toLocaleString() + (target === 12 || target === 15 ? '+' : target === 99 ? '%' : '+');
                }
            }, stepTime);
        });
    };
    
    // Intersection Observer for Statistics section
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    startCounting();
                    animated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        statsObserver.observe(statsSection);
    } else {
        // Fallback for older browsers
        setTimeout(startCounting, 1000);
    }

    /* --------------------------------------------------------------------------
       4. EXPANDABLE TEAM DRAWER
       -------------------------------------------------------------------------- */
    const viewAllTeamBtn = document.getElementById('view-all-team-btn');
    const allTeamDrawer = document.getElementById('all-team-drawer');
    
    if (viewAllTeamBtn && allTeamDrawer) {
        viewAllTeamBtn.addEventListener('click', () => {
            allTeamDrawer.classList.toggle('expanded');
            if (allTeamDrawer.classList.contains('expanded')) {
                viewAllTeamBtn.innerText = 'Show Less Specialists';
                // Adjust scroll behavior slightly so they see the expanded area
                setTimeout(() => {
                    allTeamDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            } else {
                viewAllTeamBtn.innerText = 'Meet All Doctors';
                const teamSection = document.getElementById('team');
                teamSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* --------------------------------------------------------------------------
       5. INTERACTIVE BOOKING FORM VALIDATION & SUCCESS HANDLER
       -------------------------------------------------------------------------- */
    const bookingForm = document.getElementById('booking-form');
    const formSuccessCard = document.getElementById('form-success-card');
    const successDoneBtn = document.getElementById('success-done-btn');
    
    // Form Inputs
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const doctorSelect = document.getElementById('form-doctor');
    const dateInput = document.getElementById('form-date');
    const phoneInput = document.getElementById('form-phone');
    const privacyCheck = document.getElementById('form-privacy');
    
    // Set Min Date to Tomorrow
    const setMinBookingDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    };
    
    if (dateInput) {
        setMinBookingDate();
    }
    
    // Helper to validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    // Helper to validate phone format (standard 7 to 15 digits, allows space/dash/plus)
    const isValidPhone = (phone) => {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone.trim());
    };
    
    // Validate individual form group
    const validateField = (inputElement, errorElement, validationFn, errorMessage) => {
        const parent = inputElement.parentElement;
        const value = inputElement.value.trim();
        
        if (!value || (validationFn && !validationFn(value))) {
            parent.classList.add('invalid');
            if (errorElement) errorElement.innerText = errorMessage || 'Invalid field input';
            return false;
        } else {
            parent.classList.remove('invalid');
            return true;
        }
    };
    
    // Validate Select Element
    const validateSelect = (selectElement, errorElement, errorMessage) => {
        const parent = selectElement.parentElement;
        if (selectElement.value === '') {
            parent.classList.add('invalid');
            if (errorElement) errorElement.innerText = errorMessage;
            return false;
        } else {
            parent.classList.remove('invalid');
            return true;
        }
    };
    
    // Validate Checkbox
    const validateCheckbox = (checkboxElement, errorElement, errorMessage) => {
        const parent = checkboxElement.parentElement;
        if (!checkboxElement.checked) {
            parent.classList.add('invalid');
            if (errorElement) errorElement.style.display = 'block';
            return false;
        } else {
            parent.classList.remove('invalid');
            if (errorElement) errorElement.style.display = 'none';
            return true;
        }
    };
    
    // Full Form Validation on Submit
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isNameValid = validateField(nameInput, document.getElementById('name-error'), val => val.length >= 2, 'Name must be at least 2 characters.');
            const isEmailValid = validateField(emailInput, document.getElementById('email-error'), isValidEmail, 'Please enter a valid email address.');
            const isDoctorValid = validateSelect(doctorSelect, document.getElementById('doctor-error'), 'Please select a specialist.');
            const isDateValid = validateField(dateInput, document.getElementById('date-error'), null, 'Please choose a future clinical date.');
            const isPhoneValid = validateField(phoneInput, document.getElementById('phone-error'), isValidPhone, 'Please enter a valid 10-digit phone number.');
            const isPrivacyValid = validateCheckbox(privacyCheck, document.getElementById('privacy-error'), 'You must agree to our clinical privacy guidelines.');
            
            if (isNameValid && isEmailValid && isDoctorValid && isDateValid && isPhoneValid && isPrivacyValid) {
                // Perform visual transition to Success Card overlay
                formSuccessCard.classList.add('active');
            }
        });
        
        // Remove error styling on keyup/change
        nameInput.addEventListener('input', () => nameInput.parentElement.classList.remove('invalid'));
        emailInput.addEventListener('input', () => emailInput.parentElement.classList.remove('invalid'));
        doctorSelect.addEventListener('change', () => doctorSelect.parentElement.classList.remove('invalid'));
        dateInput.addEventListener('change', () => dateInput.parentElement.classList.remove('invalid'));
        phoneInput.addEventListener('input', () => phoneInput.parentElement.classList.remove('invalid'));
        privacyCheck.addEventListener('change', () => {
            privacyCheck.parentElement.classList.remove('invalid');
            document.getElementById('privacy-error').style.display = 'none';
        });
    }
    
    // Success Done Button Resetting state
    if (successDoneBtn) {
        successDoneBtn.addEventListener('click', () => {
            formSuccessCard.classList.remove('active');
            if (bookingForm) {
                bookingForm.reset();
                setMinBookingDate(); // Reset min date
            }
        });
    }

    /* --------------------------------------------------------------------------
       6. PLAY TESTIMONIAL VIDEO INTERACTION
       -------------------------------------------------------------------------- */
    const videoBtn = document.getElementById('video-testimonial-btn');
    if (videoBtn) {
        videoBtn.addEventListener('click', () => {
            // High-end user visual alert/modal when they watch video
            alert("▶️ Opening patient video review: 'Emily Watson - My Veneers Journey at Smile Care'. This would launch a modern lightbox overlay showing the clinic patient testimonial video.");
        });
    }

    /* --------------------------------------------------------------------------
       7. NEWSLETTER FORM HANDLER
       -------------------------------------------------------------------------- */
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            alert(`✨ Thank you! Email address '${email}' successfully subscribed to Smile Care healthy newsletter.`);
            newsletterForm.reset();
        });
    }
    
});
