// Import yang diperlukan
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQ3FFWzz-lBkEajePwUl5LxgpAOGqlXZA",
    authDomain: "capstone-442413.firebaseapp.com",
    projectId: "capstone-442413",
    storageBucket: "capstone-442413.firebasestorage.app",
    messagingSenderId: "1040333147919",
    appId: "1:1040333147919:web:63f19a9dd72b315bebb87a",
    measurementId: "G-S3Q03WCGNW"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Fetch Posts (untuk semua post)
const fetchPosts = () => {
    const postsQuery = query(collection(db, "wtb-posted"));
    const postsContainer = document.getElementById('posts-container');
    onSnapshot(postsQuery, (snapshot) => {
        postsContainer.innerHTML = ""; // Kosongkan sebelumnya
        snapshot.forEach((doc) => {
            const post = doc.data();
            const status = post.status ? "Terjual" : "";
            const timestamp = post.time ? new Date(post.time.seconds * 1000) : null;
            const formattedDate = timestamp ? timestamp.toLocaleDateString() : "Unknown Date";
            const formattedDescription = post.deskripsi ? post.deskripsi.replace(/\n/g, "<br>") : "";

            const postCard = document.createElement("div");
            postCard.className = "border rounded-lg p-4 mb-4 shadow hover:shadow-lg transition";
            postCard.innerHTML = `
                <p class="text-gray-600 mt-2">Status: <span class="text-green-500 font-semibold">${status}</span></p>
                <img src="${post.gambar || 'https://via.placeholder.com/150'}" alt="Product Image" class="rounded-lg mb-2 w-1/4 h-auto object-cover mx-auto">
                <h3 class="font-bold text-gray-700">${post.nama_produk}</h3>
                <p class="text-gray-500 text-sm">Category: ${post.kategori_produk}</p>
                <p class="text-gray-500 text-sm">Posted by: <span class="font-semibold">${post.id_user}</span> ${formattedDate}</p>
                <p class="text-gray-600 mt-2">${formattedDescription}</p>
                <div class="flex justify-between items-center mt-4">
                    <button class="text-purple-500 hover:text-purple-700 flex items-center">
                        <span class="material-icons-outlined mr-1">🫰</span> Like
                    </button>
                    <button class="text-purple-500 hover:text-purple-700 flex items-center">
                        <span class="material-icons-outlined mr-1">💬</span> Comment
                    </button>
                </div>
            `;
            postsContainer.appendChild(postCard);
        });
    });
};

// Fetch Posts from wtb-posted based on id_user
function fetchUserPosts(userId) {
    const postsRef = collection(db, "wtb-posted");
    const userPostsQuery = query(postsRef, where("id_user", "==", userId));

    const myPostsContainer = document.getElementById('my-posts-section');
    myPostsContainer.innerHTML = ''; // Kosongkan section sebelumnya

    // Ambil data berdasarkan ID pengguna yang login
    onSnapshot(userPostsQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const postData = doc.data();
            const postElement = document.createElement('div');
            postElement.classList.add('border', 'rounded-lg', 'p-4', 'mb-4', 'shadow', 'hover:shadow-lg', 'transition');
            postElement.innerHTML = `
                <h3 class="font-bold text-gray-700">${postData.nama_produk}</h3>
                <p class="text-gray-600">${postData.deskripsi}</p>
                <span class="text-sm text-gray-500">Posted ${new Date(postData.time.seconds * 1000).toLocaleDateString()}</span>
            `;
            myPostsContainer.appendChild(postElement);
        });
    });
}

// Ambil id_user dari koleksi users berdasarkan uid pengguna yang sedang login
function fetchUserIdFromAuth(uid) {
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("uid", "==", uid));

    return new Promise((resolve, reject) => {
        onSnapshot(userQuery, (querySnapshot) => {
            if (!querySnapshot.empty) {
                // Ambil id_user dari dokumen pertama yang ditemukan
                const userDoc = querySnapshot.docs[0];
                const userId = userDoc.data().id_user;
                resolve(userId);
            } else {
                reject("User not found");
            }
        });
    });
}

// Contoh: Ambil ID pengguna yang login, misalnya dari auth Firebase
auth.onAuthStateChanged(user => { 
    if (user) { 
        // Jika pengguna terautentikasi, ambil UID pengguna
        const uid = user.uid;

        // Ambil id_user dari koleksi users
        fetchUserIdFromAuth(uid)
            .then((userId) => {
                // Setelah mendapatkan id_user, ambil postingan berdasarkan id_user
                fetchUserPosts(userId);
            })
            .catch((error) => {
                console.error("Error getting user ID: ", error);
            });
    } else {
        console.log("No user is logged in.");
    }
});


// Toggle Create Post form
function setupPostFormToggle() {
    const toggleButton = document.getElementById('toggle-post-form');
    const postForm = document.getElementById('post-form');

    if (toggleButton && postForm) {
        toggleButton.addEventListener('click', () => {
            postForm.classList.toggle('hidden');
        });
    }
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchPosts();
    setupPostFormToggle();

    // Add event listeners for navigation with direct section ID
    const swipeTabs = document.querySelectorAll('[onclick]');
    swipeTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const sectionId = tab.getAttribute('onclick').split('\'')[1]; // Directly extract sectionId
            scrollToSection(sectionId);
        });
    });
});

// Export the function
function scrollToSection(sectionId) {
    const container = document.getElementById('content-container');
    const target = document.getElementById(sectionId);

    container.scrollTo({
        left: target.offsetLeft,
        behavior: 'smooth',
    });
}

// Ensure it's available globally for HTML context
window.scrollToSection = scrollToSection;

