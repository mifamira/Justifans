// register.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQ3FFWzz-lBkEajePwUl5LxgpAOGqlXZA",
    authDomain: "capstone-442413.firebaseapp.com",
    projectId: "capstone-442413",
    storageBucket: "capstone-442413.firebasestorage.app",
    messagingSenderId: "1040333147919",
    appId: "1:1040333147919:web:63f19a9dd72b315bebb87a",
    measurementId: "G-S3Q03WCGNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Function to show message
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.innerHTML = message;
        messageDiv.style.opacity = 1;
        setTimeout(() => {
            messageDiv.style.opacity = 0;
        }, 5000);
    } else {
        console.error(`Element with ID ${divId} not found`);
    }
}

// Google Sign-In functionality
const googleSignInButton = document.getElementById('google-signin-btn');
googleSignInButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user already exists in Firestore
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            // Save user data to Firestore if it doesn't exist
            const userData = {
                email: user.email,
                name: user.displayName,
            };
            await setDoc(userDoc, userData);
            showMessage('Account Created Successfully with Google', 'signUpMessage');
        } else {
            showMessage('Welcome Back!', 'signUpMessage');
        }

        // Redirect to home page
        window.location.href = 'home.html';
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        showMessage('Google Sign-In Failed: ' + error.message, 'signUpMessage');
    }
});

// Sign-up functionality (for email/password)
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const name = document.getElementById('fName').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        const userData = {
            email: email,
            name: name,
        };
        const userDoc = doc(db, "users", user.uid);
        await setDoc(userDoc, userData);

        showMessage('Account Created Successfully', 'signUpMessage');
        window.location.href = 'home.html';
    } catch (error) {
        console.error("Sign-Up Error:", error);
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        } else {
            showMessage('Unable to create User: ' + error.message, 'signUpMessage');
        }
    }
});
