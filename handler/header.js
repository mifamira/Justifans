// Fungsi untuk memuat konten header.html ke dalam elemen dengan id 'header'
function loadHeader() {
    fetch('header.html')  // Pastikan path ke header.html sudah benar
        .then(response => response.text())  // Ambil konten HTML dari file header.html
        .then(data => {
            document.getElementById('header').innerHTML = data;  // Masukkan konten ke elemen #header
        })
        .catch(error => console.error('Error loading header:', error));
}

// Panggil fungsi loadHeader saat halaman dimuat
window.onload = loadHeader;
