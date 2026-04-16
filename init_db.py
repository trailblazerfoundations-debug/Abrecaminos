import sqlite3
import os

DB_NAME = "vivero_abre_caminos.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Categories
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL
    )
    ''')

    # Products
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        is_exempt INTEGER DEFAULT 0, -- 0: Taxed (15%), 1: Exempt
        category_id INTEGER,
        image_url TEXT,
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )
    ''')

    # Sellers
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sellers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        commission_rate REAL DEFAULT 0.05
    )
    ''')

    # Customers
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        rtn TEXT,
        phone TEXT,
        email TEXT
    )
    ''')

    # Orders (SAR Compliant)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_number TEXT UNIQUE,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        customer_id INTEGER,
        seller_id INTEGER,
        payment_method TEXT, -- Cash, Card, Transfer
        subtotal REALNOT NULL,
        isv_amount REAL NOT NULL,
        total REAL NOT NULL,
        rtn_required INTEGER DEFAULT 0,
        FOREIGN KEY (customer_id) REFERENCES customers (id),
        FOREIGN KEY (seller_id) REFERENCES sellers (id)
    )
    ''')

    # Order Items
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        unit_price REAL,
        isv_rate REAL DEFAULT 0.15,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    )
    ''')

    # Billing Config (SAR)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS billing_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cai TEXT NOT NULL,
        range_start TEXT NOT NULL,
        range_end TEXT NOT NULL,
        current_number INTEGER NOT NULL,
        date_deadline DATE NOT NULL,
        active INTEGER DEFAULT 1
    )
    ''')

    # Seed data
    cursor.execute("INSERT OR IGNORE INTO categories (name, slug) VALUES ('Interior', 'interior'), ('Exterior', 'exterior'), ('Herramientas', 'herramientas'), ('Sustratos', 'sustratos')")
    
    conn.commit()
    conn.close()
    print(f"Database {DB_NAME} initialized successfully.")

if __name__ == "__main__":
    init_db()
