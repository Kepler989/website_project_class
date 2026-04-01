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
    window.location.href = "index.html";
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

//canvas clock

// ===== NORMAL ANALOG CLOCK (REAL TIME) =====

const canvas = document.getElementById("analogClock");

if (canvas) {
    const ctx = canvas.getContext("2d");
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);

    function drawClock() {
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

        drawFace();
        drawNumbers();
        drawTime();
    }

    function drawFace() {
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.95, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.fill();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function drawNumbers() {
        ctx.font = radius * 0.15 + "px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        for (let num = 1; num <= 12; num++) {
            let ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.8);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.8);
            ctx.rotate(-ang);
        }
    }

    function drawTime() {
        const now = new Date();

        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();

        // Convert to angles
        hour = hour % 12;
        hour = (hour * Math.PI / 6) +
               (minute * Math.PI / (6 * 60)) +
               (second * Math.PI / (360 * 60));

        minute = (minute * Math.PI / 30) +
                 (second * Math.PI / (30 * 60));

        second = second * Math.PI / 30;

        drawHand(hour, radius * 0.5, 5);
        drawHand(minute, radius * 0.75, 3);
        drawHand(second, radius * 0.9, 2, "red");
    }

    function drawHand(pos, length, width, color = "white") {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    setInterval(drawClock, 1000);
}

//canvas price history

const productPrices = {
    p1: [22000, 24000, 25000],
    p2: [20000, 23000, 25000],
    p3: [7000, 7500, 8000],
    p4: [10000, 11000, 12000],
    p5: [23000, 24000, 25000]
};

const months = ["Jan", "Feb", "Mar"];

function togglePriceGraph(productId) {
    const canvas = document.getElementById("priceChart");
    if (!canvas) return;

    if (canvas.style.display === "none") {
        canvas.style.display = "block";
        drawPriceGraph(canvas, productId);
    } else {
        canvas.style.display = "none";
    }
}

function drawPriceGraph(canvas, productId) {
    const ctx = canvas.getContext("2d");

    const prices = productPrices[productId];

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const rightPadding = 80;

    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    const stepX = (width - padding - rightPadding) / (prices.length - 1);

    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - rightPadding, height - padding);
    ctx.stroke();

    ctx.strokeStyle = "#333";
    for (let i = 0; i < 4; i++) {
        let y = padding + i * ((height - 2 * padding) / 3);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - rightPadding, y);
        ctx.stroke();
    }

    ctx.strokeStyle = "#4da6ff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    prices.forEach((price, index) => {
        const x = padding + index * stepX;
        const y = height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - 2 * padding);

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.stroke();

    ctx.fillStyle = "#fff";
    prices.forEach((price, index) => {
        const x = padding + index * stepX;
        const y = height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - 2 * padding);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    ctx.fillStyle = "#ccc";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    months.forEach((month, index) => {
        const x = padding + index * stepX;
        const y = height - padding + 15;
        ctx.fillText(month, x, y);
    });

    ctx.fillStyle = "#4da6ff";
    ctx.textAlign = "left";
    ctx.fillText("₹" + prices[prices.length - 1], width - rightPadding + 10, height / 2);
}

//filter functionality

function toggleFilter() {
    const dropdown = document.getElementById("filterDropdown");
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

function applyFilter(category) {
    const products = document.querySelectorAll(".products-card");

    products.forEach(product => {
        const productCategory = product.getAttribute("data-category");

        if (category === "all" || productCategory === category) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });

    document.getElementById("filterDropdown").style.display = "none";
}

//particle animation

const canvasBg = document.getElementById("bgCanvas");

if (canvasBg) {
    const ctxBg = canvasBg.getContext("2d");

    let particles = [];
    const numParticles = 60;

    function resizeCanvas() {
        canvasBg.width = window.innerWidth;
        canvasBg.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvasBg.width,
            y: Math.random() * canvasBg.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: Math.random() * 2 + 1
        });
    }

    function drawParticles() {
        ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvasBg.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvasBg.height) p.vy *= -1;

            ctxBg.beginPath();
            ctxBg.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctxBg.fillStyle = "rgba(255,255,255,0.7)";
            ctxBg.fill();
        });

        connectParticles();

        requestAnimationFrame(drawParticles);
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctxBg.beginPath();
                    ctxBg.strokeStyle = "rgba(255,255,255,0.1)";
                    ctxBg.lineWidth = 1;
                    ctxBg.moveTo(particles[i].x, particles[i].y);
                    ctxBg.lineTo(particles[j].x, particles[j].y);
                    ctxBg.stroke();
                }
            }
        }
    }

    drawParticles();
}