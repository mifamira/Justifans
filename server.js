const tf = require('@tensorflow/tfjs-node');

// Path ke model.json dan file .bin
const modelJsonPath = './model/model.json';

// Memuat model TensorFlow.js
async function loadModel() {
  const model = await tf.loadGraphModel(`file://${modelJsonPath}`);
  console.log('Model berhasil dimuat');
  return model;
}

// Fungsi untuk membuat prediksi
async function predict(inputData) {
  const model = await loadModel();

  // Konversi inputData menjadi tensor (sesuaikan bentuk input sesuai model)
  const tensorData = tf.tensor(inputData);

  // Lakukan prediksi
  const prediction = model.predict(tensorData);
  prediction.print();  // Tampilkan hasil prediksi
}

// Contoh inputData
const inputData = [[1, 2, 3]];  // Sesuaikan dengan format input model
predict(inputData);
