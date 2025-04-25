// Countdown Timer
// Store the launch date outside the function so it doesn't get recalculated
let launchDate;

function updateCountdown() {
    // Only set the launch date once when the function is first called
    if (!launchDate) {
        const now = new Date();
        launchDate = new Date(now);
        launchDate.setDate(now.getDate() + 99);
        // console.log('Launch date set to:', launchDate);
    }
    
    const now = new Date();
    const timeLeft = launchDate.getTime() - now.getTime();

    // console.log('Current time:', now);
    // console.log('Time left (ms):', timeLeft);

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // console.log('Days:', days, 'Hours:', hours, 'Minutes:', minutes, 'Seconds:', seconds);

    // Check if elements exist before updating them
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (daysElement) daysElement.innerHTML = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.innerHTML = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.innerHTML = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.innerHTML = seconds.toString().padStart(2, '0');

    if (timeLeft < 0) {
        clearInterval(countdownInterval);
        if (daysElement) daysElement.innerHTML = '00';
        if (hoursElement) hoursElement.innerHTML = '00';
        if (minutesElement) minutesElement.innerHTML = '00';
        if (secondsElement) secondsElement.innerHTML = '00';
    }
}

// Initialize countdown
let countdownInterval;
document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOM fully loaded, initializing countdown');
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
});

// Scroll Animations
function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Back to Top Button
function handleBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event Listeners
window.addEventListener('scroll', () => {
    handleScrollAnimations();
    handleBackToTop();
});

window.addEventListener('load', () => {
    handleScrollAnimations();
    handleBackToTop();
});

document.getElementById('backToTop').addEventListener('click', scrollToTop);

// Newsletter form handling
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');
const newsletterMessage = document.getElementById('newsletterMessage');

// Configuration - Set this to false to use form submission instead of EmailJS
const useEmailJS = true;

function showMessage(message, isError = false) {
    newsletterMessage.textContent = message;
    newsletterMessage.className = 'newsletter-message ' + (isError ? 'error' : 'success');
    newsletterMessage.style.display = 'block';
    setTimeout(() => {
        newsletterMessage.style.display = 'none';
    }, 5000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Function to send email notification using EmailJS
async function sendEmailNotification(subscriberEmail) {
    try {
        // EmailJS configuration
        const serviceID = 'service_4nvx2kh';
        const templateID = 'template_3ci9hir';
        const userID = 'e9Hogjne03-qtzkK7';
        
        // Create template parameters according to EmailJS documentation
        // Make sure these parameter names match EXACTLY with the variables in your EmailJS template
        const templateParams = {
            // These are the most common parameter names in EmailJS templates
            to_email: 'weuze.diallo1990@gmail.com',
            to_name: 'DjeriImmo Admin',
            from_name: 'DjeriImmo Newsletter',
            from_email: 'newsletter@djeriimmo.com',
            reply_to: subscriberEmail,
            message: `New subscriber: ${subscriberEmail}`,
            subscriber_email: subscriberEmail,
            
            // Add these common parameter names as well to ensure compatibility
            email: subscriberEmail,
            name: 'Newsletter Subscriber',
            subject: 'New Newsletter Subscription'
        };
        
        // console.log('Sending email with parameters:', templateParams);
        
        // Send email using EmailJS with proper parameters
        const response = await emailjs.send(serviceID, templateID, templateParams, userID);
        
        // console.log('Email sent successfully:', response);
        return true;
    } catch (error) {
        // console.error('Error sending email notification:', error);
        return false;
    }
}

// Function to handle form submission to backend
async function submitFormToBackend(email) {
    try {
        const formData = new FormData();
        formData.append('email', email);
        
        const response = await fetch(newsletterForm.action, {
            method: newsletterForm.method,
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'inscription');
        }
        
        const result = await response.json();
        return true;
    } catch (error) {
        // console.error('Error submitting form:', error);
        return false;
    }
}

newsletterForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!validateEmail(email)) {
        showMessage('Veuillez entrer une adresse e-mail valide.', true);
        return;
    }

    // Add loading state
    newsletterForm.classList.add('loading');
    
    try {
        // Store email in localStorage for demo purposes
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            
            let success = false;
            
            // Choose method based on configuration
            if (useEmailJS) {
                // Use EmailJS service
                success = await sendEmailNotification(email);
                // console.log(`Notification sent to weuze.diallo1990@gmail.com about new subscriber: ${email}`);
            } else {
                // Use form submission to backend
                success = await submitFormToBackend(email);
                // console.log(`Form submitted to backend for subscriber: ${email}`);
            }
            
            if (success) {
                // Show success message
                showMessage('Merci de votre inscription ! Vous recevrez bientôt de nos nouvelles.');
                emailInput.value = '';
                
                // For demo purposes, also log to console
                // console.log(`New subscriber: ${email}`);
            } else {
                throw new Error('Failed to process subscription');
            }
        } else {
            showMessage('Vous êtes déjà inscrit à notre newsletter.', true);
        }
    } catch (error) {
        // console.error('Error:', error);
        showMessage('Une erreur est survenue. Veuillez réessayer plus tard.', true);
    } finally {
        newsletterForm.classList.remove('loading');
    }
});

// Progress Bar
function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector(".progress-bar-fill").style.width = scrolled + "%";
}

window.addEventListener('scroll', updateProgressBar); 