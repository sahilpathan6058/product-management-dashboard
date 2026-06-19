CREATE DATABASE product_dashboard;

use product_dashboard;

CREATE TABLE users(
 id INT PRIMARY KEY AUTO_INCREMENT,
 username VARCHAR(100),
 password VARCHAR(255),
 role ENUM('admin','user')
);

CREATE TABLE products(
 id INT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(255),
 price DECIMAL(10,2),
 category VARCHAR(100),
 createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users(username,password,role)
VALUES
('admin','admin123','admin'),
('user','user123','user');

INSERT INTO products (name, price, category) VALUES
('Wireless Earbuds', 1299.00, 'Electronics'),
('Running Shoes', 2499.00, 'Sports'),
('Cotton T-Shirt', 499.00, 'Clothing'),
('Smartphone Stand', 349.00, 'Electronics'),
('Protein Bar', 89.00, 'Food'),
('Yoga Mat', 799.00, 'Sports'),
('Bluetooth Speaker', 1599.00, 'Electronics'),
('Formal Shirt', 1199.00, 'Clothing'),
('Laptop Bag', 899.00, 'Accessories'),
('Water Bottle', 299.00, 'Fitness'),
('Mechanical Keyboard', 2199.00, 'Electronics'),
('Wireless Mouse', 699.00, 'Electronics'),
('Track Pants', 999.00, 'Clothing'),
('Gym Gloves', 399.00, 'Fitness'),
('Football', 799.00, 'Sports'),
('Notebook Pack', 199.00, 'Stationery'),
('Desk Lamp', 649.00, 'Home'),
('Coffee Mug', 249.00, 'Home'),
('Phone Charger', 599.00, 'Electronics'),
('Backpack', 1499.00, 'Accessories');
