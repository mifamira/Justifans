// JavaScript to handle mobile menu toggle
const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    mobileMenuButton.addEventListener("click", () => {
        // Toggle visibility of the mobile menu
        mobileMenu.classList.toggle("show");
    });

document.addEventListener("DOMContentLoaded", () => {
    fetch("model/detailjastip.json")
      .then((response) => response.json())
      .then((data) => {
        const product = data.product;
  
        // Update HTML with product details
        document.getElementById("productName").innerText = product.name;
        document.getElementById("productPrice").innerText = `Rp ${product.price.toLocaleString("id-ID")}`;
        document.getElementById("seller").innerText = product.seller;
        document.getElementById("category").innerText = product.category;
        document.getElementById("startOrder").innerText = product.startOrder;
        document.getElementById("closeOrder").innerText = product.closeOrder;
        document.getElementById("preOrderDays").innerText = `${product.preOrderDays} Hari`;
        document.getElementById("warehouse").innerText = product.warehouse;
  
        // Set product image
        const productImage = document.getElementById("productImage");
        productImage.src = product.image;
        productImage.alt = product.name;
  
        // Handle order button click
        const orderButton = document.getElementById("orderButton");
        orderButton.addEventListener("click", () => {
          alert(`Anda telah memesan ${product.name} dengan harga Rp ${product.price.toLocaleString("id-ID")}`);
        });
      })
      .catch((error) => console.error("Error loading JSON data:", error));
  });
  