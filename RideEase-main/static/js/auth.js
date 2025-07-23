// Import required Firebase modules
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged 
} from 'firebase/auth';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign In function
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));

        // Show success toast and redirect
        showToast('success', 'Successfully signed in!');
        setTimeout(() => {
            window.location.href = 'landing';
        }, 1500);

        return { success: true, user };
    } catch (error) {
        console.error('Google Sign In Error:', error);
        showToast('error', error.message);
        return { success: false, error: error.message };
    }
};

// Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
        localStorage.setItem('user', JSON.stringify(userData));
    } else {
        // User is signed out
        localStorage.removeItem('user');
    }
});

// Toast notification helper
const showToast = (type, message) => {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastIcon || !toastMessage) return;

    toast.className = `fixed top-4 right-4 z-50 flex items-center p-4 text-white rounded-xl shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    
    toastIcon.className = `mr-2 fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle`;
    toastMessage.textContent = message;

    // Show toast
    toast.classList.remove('translate-x-full');
    toast.classList.add('translate-x-0');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('translate-x-0');
        toast.classList.add('translate-x-full');
    }, 3000);
};

export { auth };
