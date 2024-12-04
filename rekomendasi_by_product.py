from flask import Flask, request, jsonify
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# Inisialisasi aplikasi Flask
app = Flask(__name__)

# Load model TF-IDF dan data produk
with open('models/tfidf_vectorizer.pkl', 'rb') as file:
    tfidf_vectorizer = pickle.load(file)

with open('models/tfidf_matrix.pkl', 'rb') as file:
    tfidf_matrix = pickle.load(file)

# Contoh data produk
products_df = pd.read_excel('dataset\Data Produk Justifans.xlsx')
products = products_df.to_dict(orient='records')

@app.route('/recommend', methods=['POST'])
def recommend():
    # Ambil query pengguna dari request
    user_query = request.json.get('query', '')
    if not user_query:
        return jsonify({'error': 'Query is empty'}), 400

    # Transform query ke TF-IDF
    user_query_tfidf = tfidf_vectorizer.transform([user_query])
    cosine_sim_user = cosine_similarity(user_query_tfidf, tfidf_matrix).flatten()

    # Rekomendasi berdasarkan cosine similarity
    top_indices = cosine_sim_user.argsort()[-10:][::-1]  # Ambil 10 besar dengan nilai tertinggi
    recommendations = [
        {"id": products[i]['id_produk'], "name": products[i]['product_name']}
        for i in top_indices if cosine_sim_user[i] > 0
    ]
    return jsonify({'recommendations': recommendations})

# Jalankan aplikasi pada port 5000
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
