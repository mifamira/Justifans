import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

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
        console.error(`Element with ID ${divId} not found`);
    }
}

async function getAndUpdateUserCounter() {
    const counterDoc = doc(db, "counters", "userCounter");

    try {
        const newCounterValue = await runTransaction(db, async (transaction) => {
            const counterSnapshot = await transaction.get(counterDoc);
            let currentCounter = 0;

            if (counterSnapshot.exists()) {
                currentCounter = counterSnapshot.data().count;
            }

            const newCounter = currentCounter + 1;
            transaction.set(counterDoc, { count: newCounter });
            return newCounter;
        });

        return newCounterValue;
    } catch (error) {
        console.error("Error updating user counter:", error);
        throw error;
    }
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const name = document.getElementById('fName').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const uniqueUserId = await getAndUpdateUserCounter();

        const userData = {
            email: email,
            name: name,
            id_user: uniqueUserId,
        };
        const userDoc = doc(db, "users", user.uid);
        await setDoc(userDoc, userData);
        
        window.location.href = 'beranda.html';
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

document.addEventListener("DOMContentLoaded", () => {
    const googleSignInButton = document.getElementById('google-signin-btn');
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log("Google Sign-In button clicked!");
            googleSignInButton.addEventListener('click', async (event) => {
                event.preventDefault();
                const provider = new GoogleAuthProvider();
            
                try {
                    const result = await signInWithPopup(auth, provider);
                    const user = result.user;
            
                    const userDoc = doc(db, "users", user.uid);
                    const userSnapshot = await getDoc(userDoc);
            
                    if (!userSnapshot.exists()) {
                        const uniqueUserId = await getAndUpdateUserCounter();
            
                        const userData = {
                            email: user.email,
                            name: user.displayName,
                            id_user: uniqueUserId, 
                        };
                        await setDoc(userDoc, userData);
                    }
            
                    window.location.href = 'beranda.html';
                } catch (error) {
                    console.error("Google Sign-In Error:", error);
                    showMessage('Google Sign-In Failed: ' + error.message, 'signUpMessage');
                }
            });
            
        });
    } else {
        console.error("Google Sign-In Button not found!");
    }
});
