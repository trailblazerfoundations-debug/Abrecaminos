// Product Mock Data
const products = [
    {
        id: 1,
        name: 'Monstera Deliciosa',
        category: 'interior',
        price: 450.00,
        stock: 5,
        image: 'images/monstera.png',
        description: 'Planta tropical elegante con hojas perforadas únicas.'
    },
    {
        id: 2,
        name: 'Set de Herramientas Premium',
        category: 'herramientas',
        price: 1200.00,
        stock: 3,
        image: 'images/tools.png',
        description: 'Herramientas de cobre y madera para jardinería de lujo.'
    },
    {
        id: 3,
        name: 'Sustrato Orgánico 5kg',
        category: 'sustratos',
        price: 85.00,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1585336139118-10617f19a0cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        description: 'Mezcla rica en nutrientes para un crecimiento vigoroso.'
    },
    {
        id: 4,
        name: 'Cactus del Desierto',
        category: 'exterior',
        price: 120.00,
        stock: 8,
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

// Formatter for Currency
const currencyFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function formatCurrency(amount) {
    return `<span style="white-space: nowrap;">L. ${currencyFormatter.format(amount)}</span>`;
}

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
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <h3 class="card-title" style="margin-bottom: 0;">${product.name}</h3>
                    <span style="font-size: 0.75rem; background: var(--border); padding: 2px 8px; border-radius: 10px; color: var(--text-muted);">Stock: ${product.stock}</span>
                </div>
                <p class="card-price">${formatCurrency(product.price)}</p>
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
        if (existing.quantity < product.stock) {
            existing.quantity += 1;
        } else {
            alert(`Lo sentimos, solo hay ${product.stock} unidades disponibles de ${product.name}.`);
            return;
        }
    } else {
        if (product.stock > 0) {
            cart.push({ ...product, quantity: 1 });
        } else {
            alert('Producto agotado temporalmente.');
            return;
        }
    }
    
    saveCart();
    updateCartUI();
    cartDrawer.style.right = '0'; // Show cart when adding
};

window.updateQuantity = (id, delta) => {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    
    if (item) {
        const newQty = item.quantity + delta;
        if (newQty > product.stock) {
            alert(`Solo hay ${product.stock} unidades disponibles.`);
            return;
        }
        
        if (newQty <= 0) {
            removeFromCart(id);
        } else {
            item.quantity = newQty;
            saveCart();
            updateCartUI();
        }
    }
};

function saveCart() {
    localStorage.setItem('vivero_cart', JSON.stringify(cart));
}

function updateCartUI() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">Tu carrito está vacío</p>';
    }
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '15px';
        div.style.marginBottom = '20px';
        div.style.padding = '10px';
        div.style.background = '#fcfdfc';
        div.style.borderRadius = '12px';
        div.style.border = '1px solid var(--border)';
        
        div.innerHTML = `
            <img src="${item.image}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                    <h4 style="font-size: 0.95rem; margin: 0;">${item.name}</h4>
                    <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff6b6b; cursor: pointer; padding: 2px;">
                        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; color: var(--primary-light);">${formatCurrency(item.price)}</span>
                    <div style="display: flex; align-items: center; gap: 10px; background: white; border: 1px solid var(--border); border-radius: 20px; padding: 2px 8px;">
                        <button onclick="updateQuantity(${item.id}, -1)" style="background: none; border: none; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--primary);">-</button>
                        <span style="font-size: 0.9rem; min-width: 15px; text-align: center; font-weight: 600;">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" style="background: none; border: none; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--primary);">+</button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    cartTotalElement.innerHTML = formatCurrency(total);
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
};

init();

