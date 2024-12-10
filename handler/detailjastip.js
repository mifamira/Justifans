import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, doc, getDoc} from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

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

export { productCollection, db };

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        const productRef = doc(db, "detail-jastip", productId.toString());

    getDoc(productRef)
    .then((docSnap) => {
        if (docSnap.exists()) {
            const product = docSnap.data();

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

            const orderButton = document.getElementById("orderButton");
            orderButton.addEventListener("click", () => {
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

async function loadRecommendations(productId) {
    try {
        const productRef = doc(db, "detail-jastip", productId.toString());
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            const product = productSnap.data();
            const productName = product.product_name;

            const recommendations = await getRecommendations(productName);

            if (recommendations && recommendations.length > 0) {
                for (let recommendation of recommendations) {
                    const productRef = doc(db, "detail-jastip", recommendation.id);
                    const docSnap = await getDoc(productRef);

                    if (docSnap.exists()) {
                        recommendation.name = docSnap.data().product_name;
                        recommendation.price = docSnap.data().harga;
                        recommendation.image = docSnap.data().gambar_produk;
                    } else {
                        console.error(`Produk dengan ID ${recommendation.id} tidak ditemukan di Firestore.`);
                    }
                }
            }

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

async function getRecommendations(productName) {
    const apiUrl = 'https://ml-app-1040333147919.asia-southeast2.run.app/';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: productName })
    });

    if (!response.ok) {
        console.error("Error fetching recommendations:", response.statusText);
        return [];
    }

    return await response.json();
}

function displayRecommendations(rekomendasi) {
    const recommendationGrid = document.getElementById("recommendationGrid");
    recommendationGrid.innerHTML = "";

    if (rekomendasi && rekomendasi.length > 0) {
        rekomendasi.forEach(item => {
            const recommendationElement = document.createElement("div");
            recommendationElement.className = "recommendation-item";

            recommendationElement.innerHTML = `
                <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}" class="recommendation-image">
                <h3 class="recommendation-name">${item.name}</h3>
                <p class="recommendation-price">Rp ${item.price.toLocaleString("id-ID")}</p>
                <button onclick="window.location.href='detailjastip.html?id=${item.id}'" class="btn-recommend">
                    Lihat Detail
                </button>
            `;

            recommendationGrid.appendChild(recommendationElement);
        });
    } else {
        recommendationGrid.innerHTML = "<p>Rekomendasi tidak tersedia.</p>";
    }
}
