import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQ3FFWzz-lBkEajePwUl5LxgpAOGqlXZA",
    authDomain: "capstone-442413.firebaseapp.com",
    projectId: "capstone-442413",
    storageBucket: "capstone-442413.firebasestorage.app",
    messagingSenderId: "1040333147919",
    appId: "1:1040333147919:web:63f19a9dd72b315bebb87a",
    measurementId: "G-S3Q03WCGNW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

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
        console.error(`Error: Element with ID '${divId}' not found.`);
    }
}

const googleSignInButton = document.getElementById('google-signin-btn');
googleSignInButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const docRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(docRef);

        if (!userSnapshot.exists()) {
            showMessage("Akun Anda belum terdaftar. Silakan daftar terlebih dahulu.", "loginMessage");
            await auth.signOut();
            return;
        }

        const userData = userSnapshot.data();
        localStorage.setItem("userData", JSON.stringify(userData));

        window.location.href = 'beranda.html';
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        showMessage(`Error: ${error.message}`, 'loginMessage');
    }
});

const signInButton = document.getElementById('email-login-btn');
signInButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('Please fill in all fields.', 'signInMessage');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(docRef);

        if (!userSnapshot.exists()) {
            showMessage("Akun tidak ditemukan. Silakan daftar terlebih dahulu.", "signInMessage");
            await auth.signOut();
            return;
        }

        const userData = userSnapshot.data();
        localStorage.setItem("userData", JSON.stringify(userData));

        window.location.href = 'beranda.html';
    } catch (error) {
        console.error("Login Error:", error);
        showMessage(`Error: ${error.message}`, 'signInMessage');
    }
});
