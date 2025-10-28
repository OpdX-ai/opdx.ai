// Countdown Timer
function updateCountdown() {
    // Set launch date to December 4th, 2025 at midnight
    const launchDate = new Date('December 4, 2025 00:00:00').getTime();
    
    // Update countdown every second
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = launchDate - now;

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display results
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            document.querySelector('.launch-text').textContent = 'We\'re Live!';
        }
    }, 1000);
}

// Email notification form handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const formMessage = document.getElementById('formMessage');
    const email = emailInput.value;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.className = 'form-message error';
        return;
    }

    // Store email in localStorage (in production, this should send to a backend)
    try {
        let emails = JSON.parse(localStorage.getItem('notifyEmails') || '[]');
        
        if (emails.includes(email)) {
            formMessage.textContent = 'You\'re already on the list!';
            formMessage.className = 'form-message success';
        } else {
            emails.push(email);
            localStorage.setItem('notifyEmails', JSON.stringify(emails));
            formMessage.textContent = '🎉 Success! We\'ll notify you at launch.';
            formMessage.className = 'form-message success';
            emailInput.value = '';
        }
    } catch (error) {
        formMessage.textContent = 'Something went wrong. Please try again.';
        formMessage.className = 'form-message error';
    }

    // Clear message after 5 seconds
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCountdown();
    
    const notifyForm = document.getElementById('notifyForm');
    notifyForm.addEventListener('submit', handleFormSubmit);
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

