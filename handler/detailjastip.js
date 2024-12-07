// Toggle mobile menu
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
});

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, doc, getDoc} from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

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

// Ambil referensi koleksi produk (koleksi 'detail-jastip')
const productCollection = collection(db, "detail-jastip");

export { productCollection, db };

document.addEventListener("DOMContentLoaded", () => {
    // Mendapatkan parameter URL dengan nama 'id'
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        const productRef = doc(db, "detail-jastip", productId.toString()); // Pastikan ID dokumen sebagai string
            // Ambil data produk dari Firestore
    getDoc(productRef)
    .then((docSnap) => {
        if (docSnap.exists()) {
            const product = docSnap.data(); // Data produk

            // Update elemen HTML dengan data produk
            document.getElementById("productName").innerText = product.product_name || "Nama produk tidak tersedia";
            document.getElementById("productPrice").innerText = `Rp ${product.harga ? product.harga.toLocaleString("id-ID") : "0"}`;
            document.getElementById("seller").innerText = product.nama_jastip || "Penjual tidak tersedia";
            document.getElementById("category").innerText = product.kategori_produk || "Kategori tidak tersedia";
            document.getElementById("startOrder").innerText = product.startOrder
                ? new Date(product.startOrder).toLocaleDateString("id-ID")
                : "-";
            document.getElementById("closeOrder").innerText = product.closeOrder
                ? new Date(product.closeOrder).toLocaleDateString("id-ID")
                : "-";
            document.getElementById("preOrderDays").innerText = product.preOrderDays || "0 hari";
            document.getElementById("warehouse").innerText = product.warehouse || "Gudang tidak tersedia";
            document.getElementById("productImage").src = product.gambar_produk || "placeholder.jpg";

            // Tambahkan event listener untuk tombol pesan
            const orderButton = document.getElementById("orderButton");
            orderButton.addEventListener("click", () => {
                // Redirect ke halaman detailpesanan.html dengan query parameter
                window.location.href = `detailpesanan.html?id=${product.id_produk}`;
            });
        } else {
            console.error("Produk tidak ditemukan di Firestore.");
            alert("Produk tidak ditemukan.");
        }
    })
    .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data:", error);
        alert("Terjadi kesalahan saat mengambil data produk.");
            });
    } else {
        console.error("ID produk tidak ditemukan di URL.");
        alert("ID produk tidak ditemukan.");
    }
});
