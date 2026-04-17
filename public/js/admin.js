// Admin ERP Logic

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.view');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.dataset.view;
        
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        views.forEach(v => v.style.display = 'none');
        document.getElementById(`view-${targetView}`).style.display = 'block';
    });
});

// Dashboard Charts
function initCharts() {
    const ctxSales = document.getElementById('salesChart').getContext('2d');
    const ctxCats = document.getElementById('categoryChart').getContext('2d');

    new Chart(ctxSales, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
            datasets: [{
                label: 'Ventas (L.)',
                data: [4500, 3200, 5100, 4800, 7200, 9500, 11000],
                borderColor: '#4B7C42',
                backgroundColor: 'rgba(75, 124, 66, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    new Chart(ctxCats, {
        type: 'doughnut',
        data: {
            labels: ['Interior', 'Exterior', 'Sustratos', 'Herramientas'],
            datasets: [{
                data: [40, 30, 15, 15],
                backgroundColor: ['#2D4628', '#4B7C42', '#A4C639', '#E0E7DE']
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
}

// Inventory Logic
const inventory = [
    { name: 'Monstera Deliciosa', cat: 'Interior', stock: 12, price: 450, tax: 'Gravado (15%)' },
    { name: 'Sustrato Orgánico', cat: 'Sustratos', stock: 5, price: 85, tax: 'Exento' },
    { name: 'Tijeras de Podar', cat: 'Herramientas', stock: 45, price: 600, tax: 'Gravado (15%)' },
    { name: 'Palmera Real', cat: 'Exterior', stock: 3, price: 1500, tax: 'Gravado (15%)' }
];

// Formato de moneda con separador de miles
const priceFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function formatPrice(amount) {
    return `L. ${priceFormatter.format(amount)}`;
}

function renderInventory() {
    const list = document.getElementById('inventory-list');
    list.innerHTML = '';
    
    inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #f0f0f0';
        
        const stockColor = item.stock < 10 ? '#ff4d4d' : 'inherit';
        const stockIcon = item.stock < 10 ? '<i data-lucide="alert-triangle" style="width:14px; color:#ff4d4d"></i>' : '';

        row.innerHTML = `
            <td style="padding: 15px; font-weight: 500;">${item.name}</td>
            <td style="padding: 15px;">${item.cat}</td>
            <td style="padding: 15px; color: ${stockColor}">${item.stock} ${stockIcon}</td>
            <td style="padding: 15px; white-space: nowrap;">${formatPrice(item.price)}</td>
            <td style="padding: 15px;">
                <span style="background: ${item.tax === 'Exento' ? '#e8f3e9' : '#f0f0f0'}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                    ${item.tax}
                </span>
            </td>
            <td style="padding: 15px;">
                <button onclick="openEditModal(${index})" style="background: none; border: none; cursor: pointer; color: var(--primary); padding: 6px; border-radius: 6px; transition: background 0.2s;" title="Editar producto">
                    <i data-lucide="edit-2" style="width: 16px; height: 16px;"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- Modal de Edición ---
const editModal = document.getElementById('edit-modal');
const editForm  = document.getElementById('edit-form');

function openEditModal(index) {
    const item = inventory[index];
    document.getElementById('edit-index').value   = index;
    document.getElementById('edit-name').value    = item.name;
    document.getElementById('edit-cat').value     = item.cat;
    document.getElementById('edit-stock').value   = item.stock;
    document.getElementById('edit-price').value   = item.price;
    document.getElementById('edit-tax').value     = item.tax;
    editModal.classList.add('open');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeEditModal() {
    editModal.classList.remove('open');
}

document.getElementById('close-edit-modal').addEventListener('click', closeEditModal);
document.getElementById('cancel-edit').addEventListener('click', closeEditModal);

// Cerrar al hacer click fuera del modal
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = parseInt(document.getElementById('edit-index').value);
    
    inventory[index].name  = document.getElementById('edit-name').value.trim();
    inventory[index].cat   = document.getElementById('edit-cat').value;
    inventory[index].stock = parseInt(document.getElementById('edit-stock').value);
    inventory[index].price = parseFloat(document.getElementById('edit-price').value);
    inventory[index].tax   = document.getElementById('edit-tax').value;
    
    closeEditModal();
    renderInventory();
});

// Función global para acceso desde HTML
window.openEditModal = openEditModal;

// --- Navegación segmentada del inventario ---
const segmentBtns = document.querySelectorAll('.segment-btn');
const invTabContents = document.querySelectorAll('.inv-tab-content');

segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        segmentBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        invTabContents.forEach(tab => tab.style.display = 'none');
        document.getElementById(btn.dataset.invTab).style.display = 'block';
        
        // Renderizar contenido de la pestaña activa
        if (btn.dataset.invTab === 'tab-categories') renderCategories();
        if (btn.dataset.invTab === 'tab-isv') renderISV();
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
});

// --- Tab: Categorías ---
function renderCategories() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '';
    
    const catMap = {};
    inventory.forEach(item => {
        if (!catMap[item.cat]) catMap[item.cat] = [];
        catMap[item.cat].push(item);
    });
    
    const catIcons = {
        'Interior': 'home',
        'Exterior': 'sun',
        'Sustratos': 'layers',
        'Herramientas': 'wrench'
    };
    
    const catColors = {
        'Interior': '#4B7C42',
        'Exterior': '#E8A838',
        'Sustratos': '#A4C639',
        'Herramientas': '#6B8E9B'
    };
    
    Object.keys(catMap).forEach(cat => {
        const items = catMap[cat];
        const totalStock = items.reduce((sum, i) => sum + i.stock, 0);
        const icon = catIcons[cat] || 'tag';
        const color = catColors[cat] || '#888';
        
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: ${color}15; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="${icon}" style="width: 22px; height: 22px; color: ${color};"></i>
                </div>
                <div>
                    <h4 style="font-size: 1.1rem; margin: 0;">${cat}</h4>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${items.length} producto${items.length > 1 ? 's' : ''}</span>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border);">
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Stock total</span>
                    <p style="font-weight: 700; font-size: 1.3rem; margin: 0; color: ${totalStock < 10 ? '#ff4d4d' : 'var(--primary)'};">${totalStock}</p>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Productos</span>
                    <p style="font-weight: 600; font-size: 0.85rem; margin: 0;">${items.map(i => i.name).join(', ')}</p>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- Tab: Estado ISV ---
function renderISV() {
    const grid = document.getElementById('isv-grid');
    grid.innerHTML = '';
    
    const isvMap = {};
    inventory.forEach(item => {
        if (!isvMap[item.tax]) isvMap[item.tax] = [];
        isvMap[item.tax].push(item);
    });
    
    const isvStyles = {
        'Gravado (15%)': { icon: 'percent', color: '#E8A838', bg: '#FFF8EE' },
        'Exento': { icon: 'shield-check', color: '#4B7C42', bg: '#F0F7EE' }
    };
    
    Object.keys(isvMap).forEach(tax => {
        const items = isvMap[tax];
        const style = isvStyles[tax] || { icon: 'tag', color: '#888', bg: '#f5f5f5' };
        
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
                <div style="width: 48px; height: 48px; border-radius: 12px; background: ${style.bg}; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="${style.icon}" style="width: 24px; height: 24px; color: ${style.color};"></i>
                </div>
                <div>
                    <h4 style="font-size: 1.15rem; margin: 0;">${tax}</h4>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">${items.length} producto${items.length > 1 ? 's' : ''}</span>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${items.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: ${style.bg}; border-radius: 8px;">
                        <span style="font-weight: 500;">${item.name}</span>
                        <span style="white-space: nowrap; font-weight: 600; color: var(--primary);">${formatPrice(item.price)}</span>
                    </div>
                `).join('')}
            </div>
        `;
        grid.appendChild(card);
    });
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Init
initCharts();
renderInventory();
