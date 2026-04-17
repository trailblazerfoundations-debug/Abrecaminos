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

// --- Filtros de Inventario ---
const filterInvProduct = document.getElementById('filter-inv-product');
const filterInvCat = document.getElementById('filter-inv-cat');
const filterInvStock = document.getElementById('filter-inv-stock');
const filterInvPrice = document.getElementById('filter-inv-price');

if(filterInvProduct) filterInvProduct.addEventListener('input', renderInventory);
if(filterInvCat) filterInvCat.addEventListener('change', renderInventory);
if(filterInvStock) filterInvStock.addEventListener('change', renderInventory);
if(filterInvPrice) filterInvPrice.addEventListener('change', renderInventory);

function renderInventory() {
    const list = document.getElementById('inventory-list');
    list.innerHTML = '';
    
    let filteredInventory = [...inventory];
    
    // Filtro por Producto
    if (filterInvProduct && filterInvProduct.value) {
        const val = filterInvProduct.value.toLowerCase();
        filteredInventory = filteredInventory.filter(item => item.name.toLowerCase().includes(val));
    }
    // Filtro por Categoría
    if (filterInvCat && filterInvCat.value !== 'Todas') {
        filteredInventory = filteredInventory.filter(item => item.cat === filterInvCat.value);
    }
    // Filtro por Stock
    if (filterInvStock && filterInvStock.value !== 'Todos') {
        if (filterInvStock.value === 'Critico') {
            filteredInventory = filteredInventory.filter(item => item.stock <= 5);
        } else if (filterInvStock.value === 'Normal') {
            filteredInventory = filteredInventory.filter(item => item.stock > 5);
        }
    }
    // Orden por Precio
    if (filterInvPrice && filterInvPrice.value !== 'Default') {
        if (filterInvPrice.value === 'Asc') {
            filteredInventory.sort((a, b) => a.price - b.price);
        } else if (filterInvPrice.value === 'Desc') {
            filteredInventory.sort((a, b) => b.price - a.price);
        }
    }
    
    window.currentFilteredInventory = filteredInventory;

    if (filteredInventory.length === 0) {
        list.innerHTML = '<tr><td colspan="6" style="padding: 40px; text-align: center; color: var(--text-muted);">No se encontraron productos con estos filtros</td></tr>';
        return;
    }

    filteredInventory.forEach((item) => {
        // Find real index for editing
        const index = inventory.findIndex(i => i.name === item.name);
        
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

// --- Exportación de Datos ---
const btnExport = document.getElementById('btn-export');
const exportOptions = document.getElementById('export-options');

if (btnExport) {
    btnExport.addEventListener('click', (e) => {
        e.stopPropagation();
        exportOptions.style.display = exportOptions.style.display === 'none' ? 'block' : 'none';
    });
}

document.addEventListener('click', () => {
    if (exportOptions) exportOptions.style.display = 'none';
});

function getExportContext() {
    let headers = [];
    let title = "";
    let formattedData = [];
    
    if (activeTab === 'tab-inventory') {
        title = "Inventario de Productos";
        headers = ['Producto', 'Categoría', 'Stock', 'Precio (L.)', 'Estado ISV'];
        const dataToExport = window.currentFilteredInventory || inventory;
        formattedData = dataToExport.map(item => [
            item.name, item.cat, item.stock, formatPrice(item.price).replace('L. ', 'L.'), item.tax
        ]);
        
    } else if (activeTab === 'tab-categories') {
        title = "Inventario por Categorías";
        headers = ['Categoría', 'Cantidad de Productos', 'Stock Total'];
        formattedData = categories.map(cat => {
            const items = (window.currentFilteredInventory || inventory).filter(item => item.cat === cat.name);
            const totalStock = items.reduce((sum, i) => sum + i.stock, 0);
            return [cat.name, items.length, totalStock];
        });
        
    } else if (activeTab === 'tab-isv') {
        title = "Reporte de Estado ISV";
        headers = ['Estado ISV', 'Cantidad de Productos', 'Valor Total en Inventario'];
        const isvTypes = [...new Set(inventory.map(i => i.tax))];
        formattedData = isvTypes.map(type => {
            const items = (window.currentFilteredInventory || inventory).filter(item => item.tax === type);
            const totalValue = items.reduce((sum, i) => sum + (i.price * i.stock), 0);
            return [type, items.length, formatPrice(totalValue).replace('L. ', 'L.')];
        });
        
    } else if (activeTab === 'tab-movements') {
        title = "Reporte de Movimientos de Inventario";
        headers = ['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Usuario', 'Motivo'];
        const dataToExport = window.currentFilteredMovements || movements;
        formattedData = dataToExport.map(mov => {
            const dateObj = new Date(mov.date);
            const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sign = mov.type === 'Ingreso' ? '+' : '-';
            return [dateStr, mov.product, mov.type, `${sign}${mov.qty}`, mov.user, mov.reason];
        });
    }
    
    // For Excel
    const jsonData = formattedData.map(rowGroup => {
        let obj = {};
        headers.forEach((h, i) => {
            obj[h] = rowGroup[i];
        });
        return obj;
    });

    return { title, headers, body: formattedData, jsonData };
}

window.exportToExcel = () => {
    const { title, jsonData } = getExportContext();
    let ws = XLSX.utils.json_to_sheet(jsonData);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `${title.replace(/ /g, '_')}.xlsx`);
};

window.exportToPDF = () => {
    const { title, headers, body } = getExportContext();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(`${title} - Vivero Abre Caminos`, 14, 15);
    
    doc.autoTable({
        head: [headers],
        body: body,
        startY: 25,
    });
    
    doc.save(`${title.replace(/ /g, '_')}.pdf`);
};

window.exportToWord = () => {
    const { title, headers, body } = getExportContext();
    let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%;"><thead><tr>';
    headers.forEach(h => { tableHtml += `<th style="padding: 8px; background-color: #f2f2f2;">${h}</th>`; });
    tableHtml += '</tr></thead><tbody>';
    
    body.forEach(row => {
        tableHtml += `<tr>`;
        row.forEach(cell => {
            tableHtml += `<td style="padding: 8px;">${cell}</td>`;
        });
        tableHtml += `</tr>`;
    });
    tableHtml += '</tbody></table>';

    const headerHTML = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
    const footerHTML = "</body></html>";
    const sourceHTML = headerHTML + `<h2>${title} - Vivero Abre Caminos</h2><br>` + tableHtml + footerHTML;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${title.replace(/ /g, '_')}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
};

// --- Navegación segmentada del inventario ---
const segmentBtns = document.querySelectorAll('.segment-btn');
const invTabContents = document.querySelectorAll('.inv-tab-content');
const btnAction = document.getElementById('btn-action');
const btnActionText = document.getElementById('btn-action-text');

// Datos de categorías independientes
const categories = [
    { name: 'Interior', icon: 'home', color: '#4B7C42' },
    { name: 'Exterior', icon: 'sun', color: '#E8A838' },
    { name: 'Sustratos', icon: 'layers', color: '#A4C639' },
    { name: 'Herramientas', icon: 'wrench', color: '#6B8E9B' }
];

let activeTab = 'tab-inventory';

function updateActionButton(tab) {
    activeTab = tab;
    if (tab === 'tab-categories') {
        btnActionText.textContent = 'Nueva Categoría';
    } else if (tab === 'tab-isv') {
        btnActionText.textContent = 'Nuevo Estado ISV';
    } else if (tab === 'tab-movements') {
        btnActionText.textContent = 'Nuevo Movimiento';
    } else {
        btnActionText.textContent = 'Nuevo Producto';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

btnAction.addEventListener('click', () => {
    if (activeTab === 'tab-categories') {
        openCategoryModal();
    } else if (activeTab === 'tab-movements') {
        openMovementModal();
    }
    // Otras acciones para otros tabs se pueden añadir aquí
});

segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        segmentBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        invTabContents.forEach(tab => tab.style.display = 'none');
        document.getElementById(btn.dataset.invTab).style.display = 'block';
        
        updateActionButton(btn.dataset.invTab);
        
        // Renderizar contenido de la pestaña activa
        if (btn.dataset.invTab === 'tab-categories') renderCategories();
        if (btn.dataset.invTab === 'tab-isv') renderISV();
        if (btn.dataset.invTab === 'tab-movements') renderMovements();
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
});

// --- Tab: Categorías (formato lista) ---
function renderCategories() {
    const list = document.getElementById('categories-list');
    list.innerHTML = '';
    
    categories.forEach((cat, index) => {
        const items = inventory.filter(item => item.cat === cat.name);
        const totalStock = items.reduce((sum, i) => sum + i.stock, 0);
        
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #f0f0f0';
        row.innerHTML = `
            <td style="padding: 15px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 36px; height: 36px; border-radius: 8px; background: ${cat.color}15; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="${cat.icon}" style="width: 18px; height: 18px; color: ${cat.color};"></i>
                    </div>
                    <span style="font-weight: 600;">${cat.name}</span>
                </div>
            </td>
            <td style="padding: 15px;">
                <span style="background: var(--border); padding: 3px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 500;">${items.length}</span>
            </td>
            <td style="padding: 15px; font-weight: 600; color: ${totalStock < 10 ? '#ff4d4d' : 'var(--primary)'};">
                ${totalStock}
            </td>
            <td style="padding: 15px; font-size: 0.85rem; color: var(--text-muted);">
                ${items.length > 0 ? items.map(i => i.name).join(', ') : '<em>Sin productos</em>'}
            </td>
            <td style="padding: 15px;">
                <button onclick="deleteCategory(${index})" style="background: none; border: none; cursor: pointer; color: #ff6b6b; padding: 6px; border-radius: 6px;" title="Eliminar categoría">
                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- Modal de Nueva Categoría ---
const categoryModal = document.getElementById('category-modal');
const categoryForm = document.getElementById('category-form');

function openCategoryModal() {
    document.getElementById('cat-name').value = '';
    document.getElementById('cat-icon').value = 'home';
    categoryModal.classList.add('open');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeCategoryModal() {
    categoryModal.classList.remove('open');
}

document.getElementById('close-cat-modal').addEventListener('click', closeCategoryModal);
document.getElementById('cancel-cat').addEventListener('click', closeCategoryModal);
categoryModal.addEventListener('click', (e) => {
    if (e.target === categoryModal) closeCategoryModal();
});

categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cat-name').value.trim();
    const icon = document.getElementById('cat-icon').value;
    
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert('Ya existe una categoría con ese nombre.');
        return;
    }
    
    const colors = ['#4B7C42', '#E8A838', '#A4C639', '#6B8E9B', '#9C6ADE', '#E85D75', '#38B2AC'];
    const color = colors[categories.length % colors.length];
    
    categories.push({ name, icon, color });
    closeCategoryModal();
    renderCategories();
});

window.deleteCategory = (index) => {
    const cat = categories[index];
    const hasProducts = inventory.some(item => item.cat === cat.name);
    
    if (hasProducts) {
        alert(`No se puede eliminar "${cat.name}" porque tiene productos asociados.`);
        return;
    }
    
    if (confirm(`¿Eliminar la categoría "${cat.name}"?`)) {
        categories.splice(index, 1);
        renderCategories();
    }
};

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

// --- Tab: Movimientos ---
const movements = [
    { date: '2023-10-12T10:30:00', product: 'Monstera Deliciosa', type: 'Ingreso', qty: 10, user: 'Admin', reason: 'Compra a proveedor' },
    { date: '2023-10-14T14:15:00', product: 'Sustrato Orgánico', type: 'Egreso', qty: 2, user: 'Admin', reason: 'Uso interno vivero' },
    { date: '2023-10-15T09:00:00', product: 'Palmera Real', type: 'Ingreso', qty: 5, user: 'Admin', reason: 'Producción propia' }
];

const movementModal = document.getElementById('movement-modal');
const movementForm = document.getElementById('movement-form');

// --- Listeners para Filtros de Movimientos ---
const filterMovProduct = document.getElementById('filter-mov-product');
const filterMovType = document.getElementById('filter-mov-type');
const filterMovUser = document.getElementById('filter-mov-user');

if(filterMovProduct) filterMovProduct.addEventListener('input', renderMovements);
if(filterMovType) filterMovType.addEventListener('change', renderMovements);
if(filterMovUser) filterMovUser.addEventListener('input', renderMovements);

function renderMovements() {
    const list = document.getElementById('movements-list');
    list.innerHTML = '';
    
    let filteredMovements = movements;
    
    // Aplicar Filtros
    if (filterMovProduct && filterMovProduct.value) {
        const val = filterMovProduct.value.toLowerCase();
        filteredMovements = filteredMovements.filter(m => m.product.toLowerCase().includes(val));
    }
    if (filterMovType && filterMovType.value !== 'Todos') {
        filteredMovements = filteredMovements.filter(m => m.type === filterMovType.value);
    }
    if (filterMovUser && filterMovUser.value) {
        const val = filterMovUser.value.toLowerCase();
        filteredMovements = filteredMovements.filter(m => m.user.toLowerCase().includes(val));
    }

    if (filteredMovements.length === 0) {
        list.innerHTML = '<tr><td colspan="6" style="padding: 40px; text-align: center; color: var(--text-muted);">No hay movimientos que coincidan con los filtros</td></tr>';
        return;
    }
    
    // Sort automatically by date descending (newest first)
    const sorted = [...filteredMovements].sort((a, b) => new Date(b.date) - new Date(a.date));
    window.currentFilteredMovements = sorted;
    
    sorted.forEach(mov => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #f0f0f0';
        
        const dateObj = new Date(mov.date);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const typeColor = mov.type === 'Ingreso' ? 'var(--primary)' : '#cc3333';
        const typeBg = mov.type === 'Ingreso' ? '#e8f3e9' : '#fce8e8';
        const typeIcon = mov.type === 'Ingreso' ? 'arrow-down-to-line' : 'arrow-up-from-line';
        const sign = mov.type === 'Ingreso' ? '+' : '-';
        
        row.innerHTML = `
            <td style="padding: 15px; font-size: 0.9rem; color: var(--text-muted);">${dateStr}</td>
            <td style="padding: 15px; font-weight: 500;">${mov.product}</td>
            <td style="padding: 15px;">
                <span style="display: inline-flex; align-items: center; gap: 4px; background: ${typeBg}; color: ${typeColor}; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
                    <i data-lucide="${typeIcon}" style="width: 12px; height: 12px;"></i> ${mov.type}
                </span>
            </td>
            <td style="padding: 15px; font-weight: 700; color: ${typeColor};">${sign}${mov.qty}</td>
            <td style="padding: 15px; font-size: 0.9rem; color: #555;"><i data-lucide="user" style="width: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>${mov.user}</td>
            <td style="padding: 15px; font-size: 0.85rem; color: var(--text-muted); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${mov.reason}">${mov.reason}</td>
        `;
        list.appendChild(row);
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openMovementModal() {
    const productSelect = document.getElementById('mov-product');
    productSelect.innerHTML = '<option value="">Seleccione un producto...</option>';
    inventory.forEach(item => {
        productSelect.innerHTML += `<option value="${item.name}">${item.name} (Stock actual: ${item.stock})</option>`;
    });
    
    movementForm.reset();
    movementModal.classList.add('open');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeMovementModal() {
    movementModal.classList.remove('open');
}

document.getElementById('close-movement-modal').addEventListener('click', closeMovementModal);
document.getElementById('cancel-movement').addEventListener('click', closeMovementModal);
movementModal.addEventListener('click', (e) => {
    if (e.target === movementModal) closeMovementModal();
});

movementForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productName = document.getElementById('mov-product').value;
    const type = document.getElementById('mov-type').value;
    const qty = parseInt(document.getElementById('mov-qty').value);
    const reason = document.getElementById('mov-reason').value;
    
    if (!productName || qty <= 0) return;
    
    // Check stock for egesos
    const productIndex = inventory.findIndex(i => i.name === productName);
    if (productIndex === -1) return;
    
    if (type === 'Egreso' && inventory[productIndex].stock < qty) {
        alert('Stock insuficiente para realizar este egreso.');
        return;
    }
    
    // Register movement
    movements.push({
        date: new Date().toISOString(),
        product: productName,
        type: type,
        qty: qty,
        user: 'Admin', // Static for now, could be dynamic later
        reason: reason
    });
    
    // Update inventory stock
    if (type === 'Ingreso') {
        inventory[productIndex].stock += qty;
    } else {
        inventory[productIndex].stock -= qty;
    }
    
    closeMovementModal();
    renderMovements();
    renderInventory();
});

// Init
initCharts();
renderInventory();

// ============================================
// MÓDULO DE VENDEDORES
// ============================================

const sellers = [
    { name: 'María López', phone: '9876-5432', email: 'maria@vivero.com', commission: 5, status: 'Activo', salesMonth: 12500, salesCount: 28 },
    { name: 'Carlos Reyes', phone: '9812-3456', email: 'carlos@vivero.com', commission: 4, status: 'Activo', salesMonth: 8900, salesCount: 19 },
    { name: 'Ana Flores', phone: '9945-6789', email: 'ana@vivero.com', commission: 5, status: 'Inactivo', salesMonth: 0, salesCount: 0 },
    { name: 'José Martínez', phone: '9901-2345', email: 'jose@vivero.com', commission: 6, status: 'Activo', salesMonth: 15200, salesCount: 34 }
];

const sellerModal = document.getElementById('seller-modal');
const sellerForm = document.getElementById('seller-form');

function renderSellersKPIs() {
    const kpisContainer = document.getElementById('sellers-kpis');
    
    const totalSellers = sellers.length;
    const activeSellers = sellers.filter(s => s.status === 'Activo').length;
    const totalSalesMonth = sellers.reduce((sum, s) => sum + s.salesMonth, 0);
    const totalCommissions = sellers.reduce((sum, s) => sum + (s.salesMonth * s.commission / 100), 0);
    
    kpisContainer.innerHTML = `
        <div class="stat-card">
            <span style="color: var(--text-muted); font-size: 0.85rem;">Total Vendedores</span>
            <span style="font-size: 2rem; font-weight: 700; color: var(--primary);">${totalSellers}</span>
            <span style="font-size: 0.8rem; color: #25D366;">${activeSellers} activos</span>
        </div>
        <div class="stat-card">
            <span style="color: var(--text-muted); font-size: 0.85rem;">Ventas del Mes</span>
            <span style="font-size: 2rem; font-weight: 700; color: var(--primary); white-space: nowrap;">${formatPrice(totalSalesMonth)}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${sellers.reduce((s, v) => s + v.salesCount, 0)} transacciones</span>
        </div>
        <div class="stat-card">
            <span style="color: var(--text-muted); font-size: 0.85rem;">Comisiones Acumuladas</span>
            <span style="font-size: 2rem; font-weight: 700; color: #E8A838; white-space: nowrap;">${formatPrice(totalCommissions)}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Por pagar</span>
        </div>
        <div class="stat-card">
            <span style="color: var(--text-muted); font-size: 0.85rem;">Mejor Vendedor</span>
            <span style="font-size: 1.3rem; font-weight: 700; color: var(--primary);">${sellers.length > 0 ? sellers.reduce((best, s) => s.salesMonth > best.salesMonth ? s : best, sellers[0]).name : 'N/A'}</span>
            <span style="font-size: 0.8rem; color: #25D366;">🏆 Top del mes</span>
        </div>
    `;
}

function renderSellers() {
    renderSellersKPIs();
    
    const list = document.getElementById('sellers-list');
    list.innerHTML = '';
    
    if (sellers.length === 0) {
        list.innerHTML = '<tr><td colspan="7" style="padding: 40px; text-align: center; color: var(--text-muted);">No hay vendedores registrados</td></tr>';
        return;
    }
    
    sellers.forEach((seller, index) => {
        const commissionAmount = seller.salesMonth * seller.commission / 100;
        const isTop = sellers.length > 0 && seller === sellers.reduce((best, s) => s.salesMonth > best.salesMonth ? s : best, sellers[0]) && seller.salesMonth > 0;
        
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #f0f0f0';
        row.innerHTML = `
            <td style="padding: 15px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 38px; height: 38px; border-radius: 50%; background: ${seller.status === 'Activo' ? 'var(--primary)' : '#ccc'}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.9rem;">
                        ${seller.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                        <span style="font-weight: 600;">${seller.name}</span>${isTop ? ' <span style="font-size: 0.75rem;">🏆</span>' : ''}
                        <br><span style="font-size: 0.8rem; color: var(--text-muted);">${seller.email}</span>
                    </div>
                </div>
            </td>
            <td style="padding: 15px;">${seller.phone}</td>
            <td style="padding: 15px;">
                <span style="background: #f0f7ee; padding: 3px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; color: var(--primary);">${seller.commission}%</span>
            </td>
            <td style="padding: 15px; white-space: nowrap; font-weight: 600;">${formatPrice(seller.salesMonth)}</td>
            <td style="padding: 15px; white-space: nowrap; font-weight: 600; color: #E8A838;">${formatPrice(commissionAmount)}</td>
            <td style="padding: 15px;">
                <span style="background: ${seller.status === 'Activo' ? '#e8f3e9' : '#fce8e8'}; color: ${seller.status === 'Activo' ? '#2D4628' : '#cc3333'}; padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 500;">
                    ${seller.status}
                </span>
            </td>
            <td style="padding: 15px;">
                <div style="display: flex; gap: 6px;">
                    <button onclick="openSellerModal(${index})" style="background: none; border: none; cursor: pointer; color: var(--primary); padding: 6px; border-radius: 6px;" title="Editar">
                        <i data-lucide="edit-2" style="width: 16px; height: 16px;"></i>
                    </button>
                    <button onclick="deleteSeller(${index})" style="background: none; border: none; cursor: pointer; color: #ff6b6b; padding: 6px; border-radius: 6px;" title="Eliminar">
                        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            </td>
        `;
        list.appendChild(row);
    });
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- Modal de Vendedor ---
function openSellerModal(index = -1) {
    document.getElementById('seller-index').value = index;
    
    if (index >= 0) {
        const s = sellers[index];
        document.getElementById('seller-modal-title').textContent = 'Editar Vendedor';
        document.getElementById('seller-submit-btn').textContent = 'Guardar Cambios';
        document.getElementById('seller-name').value = s.name;
        document.getElementById('seller-phone').value = s.phone;
        document.getElementById('seller-email').value = s.email;
        document.getElementById('seller-commission').value = s.commission;
        document.getElementById('seller-status').value = s.status;
    } else {
        document.getElementById('seller-modal-title').textContent = 'Nuevo Vendedor';
        document.getElementById('seller-submit-btn').textContent = 'Crear Vendedor';
        sellerForm.reset();
        document.getElementById('seller-commission').value = 5;
    }
    
    sellerModal.classList.add('open');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeSellerModal() {
    sellerModal.classList.remove('open');
}

document.getElementById('close-seller-modal').addEventListener('click', closeSellerModal);
document.getElementById('cancel-seller').addEventListener('click', closeSellerModal);
sellerModal.addEventListener('click', (e) => {
    if (e.target === sellerModal) closeSellerModal();
});

document.getElementById('btn-new-seller').addEventListener('click', () => openSellerModal(-1));

sellerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = parseInt(document.getElementById('seller-index').value);
    
    const data = {
        name: document.getElementById('seller-name').value.trim(),
        phone: document.getElementById('seller-phone').value.trim(),
        email: document.getElementById('seller-email').value.trim(),
        commission: parseFloat(document.getElementById('seller-commission').value),
        status: document.getElementById('seller-status').value
    };
    
    if (index >= 0) {
        sellers[index] = { ...sellers[index], ...data };
    } else {
        sellers.push({ ...data, salesMonth: 0, salesCount: 0 });
    }
    
    closeSellerModal();
    renderSellers();
});

window.openSellerModal = openSellerModal;

window.deleteSeller = (index) => {
    const seller = sellers[index];
    if (confirm(`¿Eliminar al vendedor "${seller.name}"?`)) {
        sellers.splice(index, 1);
        renderSellers();
    }
};

// Renderizar vendedores cuando se active la vista
const originalNavHandler = navLinks;
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (link.dataset.view === 'sellers') {
            setTimeout(() => renderSellers(), 50);
        }
    });
});
