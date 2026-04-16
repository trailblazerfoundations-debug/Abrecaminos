# 🌿 Vivero Abre Caminos - Sistema de Gestión ERP & Storefront

Sistema integral de gestión para viveros de gran escala, optimizado para rendimiento local y cumplimiento de la normativa fiscal de Honduras (SAR).

## 🚀 Descripción
Este proyecto combina una interfaz de cliente moderna (Storefront) con un panel administrativo potente (ERP) para gestionar inventario, ventas y cumplimiento tributario. Diseñado con una estética orgánica y premium, el sistema facilita la operación diaria mientras asegura la integridad financiera.

## 🛠️ Tecnologías Utilizamos
- **Frontend:** Vanilla JS, HTML5, CSS3 (Custom Design System).
- **Backend/Logic:** Python (Scripts de gestión de datos) / JavaScript Modular.
- **Base de Datos:** SQLite (Relacional) estructurada para auditorías.
- **UI/UX:** Lucide Icons, Chart.js, Google Fonts (Outfit & Inter).

## 📦 Módulos Principales

### 1. Storefront (Cliente)
- Catálogo dinámico con filtros por categoría.
- Carrito de compras persistente a través de sesiones.
- Integración nativa con WhatsApp para consultas instantáneas de productos.

### 2. Panel Administrativo (ERP)
- **Dashboard:** Visualización de ventas, productos top y métricas clave.
- **Inventario:** Control de existencias con alertas de stock bajo.
- **Vendedores:** Registro de ventas y cálculo automático de comisiones.

### 3. Módulo Fiscal (SAR Honduras)
- Cálculo automático de **ISV (15%)** y manejo de productos **Exentos**.
- Gestión de configuración fiscal: **CAI**, rango de facturación y fecha límite.
- Validación de RTN obligatorio para compras mayores a L. 10,000.

## ⚙️ Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone [URL-DEL-REPOSITORIO]
   cd vivero-abre-caminos
   ```

2. **Configurar el entorno:**
   - Copia el archivo `.env.example` a `.env` y completa tus datos:
     ```bash
     cp .env.example .env
     ```

3. **Inicializar la Base de Datos:**
   - Asegúrate de tener Python instalado y ejecuta:
     ```bash
     python3 init_db.py
     ```

4. **Ejecutar la Plataforma:**
   - Puedes usar cualquier servidor local (XAMPP/Docker) o el servidor integrado de Python:
     ```bash
     python3 -m http.server 8000 --directory public
     ```

## 🔐 Seguridad
Los archivos de base de datos (`.db`), configuraciones locales (`.env`) y temporales están excluidos del repositorio para proteger la integridad y privacidad de la operación.

---
*Desarrollado con ❤️ para Fundación y Vivero Abre Caminos.*
