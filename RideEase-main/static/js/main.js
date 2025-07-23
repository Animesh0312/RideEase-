document.addEventListener('DOMContentLoaded', () => {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('type') === 'submit') {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    });

    // Enhanced input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-active');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-active');
        });
    });

    // Location autocomplete simulation
    const locationInputs = document.querySelectorAll('#pickup, #dropoff');
    locationInputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            if (this.value.length > 2) {
                simulateLocationSearch(this);
            }
        }, 300));
    });

    // Animated scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Ripple effect on buttons
    const rippleButtons = document.querySelectorAll('.button-effect');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple-effect');

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1000);
        });
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function simulateLocationSearch(input) {
    const locations = [
        'Airport Terminal 1',
        'Central Station',
        'Downtown Mall',
        'Business District',
        'University Campus'
    ];
    
    const wrapper = document.createElement('div');
    wrapper.classList.add('location-suggestions', 'absolute', 'w-full', 'bg-white', 'rounded-xl', 'shadow-lg', 'mt-2', 'z-50');
    
    const filtered = locations.filter(loc => 
        loc.toLowerCase().includes(input.value.toLowerCase())
    );
    
    filtered.forEach(location => {
        const div = document.createElement('div');
        div.classList.add('p-3', 'hover:bg-gray-50', 'cursor-pointer');
        div.textContent = location;
        div.addEventListener('click', () => {
            input.value = location;
            wrapper.remove();
        });
        wrapper.appendChild(div);
    });
    
    // Remove existing suggestions
    const existing = input.parentElement.querySelector('.location-suggestions');
    if (existing) existing.remove();
    
    if (filtered.length > 0) {
        input.parentElement.appendChild(wrapper);
    }
}

// Handle ESC key to close dropdowns
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.location-suggestions').forEach(el => el.remove());
    }
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('input')) {
        document.querySelectorAll('.location-suggestions').forEach(el => el.remove());
    }
});