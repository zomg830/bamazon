DROP DATABASE bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INTEGER(10) PRIMARY KEY AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2),
stock_quantity INTEGER(10) NOT NULL DEFAULT 0,
product_sales DECIMAL(10,2) DEFAULT 0
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Sofa', 'Furniture', 329.98, 5);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('iPhone XR (64GB)', 'Electronics', 749.99, 20);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('55" 4K TV', 'Electronics', 781.39, 2);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Umbrella', 'Fashion', 20.95, 100);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Jeans', 'Fashion', 29.99, 9);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Rubiks Cube', 'Toys', 8.99, 50);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Waffle Maker', 'Kitchen', 24.99, 18);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('The Importance of Being Earnest', 'Books', 5.99, 30);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('MicroSD Card', 'Electronics', 29.99, 50);

INSERT INTO products(product_name, department_name, price)
VALUES ('Air Pods', 'Electronics', 159.00);

SELECT * FROM products;