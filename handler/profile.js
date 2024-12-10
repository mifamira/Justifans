import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Firebase config
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

// Selectors
const userNameElement = document.getElementById('user-name');
const userEmailElement = document.getElementById('user-email');
const userPhoneElement = document.getElementById('user-phone');
const userAddressElement = document.getElementById('user-address');
const updateForm = document.getElementById('update-profile-form');
const logoutBtn = document.getElementById('logout-btn');

// Fetch user profile
async function fetchUserProfile(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            userNameElement.innerText = data.name || "No Name";
            userEmailElement.innerText = data.email || "No Email";
            userPhoneElement.innerText = data.phone || "No Phone";
            userAddressElement.innerText = data.address || "No Address";
        } else {
            console.error('User document not found!');
        }
    } catch (error) {
        console.error("Error fetching user profile: ", error);
    }
}

// Update profile
async function updateUserProfile(uid, name, phone, address) {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            name,
            phone,
            address
        });
        alert('Profile updated successfully!');
        fetchUserProfile(uid); // Refresh profile
    } catch (error) {
        console.error("Error updating profile: ", error);
    }
}

// Form submission handler
updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    const errorName = document.getElementById('error-name');
    const errorPhone = document.getElementById('error-phone');
    const errorAddress = document.getElementById('error-address');

    errorName.classList.add('hidden');
    errorPhone.classList.add('hidden');
    errorAddress.classList.add('hidden');

    let hasError = false;

    if (!name) {
        errorName.textContent = "Name is required.";
        errorName.classList.remove('hidden');
        hasError = true;
    }

    if (!phone) {
        errorPhone.textContent = "Phone is required.";
        errorPhone.classList.remove('hidden');
        hasError = true;
    }

    if (!address) {
        errorAddress.textContent = "Address is required.";
        errorAddress.classList.remove('hidden');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const user = auth.currentUser;
    if (user) {
        await updateUserProfile(user.uid, name, phone, address);
    } else {
        alert("No user is logged in.");
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Error during logout: ", error);
    }
});

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserProfile(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});
