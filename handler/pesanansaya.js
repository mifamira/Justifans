// berirating.js

// Fungsi untuk menampilkan popup rating
export function showRatingPopup() {
    console.log("Popup akan ditampilkan");
    const popup = document.getElementById('rating-popup');
    popup.classList.remove('hidden');
}

// Fungsi untuk menutup popup rating
export function closeRatingPopup() {
    const popup = document.getElementById('rating-popup');
    popup.classList.add('hidden');  
}

const slider = document.getElementById('rating-slider');
const sliderValue = document.getElementById('slider-value');

// Perbarui nilai rating saat slider digeser
slider.addEventListener('input', () => {
    sliderValue.textContent = `${slider.value}⭐`;
});

document.getElementById('submit-rating-btn').addEventListener('click', () => {
    alert(`Terima kasih, rating Anda untuk produk adalah ${slider.value}⭐`);
    document.getElementById('rating-popup').classList.add('hidden'); // Tutup popup
});


// Menambahkan event listener untuk tombol
document.addEventListener('DOMContentLoaded', () => {
    const rateButton = document.getElementById('rate-product-btn');
    const submitButton = document.getElementById('submit-rating-btn');
    const closeButton = document.getElementById('close-popup-btn');

    if (rateButton) {
        rateButton.addEventListener('click', showRatingPopup);  // Menambahkan event listener untuk menampilkan popup
    }

    if (submitButton) {
        submitButton.addEventListener('click', submitRating);  // Menambahkan event listener untuk mengirim rating
    }

});
