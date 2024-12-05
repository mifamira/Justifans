const express = require('express');
const tf = require('@tensorflow/tfjs-node');  // TensorFlow.js untuk Node.js
const app = express();
const port = 8080;

// Ganti dengan path ke model TensorFlow.js yang sudah dikonversi
const modelJsonPath = 'file://./model/model.json';

// Fungsi untuk memuat model
async function loadModel() {
  try {
    const model = await tf.loadGraphModel(modelJsonPath);
    console.log('Model berhasil dimuat');
    return model;
  } catch (error) {
    console.error('Error saat memuat model:', error);
    throw new Error('Model gagal dimuat');
  }
}

// Fungsi untuk melakukan prediksi
async function predict(model, user_id) {
  const numProducts = 503; // Menentukan jumlah produk yang akan diprediksi
  const products_ids = [];

  // Membuat data input untuk model (user_id dan product_id)
  for (let i = 0; i < numProducts; i++) {
    products_ids.push([user_id, i]); // Menambahkan pasangan user_id dan product_id
  }

  // Mengonversi input ke tensor
  const inputTensor = tf.tensor(products_ids);
  console.log('Input Tensor Shape:', inputTensor.shape);

  try {
    // Menjalankan model untuk mendapatkan prediksi
    const predictedRatings = await model.predict(inputTensor); // Prediksi rating produk
    console.log('Predicted Ratings:', predictedRatings);

    // Mendapatkan rekomendasi produk berdasarkan rating tertinggi
    const recommendedProducts = predictedRatings.argMax(-1).dataSync();
    console.log('Recommended Products:', recommendedProducts);

    return recommendedProducts.slice(0, 20); // Ambil 20 produk teratas
  } catch (error) {
    console.error('Error saat melakukan prediksi:', error);
    throw new Error('Terjadi kesalahan saat memproses prediksi.');
  }
}


// Memuat model saat server mulai
let model;
loadModel().then(loadedModel => {
  model = loadedModel;
});

// Endpoint untuk melakukan prediksi
app.post('/predict', express.json(), async (req, res) => {
  if (!model) {
    return res.status(500).send('Model belum dimuat.');
  }

  const { user_id } = req.body; // Ambil user_id dari request body
  if (user_id === undefined) {
    return res.status(400).send('user_id tidak ditemukan.');
  }

  try {
    const recommendedProducts = await predict(model, user_id);
    res.json({ recommendedProducts });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat memproses prediksi.');
  }
});

// Menjalankan server di port 8080
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// Endpoint default untuk route "/"
app.get('/', (req, res) => {
  res.send('Server berjalan dengan baik. Gunakan endpoint POST /predict untuk prediksi.');
});
