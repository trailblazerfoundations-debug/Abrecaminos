// Product Mock Data
const products = [
    {
        id: 1,
        name: 'Monstera Deliciosa',
        category: 'interior',
        price: 450.00,
        image: 'images/monstera.png',
        description: 'Planta tropical elegante con hojas perforadas únicas.'
    },
    {
        id: 2,
        name: 'Set de Herramientas Premium',
        category: 'herramientas',
        price: 1200.00,
        image: 'images/tools.png',
        description: 'Herramientas de cobre y madera para jardinería de lujo.'
    },
    {
        id: 3,
        name: 'Sustrato Orgánico 5kg',
        category: 'sustratos',
        price: 85.00,
        image: 'https://images.unsplash.com/photo-1585336139118-10617f19a0cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        description: 'Mezcla rica en nutrientes para un crecimiento vigoroso.'
    },
    {
        id: 4,
        name: 'Cactus del Desierto',
        category: 'exterior',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1520302630591-fd1c66ed1143?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        description: 'Ideal para sol directo y bajo mantenimiento.'
    }
];

let cart = JSON.parse(localStorage.getItem('vivero_cart')) || [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const cartTrigger = document.getElementById('cart-trigger');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize
function init() {
    renderProducts('all');
    updateCartUI();
    
    // Event Listeners
    cartTrigger.addEventListener('click', () => cartDrawer.style.right = '0');
    closeCart.addEventListener('click', () => cartDrawer.style.right = '-400px');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.category);
        });
    });
}

function renderProducts(category) {
    productGrid.innerHTML = '';
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card reveal';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="card-img">
            <div class="card-content">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-price">L. ${product.price.toFixed(2)}</p>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" style="flex: 1;">
                        <i data-lucide="shopping-cart" style="width: 16px;"></i> Añadir
                    </button>
                    <a href="https://wa.me/50499999999?text=Hola! Consulto por la ${product.name} (L. ${product.price})" target="_blank" class="btn btn-whatsapp">
                        <i data-lucide="message-circle" style="width: 16px;"></i>
                    </a>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    cartDrawer.style.right = '0'; // Show cart when adding
};

function saveCart() {
    localStorage.setItem('vivero_cart', JSON.stringify(cart));
}

function updateCartUI() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '15px';
        div.style.marginBottom = '20px';
        div.innerHTML = `
            <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <h4 style="font-size: 0.9rem;">${item.name}</h4>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">L. ${item.price} x ${item.quantity}</span>
                    <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 0.8rem;">Eliminar</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    cartTotalElement.textContent = `L. ${total.toFixed(2)}`;
}

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
};

init();
