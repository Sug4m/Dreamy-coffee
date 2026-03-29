// Hamburger Nav
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.navLinks');
const navigation = document.querySelector('.navigation');

menuToggle.addEventListener('click', (e) => {
    navLinks.classList.toggle('active');
    e.stopPropagation();
});

const links = document.querySelectorAll('.navLinks a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

document.addEventListener('click', (event) => {
    const isClickInside = navigation.contains(event.target);

    if (!isClickInside && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

// Menu Products
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.categories li');
    const products = document.querySelectorAll('.product');

    filterItems('coffee');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active-category'));
            button.classList.add('active-category');

            const selectedCategory = button.getAttribute('data-category');
            filterItems(selectedCategory);
        });
    });

    function filterItems(category) {
        products.forEach(product => {
            const itemType = product.getAttribute('data-item');
            
            if (category === 'all' || itemType === category) {
                product.style.setProperty('display', 'flex', 'important'); 
            } else {
                product.style.setProperty('display', 'none', 'important');
            }
        });
    }
});


// Order Button & Order Form
let cart = [];
let totalItems = 0;
let totalPrice = 0;

const cartBar = document.getElementById('cartBar');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const modal = document.getElementById('orderModal');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close-btn');

// add to cart
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product'); 
        const itemName = productCard.querySelector('h5').innerText; 
        const priceText = productCard.querySelector('.price-cart p').innerText; 
        const priceValue = parseFloat(priceText.replace('P ', ''));

        cart.push({ name: itemName, price: priceText });

        totalItems++;
        totalPrice += priceValue;

        updateCartBar();
        cartBar.classList.add('active');

        button.value = "ADDED!";
        button.style.backgroundColor = "#4E342E"; 
        button.style.color = "white";
        setTimeout(() => { 
            button.value = "ADD TO CART"; 
            button.style.backgroundColor = ""; 
            button.style.color = "";
        }, 800);
    });
});

// Receipt
const updateModalSummary = () => {
    const summaryDiv = document.getElementById('modalOrderSummary');
    const hiddenOrderInput = document.getElementById('hiddenOrderInput');
    const hiddenTotalInput = document.getElementById('hiddenTotalInput');

    if (cart.length === 0) {
        summaryDiv.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
        return;
    }

    let htmlPreview = "<strong>Your Orders:</strong><ul style='list-style:none; padding:10px 0;'>";
    let textForEmail = "";

    cart.forEach((item, index) => {
        htmlPreview += `
            <li style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <span>${item.name} <br> <small style="color:#666;">${item.price}</small></span>
                <button type="button" onclick="removeItem(${index})" style="background:#ff4444; border:none; color:white; cursor:pointer; font-size:0.7rem; padding:4px 8px; border-radius:5px;">Remove</button>
            </li>`;

        textForEmail += `${index + 1}. ${item.name} (${item.price})\n`;
    });

    const formattedTotal = `P ${totalPrice.toFixed(2)}`;

    htmlPreview += `</ul>
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.1rem; border-top:2px solid #4E342E; padding-top:10px; margin-top:10px; color:#4E342E;">
            <span>TOTAL:</span>
            <span>${formattedTotal}</span>
        </div>`;

    summaryDiv.innerHTML = htmlPreview;

    if(hiddenOrderInput) hiddenOrderInput.value = textForEmail;
    if(hiddenTotalInput) hiddenTotalInput.value = formattedTotal;
};

// Remove Item
window.removeItem = (index) => {
    const removedPrice = parseFloat(cart[index].price.replace('P ', ''));
    
    totalItems--;
    totalPrice -= removedPrice;

    cart.splice(index, 1);

    updateCartBar(); 
    updateModalSummary(); 

    if (cart.length === 0) {
        modal.style.display = "none";
        cartBar.classList.remove('active');
    }
};

function updateCartBar() {
    cartCount.innerText = `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}`;
    cartTotal.innerText = `P ${totalPrice.toFixed(2)}`;
}

openBtn.addEventListener('click', () => {
    modal.style.display = "block"; 
    updateModalSummary(); 
});

closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
};

// FORM SUBMISSION 
document.getElementById('checkoutForm').onsubmit = function() {
    setTimeout(() => {
        cart = [];
        totalItems = 0;
        totalPrice = 0;
        updateCartBar();
        cartBar.classList.remove('active');
    }, 1000);
};


// Thanks order alert
const form = document.getElementById('checkoutForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Pigilan ang default redirect ng Formspree

    const formData = new FormData(form);
    
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // DITO NATIN SIYA PIPILITIN MAG-REDIRECT
            window.location.href = "thanks.html"; 
        } else {
            alert("May problema sa pag-send. Pakisubukang muli.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
});
