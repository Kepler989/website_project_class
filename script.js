//cart functionality
let cart = JSON.parse(localStorage.getItem('watchCart')) || [];

updateCartUI();

function addToCart(name, price, image) {
  const product = { name, price, image };
  cart.push(product);

  localStorage.setItem('watchCart', JSON.stringify(cart));
  
  updateCartUI();
  alert(`${name} added to cart!`);
}

function updateCartUI() {
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.innerText = cart.length;
  }
  const cartDisplay = document.getElementById("cartItemsList");
  if (cartDisplay) {
    renderCart();
  }
}

function renderCart() {
  const cartDisplay = document.getElementById("cartItemsList");
  if (cart.length === 0) {
    cartDisplay.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartDisplay.innerHTML = cart.map((item, index) => `
    <div class="cart-item" style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
      <img src="${item.image}" style="height: 80px; width: 80px; object-fit: contain; background: white; border-radius: 5px;">
      <div>
        <h3>${item.name}</h3>
        <p>${item.price}</p>
        <button onclick="removeFromCart(${index})" style="color: red; background: none; border: none; cursor: pointer; padding: 0;">Remove</button>
      </div>
    </div>
  `).join('');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('watchCart', JSON.stringify(cart));
  updateCartUI();
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Checkout successful!");
    cart = [];
    localStorage.removeItem('watchCart');
    updateCartUI();
  }
}

//wishlist logic

let wishlist = JSON.parse(localStorage.getItem('watchWishlist')) || [];
if (document.getElementById("wishlistItemsList")) {
    renderWishlist();
}

function addToWishlist(name, price, image) {

  const exists = wishlist.find(item => item.name === name);
  if (exists) {
    alert("Item is already in your wishlist!");
    return;
  }

  const product = { name, price, image };
  wishlist.push(product);
  
  localStorage.setItem('watchWishlist', JSON.stringify(wishlist));
  alert(`${name} added to wishlist!`);
}

function renderWishlist() {
  const wishlistDisplay = document.getElementById("wishlistItemsList");
  if (wishlist.length === 0) {
    wishlistDisplay.innerHTML = "<p>Your wishlist is currently empty.</p>";
    return;
  }

  wishlistDisplay.innerHTML = wishlist.map((item, index) => `
    <div class="wishlist-item" style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
      <img src="${item.image}" style="height: 80px; width: 80px; object-fit: contain; background: white; border-radius: 5px;">
      <div>
        <h3>${item.name}</h3>
        <p>${item.price}</p>
        <button onclick="removeFromWishlist(${index})" style="color: #ff4d4d; background: none; border: none; cursor: pointer; padding: 0; margin-right: 15px;">Remove</button>
        <button onclick="moveToCart(${index})" style="color: #00ff00; background: none; border: none; cursor: pointer; padding: 0;">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function removeFromWishlist(index) {
  wishlist.splice(index, 1);
  localStorage.setItem('watchWishlist', JSON.stringify(wishlist));
  renderWishlist();
}

function moveToCart(index) {
  const item = wishlist[index];
  addToCart(item.name, item.price, item.image); 
  removeFromWishlist(index);
}


//slider logic

let slides = document.querySelectorAll(".slide");
let currentSlide = 0;
let slideInterval = setInterval(nextSlide, 3000);

function showSlide(index){
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

function nextSlide(){
  currentSlide=(currentSlide+1)%slides.length;
  showSlide(currentSlide);
}

function resetAutoSlide(){
  clearInterval(slideInterval);
  slideInterval=setInterval(nextSlide,3000);
}

//checkout functionality

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("orderSummaryItems")) {
        renderCheckoutSummary();
    }

    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", processOrder);
    }
});

function renderCheckoutSummary() {
    const summaryContainer = document.getElementById("orderSummaryItems");
    const totalDisplay = document.getElementById("orderTotal");
    
    if (cart.length === 0) {
        summaryContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let totalSum = calculateTotal();
    const discountRate = parseFloat(localStorage.getItem('appliedDiscount')) || 0;
    let discountAmount = totalSum * discountRate;
    let finalTotal = totalSum - discountAmount;
    summaryContainer.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>${item.name}</span>
            <span>${item.price}</span>
        </div>
    `).join('');
    if (discountRate > 0) {
        totalDisplay.innerHTML = `
            <div style="font-size: 0.8em; color: #888;">Original: ₹${totalSum.toLocaleString()}</div>
            <div style="font-size: 0.8em; color: #00ff00;">Discount (10%): -₹${discountAmount.toLocaleString()}</div>
            <div style="margin-top: 5px;">Total: ₹${finalTotal.toLocaleString()}</div>
        `;
    } else {
        totalDisplay.innerText = `Total: ₹${totalSum.toLocaleString()}`;
    }
}

function processOrder(event) {
    event.preventDefault(); 
    const name = document.getElementById("custName").value;
    
    alert(`Order Placed Successfully! Thank you, ${name}.`);
    cart = [];
    localStorage.removeItem('watchCart');
    localStorage.removeItem('appliedDiscount'); 

    updateCartUI();
    window.location.href = "home.html";
}

//coupon functionality

function applyCoupon() {
    const couponInput = document.getElementById("couponInput").value.trim().toUpperCase();
    const couponMsg = document.getElementById("couponMsg");
    
    if (cart.length === 0) {
        couponMsg.innerText = "Cart is empty!";
        return;
    }
    

    if (couponInput === "SAVE10") {
        localStorage.setItem('appliedDiscount', '0.10'); 
        
        let total = calculateTotal(); 
        let discount = total * 0.10;
        let finalPrice = total - discount;
        
        couponMsg.style.color = "#00ff00";
        couponMsg.innerHTML = `<b>Coupon Applied!</b><br>New Total: ₹${finalPrice.toLocaleString()}`;
    } else {
        localStorage.removeItem('appliedDiscount');
        couponMsg.style.color = "#ff4d4d";
        couponMsg.innerText = "Invalid Coupon Code.";
    }
}
function calculateTotal() {
    return cart.reduce((sum, item) => {
        const numericPrice = parseInt(item.price.replace(/[₹,]/g, ''));
        return sum + numericPrice;
    }, 0);
}


//timer functionality

const waitOneSecond = () => new Promise(resolve => setTimeout(resolve, 1000));
async function runSaleTimer() {
    const totalSeconds = 10 * 60 * 60; 
    for (let i = totalSeconds; i >= 0; i--) {
        let h = Math.floor(i / 3600);
        let m = Math.floor((i % 3600) / 60);
        let s = i % 60;
        const timerDisplay = document.getElementById("timer");
        if (timerDisplay) {
            timerDisplay.innerText = `${h}h ${m}m ${s}s`;
        }
        if (i === 0) {
            timerDisplay.innerText = "SALE ENDED";
            break; 
        }
        await waitOneSecond(); 
    }
}

runSaleTimer();
//end

