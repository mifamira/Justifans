const midtransClient = require('midtrans-client')
const db = admin.firestore();

async function getOrderData(docId) {
    try {
      const docRef = db.collection('orders').doc(docId);
      const doc = await docRef.get();
  
      if (!doc.exists) {
        throw new Error('Document not found!');
      }
      return doc.data();
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'SB-Mid-server-n71iJChTzArIiwR7mR_JSA7t'
    });

    let subtotal
    let adminprice = subtotal * 0.02; 
    let total = subtotal + adminprice + 10000; 
    
    let parameter = {
        "transaction_details": {
            "order_id": `ORDER-${Date.now()}`,
            "gross_amount": total
        },
        "credit_card": {
            "secure": true
        },
        "customer_details": {
            "name":  userData.name,
            "email": userData.email
        },
        "additional_data": {
            "subtotal": subtotal,
            "admin_fee": adminprice,
            "shipping_fee": 10000
        }
    };    

snap.createTransaction(parameter)
    .then((transaction)=>{
        let transactionToken = transaction.token;
        console.log('transactionToken:',transactionToken);
    })

createTransaction('id_user');