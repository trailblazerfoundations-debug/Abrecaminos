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
            <td style="padding: 15px;">L. ${item.price}</td>
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

// Init
initCharts();
renderInventory();

