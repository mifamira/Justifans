// Import Firebase modules secara modular
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, limit } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Mendapatkan instansi Firestore

// Ambil referensi koleksi produk (koleksi 'products')
const productCollection = collection(db, "products");

// Fungsi untuk menampilkan produk berdasarkan kategori dan ID tertinggi
async function loadNewProduct() {
    try {
        const productGrid = document.getElementById('product-grid');  // Tempat untuk menampilkan produk
        productGrid.innerHTML = '';  // Kosongkan grid sebelum menampilkan produk

        // Membuat query untuk mengambil produk, urutkan berdasarkan ID dan batasi per kategori
        const categoriesQuerySnapshot = await getDocs(collection(db, "products"));

        // Menyimpan produk per kategori
        const categoryMap = new Map();

        categoriesQuerySnapshot.forEach((doc) => {
            const product = doc.data();
            const category = product.kategori_produk;  // Ambil kategori produk

            if (!categoryMap.has(category) || product.id > categoryMap.get(category).id) {
                // Menyimpan produk dengan ID tertinggi per kategori
                categoryMap.set(category, product);
            }
        });

        // Menampilkan produk berdasarkan kategori dan ID tertinggi
        categoryMap.forEach((product) => {
            const productElement = document.createElement('div');
            productElement.classList.add('bg-gray-50', 'p-4', 'rounded-lg', 'shadow-md');
            productElement.innerHTML = `
                <img src="${product.gambar_produk}" alt="${product.product_name}" class="mx-auto mb-2">
                <h3 class="text-lg font-bold text-black mb-2 line-clamp-1">${product.product_name}</h3>
                <h3 class="text-lg font-bold text-purple-600 mb-2 line-clamp-1"> Rp${product.harga.toLocaleString()}</h3>
                <p class="text-green-600 text-sm font-bold">by: ${product.nama_jastip}</p>
            `;
            productGrid.appendChild(productElement);  // Menambahkan produk ke dalam grid
        });
    } catch (error) {
        console.error("Terjadi kesalahan:", error);  // Menangani error jika ada masalah
    }
}

// Panggil fungsi untuk menampilkan produk saat halaman dimuat
loadNewProduct();
