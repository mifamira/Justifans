// Toggle mobile menu

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

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

                    loadRecommendations(productId); // Memuat rekomendasi produk setelah data produk dimuat
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

// Fungsi untuk memuat rekomendasi produk
async function loadRecommendations(productId) {
    try {
        // Ambil data produk dari Firestore untuk mendapatkan nama_produk
        const productRef = doc(db, "detail-jastip", productId.toString());
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            const product = productSnap.data();
            const productName = product.product_name; // Ambil nama produk

            // Kirim nama produk ke API untuk mendapatkan rekomendasi
            const recommendations = await getRecommendations(productName);

            console.log('Rekomendasi Produk:', recommendations); // Debugging: Cek rekomendasi yang diterima

            if (recommendations && recommendations.length > 0) {
                // Ambil data produk lengkap untuk setiap rekomendasi
                await Promise.all(
                    recommendations.map(async (recommendation) => {
                        const productRef = doc(db, "detail-jastip", recommendation.id);
                        const docSnap = await getDoc(productRef);

                        if (docSnap.exists()) {
                            const productData = docSnap.data();
                            // Hanya tambahkan data jika belum ada
                            recommendation.name = recommendation.name || productData.product_name;
                            recommendation.price = recommendation.price || productData.harga;
                            recommendation.image = recommendation.image || productData.gambar_produk;
                        } else {
                            console.error(`Produk dengan ID ${recommendation.id} tidak ditemukan.`);
                        }
                    })
                );
            }

            // Kirim rekomendasi ke fungsi displayRecommendations
            displayRecommendations(recommendations);            
        } else {
            console.error("Produk tidak ditemukan di Firestore.");
            alert("Produk tidak ditemukan.");
        }
    } catch (error) {
        console.error("Gagal memuat rekomendasi:", error);
        alert("Gagal memuat rekomendasi produk.");
    }
}

// Fungsi untuk mendapatkan rekomendasi berdasarkan nama produk
async function getRecommendations(productName) {
    const apiUrl = 'https://capstone-dot-capstone-442413.et.r.appspot.com/recommend';  // Endpoint API

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: productName })  // Properti 'query'
    });

    if (!response.ok) {
        console.error("Error fetching recommendations:", response.statusText);
        return [];
    }

    const data = await response.json(); // Baca body respons sekali saja
    console.log('API Response:', data); // Log respons untuk debugging
    return data; // Kembalikan data tanpa membaca ulang
}

// Fungsi untuk menampilkan rekomendasi produk di halaman
function displayRecommendations(recommendations) {
    const recommendationGrid = document.getElementById("recommendationGrid");
    recommendationGrid.innerHTML = ""; // Kosongkan grid rekomendasi jika sudah ada

    // Cek apakah data rekomendasi valid
    if (Array.isArray(recommendations) && recommendations.length > 0) {
        recommendations.forEach(item => {
            // Pastikan setiap item memiliki properti yang diperlukan
            const image = item.image || 'placeholder.jpg'; // Gambar default jika tidak ada
            const name = item.name || 'Nama Tidak Tersedia';
            const price = item.price ? item.price.toLocaleString("id-ID") : 'Harga Tidak Tersedia';

            // Buat elemen untuk setiap rekomendasi
            const recommendationElement = document.createElement("div");
            recommendationElement.className = "recommendation-item";

            // Isi konten rekomendasi
            recommendationElement.innerHTML = `
                <img src="${image}" alt="${name}" class="recommendation-image">
                <h3 class="recommendation-name">${name}</h3>
                <p class="recommendation-price">Rp ${price}</p>
                <button onclick="window.location.href='detailjastip.html?id=${item.id}'" class="btn-recommend">
                    Lihat Detail
                </button>
            `;

            // Tambahkan elemen ke dalam grid rekomendasi
            recommendationGrid.appendChild(recommendationElement);
        });
    } else {
        // Jika tidak ada rekomendasi, tampilkan pesan
        recommendationGrid.innerHTML = "<p>Rekomendasi tidak tersedia.</p>";
    }
}
