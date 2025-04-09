// Définir la date cible du compte à rebours (3 mois à partir d'aujourd'hui)
const launchDate = new Date();
launchDate.setMonth(launchDate.getMonth() + 3);

// Mise à jour du compte à rebours
function updateCountdown() {
    const currentDate = new Date();
    const difference = launchDate - currentDate;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
    document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');
}

// Mettre à jour le compte à rebours toutes les secondes
setInterval(updateCountdown, 1000);

// Initialiser le compte à rebours
updateCountdown();

// Newsletter form handling
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');
const newsletterMessage = document.getElementById('newsletterMessage');

function showMessage(message, isError = false) {
    newsletterMessage.textContent = message;
    newsletterMessage.className = 'newsletter-message ' + (isError ? 'error' : 'success');
    setTimeout(() => {
        newsletterMessage.style.display = 'none';
    }, 5000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
        // Simulate API call - Replace this with your actual API endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store email in localStorage for demo purposes
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        }
        
        showMessage('Merci de votre inscription ! Vous recevrez bientôt de nos nouvelles.');
        emailInput.value = '';
    } catch (error) {
        showMessage('Une erreur est survenue. Veuillez réessayer plus tard.', true);
    } finally {
        newsletterForm.classList.remove('loading');
    }
}); 