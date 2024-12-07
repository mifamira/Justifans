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

// Ambil referensi koleksi produk (koleksi 'detail-jastip')
const productCollection = collection(db, "detail-jastip");

export { productCollection, db };


// Fungsi untuk mencari produk berdasarkan nama
async function cariProduk(namaProduk) {
    try {
        const productGrid = document.getElementById('product-grid'); // Elemen grid produk
        const titleElement = document.getElementById('title_cari'); // Elemen judul
        productGrid.innerHTML = ''; // Kosongkan grid sebelum menampilkan hasil pencarian

        // Ambil semua produk dari koleksi untuk pencocokan manual
        const snapshot = await getDocs(productCollection);

        // Filter produk berdasarkan pencocokan nama (case-insensitive)
        const matchingProducts = [];
        snapshot.forEach((doc) => {
            const product = doc.data();
            const productNameLower = product.product_name.toLowerCase();
            const queryLower = namaProduk.toLowerCase();

            // Cek apakah nama produk mengandung query
            if (productNameLower.includes(queryLower)) {
                matchingProducts.push(product);
            }
        });

        if (matchingProducts.length === 0) {
            // Jika tidak ada produk yang cocok
            const messageElement = document.createElement('div');
            messageElement.classList.add('text-center', 'text-lg', 'text-gray-600', 'font-semibold');
            messageElement.innerText = "Merchandise tidak ditemukan.";
            productGrid.appendChild(messageElement);
        } else {
            // Jika ada produk yang cocok
            titleElement.innerText = 'Hasil Pencarian';
            matchingProducts.forEach((product) => {
                renderProduct(product); // Panggil fungsi render untuk menampilkan produk
            });
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
}

function renderProduct(product) {
    const productGrid = document.getElementById('product-grid');
    
    // Pastikan id_produk ada dan valid
    if (!product.id_produk) {
        console.error('ID produk tidak ditemukan:', product);
        return;  // Jika id_produk tidak ada, hentikan fungsi
    }

    const productId = String(product.id_produk); // Pastikan id_produk adalah string

    const productElement = document.createElement('div');
    productElement.classList.add('bg-gray-50', 'p-4', 'rounded-lg', 'shadow-md');
    productElement.setAttribute('data-id', productId); // Menyimpan id_produk sebagai string

    productElement.innerHTML = `
        <img src="${product.gambar_produk || 'placeholder.jpg'}" alt="${product.product_name}" class="mx-auto mb-2">
        <h3 class="text-lg font-bold text-black mb-2 line-clamp-1">${product.product_name}</h3>
        <h3 class="text-lg font-bold text-purple-600 mb-2 line-clamp-1"> Rp${product.harga ? product.harga.toLocaleString() : '0'}</h3>
        <p class="text-green-600 text-sm font-bold">by: ${product.nama_jastip || 'Jastip Placeholder'}</p>
    `;

    // Tambahkan event listener untuk navigasi ke halaman detail
    productElement.addEventListener('click', () => {
        const clickedProductId = productElement.getAttribute('data-id'); // Ambil ID dari data-id
        console.log("Product ID yang diklik: ", clickedProductId); // Pastikan ID produk yang diklik benar
        if (clickedProductId) {
            window.location.href = 'detailjastip.html?id=' + clickedProductId; // Menggunakan clickedProductId yang sudah ada
        } else {
            console.error("ID produk tidak valid saat klik.");
        }
    });

    productGrid.appendChild(productElement);
}


// Event listener untuk tombol pencarian
document.querySelector("#search-button").addEventListener("click", () => {
    const inputElement = document.querySelector("#search-input");
    const namaProduk = inputElement.value.trim(); // Ambil nilai input pencarian
    if (namaProduk) {
        cariProduk(namaProduk); // Panggil fungsi untuk mencari produk
    } else {
        alert("Silakan masukkan nama produk untuk mencari.");
    }
});

// Panggil fungsi untuk menampilkan produk saat halaman dimuat
cariProduk();
