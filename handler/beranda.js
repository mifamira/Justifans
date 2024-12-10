import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Inisialisasi Firebase
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

// Fungsi untuk mengambil nama pengguna dari Firestore
async function fetchUserName(uid) {
    try {
        const userRef = doc(db, 'users', uid); // Menargetkan koleksi 'users' dan dokumen berdasarkan UID
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data().name; // Mengambil nama pengguna
        } else {
            console.error('User document not found.');
            return 'Guest'; // Default jika dokumen tidak ditemukan
        }
    } catch (error) {
        console.error('Error fetching user name:', error);
        return 'Guest'; // Default jika terjadi kesalahan
    }
}

// Mengamati perubahan status autentikasi pengguna
onAuthStateChanged(auth, async (user) => {
    const userNameElement = document.getElementById('user-name'); // Akses elemen dengan ID 'user-name'

    if (user) {
        // Jika pengguna login, ambil nama dari Firestore dan perbarui tampilan
        const userName = await fetchUserName(user.uid);
        userNameElement.innerText = userName; // Menampilkan nama pengguna
    } else {
        // Jika pengguna belum login, tampilkan 'Guest'
        userNameElement.innerText = 'Guest';
    }
});
