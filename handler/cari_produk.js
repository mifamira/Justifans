import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, limit } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

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
const db = getFirestore(app);

const productCollection = collection(db, "products");

export { productCollection, db };

async function cariProduk(namaProduk) {
    try {
        const productGrid = document.getElementById('product-grid');
        const titleElement = document.getElementById('title_cari');
        productGrid.innerHTML = '';

        const snapshot = await getDocs(productCollection);

        const matchingProducts = [];
        snapshot.forEach((doc) => {
            const product = doc.data();
            const productNameLower = product.product_name.toLowerCase();
            const queryLower = namaProduk.toLowerCase();

            if (productNameLower.includes(queryLower)) {
                matchingProducts.push(product);
            }
        });

        if (matchingProducts.length === 0) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('text-center', 'text-lg', 'text-gray-600', 'font-semibold');
            messageElement.innerText = "Merchandise tidak ditemukan.";
            productGrid.appendChild(messageElement);
        } else {
            titleElement.innerText = 'Hasil Pencarian';
            matchingProducts.forEach((product) => {
                renderProduct(product);
            });
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
}


function renderProduct(product) {
    const productGrid = document.getElementById('product-grid');

    if (!product.id_produk) {
        console.error('ID produk tidak ditemukan:', product);
        return; 
    }

    const productId = String(product.id_produk);

    const productElement = document.createElement('div');
    productElement.classList.add('bg-gray-50', 'p-4', 'rounded-lg', 'shadow-md');
    productElement.setAttribute('data-id', productId); 

    productElement.innerHTML = `
        <img src="${product.gambar_produk || 'placeholder.jpg'}" alt="${product.product_name}" class="mx-auto mb-2">
        <h3 class="text-lg font-bold text-black mb-2 line-clamp-1">${product.product_name}</h3>
        <h3 class="text-lg font-bold text-purple-600 mb-2 line-clamp-1"> Rp${product.harga ? product.harga.toLocaleString() : '0'}</h3>
        <p class="text-green-600 text-sm font-bold">by: ${product.nama_jastip || 'Jastip Placeholder'}</p>
    `;
     
      productElement.addEventListener('click', () => {
        const clickedProductId = productElement.getAttribute('data-id');
        console.log("Product ID yang diklik: ", clickedProductId); 
        if (clickedProductId) {
            window.location.href = 'detailjastip.html?id=' + clickedProductId; 
        } else {
            console.error("ID produk tidak valid saat klik.");
        }
    });

    productGrid.appendChild(productElement);
}

document.querySelector("#search-button").addEventListener("click", () => {
    const inputElement = document.querySelector("#search-input");
    const namaProduk = inputElement.value.trim();
    if (namaProduk) {
        cariProduk(namaProduk);
    } else {
        alert("Silakan masukkan nama produk untuk mencari.");
    }
});

cariProduk();
