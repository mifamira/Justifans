import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
      messageDiv.style.display = "block";  // Tampilkan elemen
      messageDiv.innerHTML = message;  // Isi pesan
      messageDiv.style.opacity = 1;  // Tampilkan pesan dengan transisi
      setTimeout(() => {
          messageDiv.style.opacity = 0;  // Sembunyikan pesan setelah 5 detik
      }, 5000);
  } else {
      console.error(`Error: Element with ID '${divId}' not found.`);
  }
}

// Google Sign-In functionality
const googleSignInButton = document.getElementById('google-signin-btn');
googleSignInButton.addEventListener('click', (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const userData = {
                email: user.email,
                name: user.displayName,
            };
            showMessage('Login Successful with Google', 'loginMessage');
            
            // Save user data to Firestore (optional)
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    // Redirect to home page after successful login
                    window.location.href = 'home.html';
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
      
          switch (errorCode) {
              case 'auth/popup-closed-by-user':
                  showMessage('Error: Sign-in popup closed before completing. Please try again.', 'loginMessage');
                  break;
              case 'auth/cancelled-popup-request':
                  showMessage('Error: Multiple sign-in attempts detected. Please try again.', 'loginMessage');
                  break;
              case 'auth/operation-not-allowed':
                  showMessage('Error: Google Sign-In is not enabled. Please contact support.', 'loginMessage');
                  break;
              default:
                  showMessage(`Error: ${errorMessage}`, 'loginMessage');
          }
      });
      
});

// Login functionality
const signInButton = document.getElementById('email-login-btn');
signInButton.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('Please fill in all fields.', 'signInMessage');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showMessage('Login Successful', 'signInMessage');
            window.location.href = 'home.html';
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
      
          switch (errorCode) {
              case 'auth/user-not-found':
                  showMessage('Error: User not found. Please register first.', 'signInMessage');
                  break;
              case 'auth/wrong-password':
                  showMessage('Error: Incorrect password. Please try again.', 'signInMessage');
                  break;
              case 'auth/invalid-email':
                  showMessage('Error: Invalid email format. Please check your email.', 'signInMessage');
                  break;
              case 'auth/too-many-requests':
                  showMessage('Error: Too many failed attempts. Please try again later.', 'signInMessage');
                  break;
              default:
                  showMessage(`Error: ${errorMessage}`, 'signInMessage');
          }
      });
      
});
