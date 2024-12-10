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

const productCollection = collection(db, "detail-jastip");

async function loadNewProduct() {
    try {
        const productGrid = document.getElementById('product-grid'); 
        productGrid.innerHTML = '';

        const categoriesQuerySnapshot = await getDocs(collection(db, "detail-jastip"));

        const categoryMap = new Map();

        categoriesQuerySnapshot.forEach((doc) => {
            const product = doc.data();
            const category = product.kategori_produk; 

            if (!categoryMap.has(category) || product.id > categoryMap.get(category).id) {
                categoryMap.set(category, product);
            }
        });

        categoryMap.forEach((product) => {
            const productElement = document.createElement('div');
            productElement.classList.add('bg-gray-50', 'p-4', 'rounded-lg', 'shadow-md');
            productElement.innerHTML = `
                <a href="detailjastip.html?id=${product.id_produk}">
                    <img src="${product.gambar_produk}" alt="${product.product_name}" class="mx-auto mb-2">
                    <h3 class="text-lg font-bold text-black mb-2 line-clamp-1">${product.product_name}</h3>
                    <h3 class="text-lg font-bold text-purple-600 mb-2 line-clamp-1"> Rp${product.harga.toLocaleString()}</h3>
                    <p class="text-green-600 text-sm font-bold">by: ${product.nama_jastip}</p>
                </a>
            `;
            productGrid.appendChild(productElement);
        });
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
}

loadNewProduct();
