// Buddy Ride System
let buddyRides = [];
const STORAGE_KEY = 'buddy_rides';
const RATE_PER_KM = 10;

// Load rides from localStorage on startup
function loadBuddyRides() {
    const storedRides = localStorage.getItem(STORAGE_KEY);
    if (storedRides) {
        const parsedRides = JSON.parse(storedRides);
        // Only use stored rides if there are any
        if (parsedRides && parsedRides.length > 0) {
            buddyRides = parsedRides;
        } else {
            // Add placeholder data if no rides exist
            buddyRides = [
                {
                    id: 1,
                    pickup: "UPES Dehradun",
                    dropoff: "Ghantaghar",
                    date: "2024-05-04",
                    time: "15:00",
                    rideType: "auto",
                    estimatedFare: 180,
                    status: "open",
                    creator: "Rahul",
                    ridersJoined: 1,
                    maxRiders: 2,
                    femaleOnly: false
                },
                {
                    id: 2,
                    pickup: "UPES Dehradun",
                    dropoff: "Ghantaghar",
                    date: "2024-05-04",
                    time: "16:30",
                    rideType: "mini",
                    estimatedFare: 220,
                    status: "open",
                    creator: "Priya",
                    ridersJoined: 2,
                    maxRiders: 3,
                    femaleOnly: false
                },
                {
                    id: 3,
                    pickup: "UPES Dehradun",
                    dropoff: "Ghantaghar",
                    date: "2024-05-04",
                    time: "15:30",
                    rideType: "sedan",
                    estimatedFare: 280,
                    status: "open",
                    creator: "Aisha",
                    ridersJoined: 1,
                    maxRiders: 3,
                    femaleOnly: true
                }
            ];
            saveBuddyRides();
        }
    } else {
        // Add placeholder data if no local storage exists
        buddyRides = [
            {
                id: 1,
                pickup: "UPES Dehradun",
                dropoff: "Ghantaghar",
                date: "2024-05-04",
                time: "15:00",
                rideType: "auto",
                estimatedFare: 180,
                status: "open",
                creator: "Rahul",
                ridersJoined: 1,
                maxRiders: 2,
                femaleOnly: false
            },
            {
                id: 2,
                pickup: "UPES Dehradun",
                dropoff: "Ghantaghar",
                date: "2024-05-04",
                time: "16:30",
                rideType: "mini",
                estimatedFare: 220,
                status: "open",
                creator: "Priya",
                ridersJoined: 2,
                maxRiders: 3,
                femaleOnly: false
            },
            {
                id: 3,
                pickup: "UPES Dehradun",
                dropoff: "Ghantaghar",
                date: "2024-05-04",
                time: "15:30",
                rideType: "sedan",
                estimatedFare: 280,
                status: "open",
                creator: "Aisha",
                ridersJoined: 1,
                maxRiders: 3,
                femaleOnly: true
            }
        ];
        saveBuddyRides();
    }
    
    // Clear existing localStorage to show placeholder cards
    localStorage.removeItem(STORAGE_KEY);
    
    updateBuddyRidesList();
    updateStatistics();
}

// Save rides to localStorage
function saveBuddyRides() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buddyRides));
}

const rideTypes = {
    'auto': { name: 'AutoEase', rate: 10, icon: 'fa-taxi', color: 'yellow', femaleOnly: false },
    'mini': { name: 'RideEase Mini', rate: 15, icon: 'fa-car', color: 'blue', femaleOnly: false },
    'sedan': { name: 'RideEase Sedan', rate: 22, icon: 'fa-car-side', color: 'purple', femaleOnly: false },
    'moto': { name: 'RideEase Moto', rate: 8, icon: 'fa-motorcycle', color: 'green', femaleOnly: false },
    'auto-f': { name: 'AutoEase Pink', rate: 10, icon: 'fa-taxi', color: 'pink', femaleOnly: true },
    'mini-f': { name: 'RideEase Mini Pink', rate: 15, icon: 'fa-car', color: 'pink', femaleOnly: true },
    'sedan-f': { name: 'RideEase Sedan Pink', rate: 22, icon: 'fa-car-side', color: 'pink', femaleOnly: true }
};

function showBuddyRideInfo() {
    alert('Share your ride with others going in the same direction and split the fare!');
}

function validateForm() {
    const pickup = document.getElementById('buddy-pickup').value.trim();
    const dropoff = document.getElementById('buddy-dropoff').value.trim();
    const date = document.getElementById('buddy-date').value;
    const time = document.getElementById('buddy-time').value;
    const rideType = document.getElementById('buddy-ride-type').value;

    if (!pickup || !dropoff || !date || !time || !rideType) {
        alert('Please fill in all required fields');
        return false;
    }

    // Validate date is not in the past
    const selectedDateTime = new Date(date + ' ' + time);
    const now = new Date();
    if (selectedDateTime < now) {
        alert('Please select a future date and time');
        return false;
    }

    return true;
}

function openBuddyRideModal() {
    document.getElementById('buddy-ride-modal').classList.remove('hidden');
    
    // Pre-fill locations if available
    const pickupLocation = document.getElementById('pickup-location');
    const dropoffLocation = document.getElementById('dropoff-location');
    if (pickupLocation && dropoffLocation) {
        document.getElementById('buddy-pickup').value = pickupLocation.value;
        document.getElementById('buddy-dropoff').value = dropoffLocation.value;
    }
    
    // Pre-fill date and time with current date/time + 1 hour by default
    const now = new Date();
    now.setHours(now.getHours() + 1);
    document.getElementById('buddy-date').value = now.toISOString().split('T')[0];
    document.getElementById('buddy-time').value = now.toTimeString().slice(0, 5);
    
    // Populate ride types with female-only options
    const rideTypeSelect = document.getElementById('buddy-ride-type');
    rideTypeSelect.innerHTML = `
        <option value="">Select a ride type</option>
        <optgroup label="Standard Rides">
            ${Object.entries(rideTypes)
                .filter(([key, type]) => !type.femaleOnly)
                .map(([key, type]) => `
                    <option value="${key}">${type.name} (₹${type.rate}/km)</option>
                `).join('')}
        </optgroup>
        <optgroup label="Female Only Rides">
            ${Object.entries(rideTypes)
                .filter(([key, type]) => type.femaleOnly)
                .map(([key, type]) => `
                    <option value="${key}">${type.name} (₹${type.rate}/km) </option>
                `).join('')}
        </optgroup>
    `;

    // Add change listener for fare calculation
    rideTypeSelect.addEventListener('change', updateEstimatedFare);
}

function closeBuddyRideModal() {
    document.getElementById('buddy-ride-modal').classList.add('hidden');
}

function updateEstimatedFare() {
    const rideType = document.getElementById('buddy-ride-type').value;
    if (!rideType) return;

    const rate = rideTypes[rideType].rate;
    const distance = window.currentDistance || 10; // Default to 10km if distance not calculated

    document.getElementById('per-km-rate').textContent = `₹${rate}/km`;
    document.getElementById('estimated-distance').textContent = `${distance.toFixed(1)} km`;
    document.getElementById('estimated-fare').textContent = `₹${Math.round(distance * rate)}`;
}

function createBuddyRide(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const pickup = document.getElementById('buddy-pickup').value.trim();
    const dropoff = document.getElementById('buddy-dropoff').value.trim();
    const date = document.getElementById('buddy-date').value;
    const time = document.getElementById('buddy-time').value;
    const rideType = document.getElementById('buddy-ride-type').value;
    
    const distance = window.currentDistance || 10;
    const estimatedFare = Math.round(distance * rideTypes[rideType].rate);
    
    const buddyRide = {
        id: Date.now(),
        pickup,
        dropoff,
        date,
        time,
        rideType,
        estimatedFare,
        status: 'open',
        creator: 'You',
        ridersJoined: 0,
        maxRiders: 2,
        femaleOnly: rideTypes[rideType].femaleOnly
    };
    
    buddyRides.push(buddyRide);
    saveBuddyRides();
    closeBuddyRideModal();
    showBuddyRideSuccess(buddyRide);
    updateBuddyRidesList();
    updateStatistics();
}

function showBuddyRideSuccess(ride) {
    const modal = document.getElementById('buddy-ride-success');
    const summary = document.getElementById('ride-summary');
    
    summary.innerHTML = `
        <div class="text-sm space-y-2">
            <div class="flex justify-between">
                <span class="text-gray-600">From:</span>
                <span class="font-medium">${ride.pickup}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">To:</span>
                <span class="font-medium">${ride.dropoff}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Date & Time:</span>
                <span class="font-medium">${new Date(ride.date + ' ' + ride.time).toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Ride Type:</span>
                <span class="font-medium">${rideTypes[ride.rideType].name}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Estimated Fare:</span>
                <span class="font-medium">₹${ride.estimatedFare}</span>
            </div>
            <div class="text-xs text-blue-600 mt-2">
                <i class="fas fa-info-circle mr-1"></i>
                Your fare will be ₹${Math.round(ride.estimatedFare / 2)} when someone joins!
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeBuddyRideSuccess() {
    document.getElementById('buddy-ride-success').classList.add('hidden');
}

function updateBuddyRidesList() {
    const listContainer = document.getElementById('buddy-rides-list');
    if (!listContainer) return;

    // If no rides, show a message
    if (buddyRides.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <i class="fas fa-car-side text-4xl mb-2"></i>
                <p>No buddy rides available. Be the first to post one!</p>
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${buddyRides.map(ride => {
                const splitFare = Math.round(ride.estimatedFare / (ride.ridersJoined + 1));
                const rideInfo = rideTypes[ride.rideType];
                const rideDate = new Date(ride.date + ' ' + ride.time);
                const formattedDate = rideDate.toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });

                return `
                    <div class="buddy-ride-card glass-effect rounded-xl p-6 space-y-4 border-2 border-transparent hover:border-blue-100 transition-all">
                        <div class="flex justify-between items-start">
                            <div class="flex items-start space-x-3">
                                <div class="w-12 h-12 rounded-lg ${rideInfo.color}-100 flex items-center justify-center">
                                    <i class="fas ${rideInfo.icon} text-xl ${rideInfo.color}-500"></i>
                                </div>
                                <div>
                                    <div class="font-semibold text-lg">${rideInfo.name}</div>
                                    <div class="text-sm text-gray-500">${formattedDate}</div>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    ${ride.ridersJoined}/${ride.maxRiders} joined
                                </span>
                                ${ride.femaleOnly ? `
                                    <span class="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                                        👩 Female Only
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="space-y-2">
                            <div class="flex items-center space-x-2 text-gray-600">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${ride.pickup}</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-0.5 h-6 bg-gray-200 ml-2"></div>
                            </div>
                            <div class="flex items-center space-x-2 text-gray-600">
                                <i class="fas fa-map-marker"></i>
                                <span>${ride.dropoff}</span>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-3 space-y-1">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Original fare:</span>
                                <span class="font-medium">₹${ride.estimatedFare}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Split fare (${ride.ridersJoined + 1} users):</span>
                                <span class="font-medium text-green-600">₹${splitFare}</span>
                            </div>
                        </div>

                        ${ride.creator !== 'You' ? `
                            <button onclick="joinBuddyRide(${ride.id})" 
                                    class="w-full bg-black text-white font-medium rounded-xl px-4 py-3 hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 ${ride.femaleOnly ? 'female-only-btn' : ''}">
                                <i class="fas fa-user-plus"></i>
                                <span>${ride.femaleOnly ? 'Join Female-Only Ride 👩' : 'Join Ride'}</span>
                            </button>
                        ` : `
                            <div class="text-sm ${ride.femaleOnly ? 'text-pink-600' : 'text-blue-600'} text-center">
                                <i class="fas fa-info-circle mr-1"></i>
                                ${ride.status === 'full' ? 'Ride is full' : 'Waiting for buddy to join...'}
                            </div>
                        `}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function closeRideConfirmationModal() {
    document.getElementById('ride-confirmation-modal').classList.add('hidden');
}

function showRideConfirmationModal(ride) {
    const modal = document.getElementById('ride-confirmation-modal');
    const details = document.getElementById('confirmation-details');
    const rideDate = new Date(ride.date + ' ' + ride.time);
    const formattedDate = rideDate.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
    const formattedTime = rideDate.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    const splitFare = Math.round(ride.estimatedFare / 2);
    
    details.innerHTML = `
        <p class="text-gray-600">Your ride has been booked from ${ride.pickup} to ${ride.dropoff}</p>
        <div class="space-y-2 mt-3">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Date & Time:</span>
                <span class="font-medium">${formattedDate} at ${formattedTime}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Ride Type:</span>
                <span class="font-medium">${rideTypes[ride.rideType].name}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Original Fare:</span>
                <span class="font-medium">₹${ride.estimatedFare}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Your Fare (Split):</span>
                <span class="font-medium text-green-600">₹${splitFare}</span>
            </div>
            <div class="mt-4 text-center text-sm text-gray-600">
                Have a safe ride with RideEase! 🚗
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function joinBuddyRide(rideId) {
    const ride = buddyRides.find(r => r.id === rideId);
    if (!ride) return;
    
    if (ride.ridersJoined >= ride.maxRiders) {
        alert('This ride is already full!');
        return;
    }

    if (ride.femaleOnly) {
        const isFemaleMember = confirm('This is a Female-Only ride. Please confirm that you are a female passenger.');
        if (!isFemaleMember) {
            alert('Sorry, this ride is only available for female passengers.');
            return;
        }
    }
    
    ride.ridersJoined++;
    if (ride.ridersJoined === ride.maxRiders) {
        ride.status = 'full';
    }
    
    saveBuddyRides();
    updateBuddyRidesList();
    updateStatistics();
    showRideConfirmationModal(ride);
}

function updateStatistics() {
    const totalRides = document.getElementById('total-rides');
    const totalJoined = document.getElementById('total-joined');
    const totalSaved = document.getElementById('total-saved');
    
    if (totalRides) totalRides.textContent = buddyRides.length;
    if (totalJoined) totalJoined.textContent = buddyRides.filter(r => r.ridersJoined > 0).length;
    if (totalSaved) {
        const savings = buddyRides.reduce((acc, r) => {
            return acc + (r.ridersJoined > 0 ? Math.round(r.estimatedFare / 2) : 0);
        }, 0);
        totalSaved.textContent = `₹${savings}`;
    }
}

// Update the initialization to ensure form is properly connected
document.addEventListener('DOMContentLoaded', function() {
    loadBuddyRides();
    
    // Connect form submission handler
    const form = document.getElementById('buddy-ride-form');
    if (form) {
        form.addEventListener('submit', createBuddyRide);
    }
    
    // Add debug log to verify initialization
    console.log('Buddy ride system initialized');
    console.log('Current rides:', buddyRides);
});