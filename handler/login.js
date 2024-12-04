// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ3FFWzz-lBkEajePwUl5LxgpAOGqlXZA",
  authDomain: "capstone-442413.firebaseapp.com",
  projectId: "capstone-442413",
  storageBucket: "capstone-442413.firebasestorage.app",
  messagingSenderId: "1040333147919",
  appId: "1:1040333147919:web:63f19a9dd72b315bebb87a",
  measurementId: "G-S3Q03WCGNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//submit button
const submit = document.getElementById(submit);
submit.addEventListener("click", function(event){
 event.preventDefault()

 //inputs
const email = document.getElementById('email').Value;
const password = document.getElementById('password').Value;

 const auth = getAuth();

 signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  // Signed up 
  const user = userCredential.user;
  alert("Akun berhasil dibuat");
  window.location.href = "grand.html";
  // ...
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  alert(errorMessage)
  // ..
});
}

)