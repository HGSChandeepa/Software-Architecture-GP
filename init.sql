-- Shared database schema for Colombo International Bookfair

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('VENDOR', 'EMPLOYEE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stalls (
    id SERIAL PRIMARY KEY,
    stall_code VARCHAR(10) UNIQUE NOT NULL,
    size VARCHAR(20) NOT NULL CHECK (size IN ('small', 'medium', 'large')),
    is_reserved BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stall_id INTEGER REFERENCES stalls(id) ON DELETE CASCADE,
    qr_code VARCHAR(36) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stall_id)
);

-- Insert sample stalls
INSERT INTO stalls (stall_code, size, price) VALUES
('A1', 'small', 5000.00), ('A2', 'small', 5000.00), ('A3', 'small', 5000.00),
('B1', 'medium', 8000.00), ('B2', 'medium', 8000.00), ('B3', 'medium', 8000.00),
('C1', 'large', 12000.00), ('C2', 'large', 12000.00), ('C3', 'large', 12000.00);