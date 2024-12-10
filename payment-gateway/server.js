const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

async function getUserData(userId) {
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error('Pengguna tidak ditemukan');
        }
        return userDoc.data();
    } catch (error) {
        console.error('Error mendapatkan data pengguna:', error);
        throw error;
    }
}

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-n71iJChTzArIiwR7mR_JSA7t'
});

app.post('/payment-gateway/placeOrder', async (req, res) => {
    const { totalAmount, orderId, userData, productData } = req.body;
    const user = userData || {}; 
    const product = productData || {}; 

    try {
        const subtotal = totalAmount - 10000; 
        const adminprice = subtotal * 0.02;  
        const total = subtotal + adminprice + 10000; 

        const parameter = {
            "transaction_details": {
                "order_id": `ORDER-${user.id_user}-${Date.now()}`,
                "gross_amount": total
            },
            "credit_card": {
                "secure": true
            },
            "customer_details": {
                "name": user.name || "Nama Pengguna", 
                "email": user.email || "email@example.com"
            },
            "additional_data": {
                "subtotal": subtotal,
                "admin_fee": adminprice,
                "shipping_fee": 10000
            }
        };

        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;

        // Menambahkan data pesanan ke Firestore
        const orderRef = db.collection('orders').doc(transactionToken);  // Menggunakan token transaksi sebagai ID order
        await orderRef.set({
            jastipName: user.name || "Nama Jastip",
            productName: product.name || "Nama Produk",
            productPrice: product.price || 0,
            productQuantity: product.quantity || 1,
            totalPrice: total,
            shippingStatus: "Pending",  // Status pengiriman awal
            updatedAt: new Date()
        });

        console.log('Transaction token:', transactionToken);
        res.json({ token: transactionToken }); 
    } catch (error) {
        console.error('Error saat membuat transaksi:', error);
        res.status(500).json({ error: 'Gagal membuat transaksi', detail: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
