// Toggle mobile menu
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

// Get product details when the page loads
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        console.error("ID produk tidak ditemukan di URL.");
        alert("ID produk tidak ditemukan.");
        return;
    }

    try {
        const productRef = doc(db, "detail-jastip", productId);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
            const product = productDoc.data();

            // Update HTML elements with product data
            const productNameElem = document.getElementById("productName");
            const productPriceElem = document.getElementById("productPrice");
            const productImageElem = document.getElementById("productImage");

            // Pastikan elemen ditemukan sebelum mengaksesnya
            if (productNameElem) {
                productNameElem.innerText = product.product_name || "Nama produk tidak tersedia";
            }
            if (productPriceElem) {
                productPriceElem.innerText = `Rp ${product.harga?.toLocaleString("id-ID") || "0"}`;
            }
            if (productImageElem) {
                productImageElem.src = product.gambar_produk || "placeholder.jpg";
                productImageElem.alt = product.product_name || "Gambar produk tidak tersedia";
            }
            // ID dan Elemen DOM untuk harga dan total
            const subtotalElem = document.getElementById("subtotal");
            const totalElem = document.getElementById("total");
            const adminpriceElem = document.getElementById("adminprice")
            let currentQuantity = parseInt(document.getElementById("quantity").innerText);
            let productPrice = parseInt(product.harga);

            // Fungsi untuk memperbarui harga dan total
            const updatePriceAndTotal = () => {
                const subtotal = productPrice * currentQuantity;
                const adminprice = subtotal*0.02;
                const total = subtotal + adminprice + 10000; // Ongkos kirim dan biaya admin tetap
                adminpriceElem.innerText = `Rp ${adminprice.toLocaleString("id-ID")}`;
                subtotalElem.innerText = `Rp ${subtotal.toLocaleString("id-ID")}`;
                totalElem.innerText = `Rp ${total.toLocaleString("id-ID")}`;
            };

            // Fungsi untuk mengurangi atau menambah jumlah produk
            const updateQuantity = (increment) => {
                if (increment) {
                    currentQuantity++;
                } else if (currentQuantity > 1) {
                    currentQuantity--;
                }
                document.getElementById("quantity").innerText = currentQuantity;
                updatePriceAndTotal(); // Perbarui harga dan total
            };

            // Tambahkan event listener untuk tombol pengurangan (-) dan penambahan (+)
            const decrementButton = document.getElementById("decrementButton");
            const incrementButton = document.getElementById("incrementButton");

            decrementButton.addEventListener("click", () => updateQuantity(false));
            incrementButton.addEventListener("click", () => updateQuantity(true));

            // Hitung harga dan total untuk kali pertama saat halaman dimuat
            updatePriceAndTotal();


        } else {
            console.error("Produk tidak ditemukan di Firestore.");
            alert("Produk tidak ditemukan.");
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data produk:", error);
        alert("Terjadi kesalahan saat mengambil data produk.");
    }

    // Handle mobile menu toggle
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", () => {
            if (mobileMenu) {
                mobileMenu.classList.toggle("show");
            }
        });
    }

    // Handle pay button
    const payButton = document.getElementById("payButton");
    if (payButton) {
        payButton.addEventListener("click", () => {
            alert("Fitur pembayaran belum tersedia.");
        });
    }
});
