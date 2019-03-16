require('dotenv').config();
const mysql = require('mysql');
const keys = require('./keys');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: `${keys.password.id}`,
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    startPrompt();
});

function startPrompt() {
    inquirer.prompt([{
        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to view our inventory?",
        default: true
    }]).then(function (user) {
        if (user.confirm === true) {
            inventory();
        } else if (user.confirm === false) {
            console.log("\nThank you! Come back soon!\n");
            setTimeout(() => { connection.end() }, 2500);
        }
    });
}

function inventory() {
    connection.query('SELECT * FROM products',
        (error, results, fields) => {
            let products_arr = [];
            results.forEach((el) => {
                products_arr.push(el);
                console.log(`
            Item ID: ${el.item_id}
            Product: ${el.product_name}
            Department: ${el.department_name}
            Price: $${el.price.toFixed(2)}
            `)
            })
            selectOrder(products_arr)
        })
}

function selectOrder(arr) {
    inquirer.prompt([{
        name: "id",
        message: "Please enter the ID of the item you would like to buy",
        type: "input",
        validate: function validateBid(num) {
            var reg = /^[+-]?\d+(\.\d+)?$/;
            return (reg.test(num) && num <= arr.length && num != 0) || "Invalid number!";
        }
    }]).then(function (answers) {
        let chosen_product = arr[answers.id - 1];
        inquirer.prompt([{
            name: "quantity",
            message: `Order ? units of ${chosen_product.product_name}`,
            type: "input",
            validate: function validateBid(num) {
                var reg = /^[+-]?\d+(\.\d+)?$/;
                return (reg.test(num) && num > 0) || "Invalid number!";
            }
        }]).then(function (answers) {
            if (answers.quantity > chosen_product.stock_quantity) {
                console.log(`
            Error: not enough stock to fulfill purchase\n`);
                setTimeout(inventory, 3000);
            } else {
                var order_price = parseFloat((answers.quantity * chosen_product.price));
                var sales_tax = parseFloat((order_price * 0.0825));
                confirmPurchase(order_price, sales_tax, chosen_product.stock_quantity, answers.quantity, chosen_product.product_name, chosen_product.product_sales);
            }
        })
    })
}

function confirmPurchase(subtotal, tax, stock, ordered, name, sales) {
    let total = (subtotal + tax);
    console.log(`
    Summary for your order of ${ordered} ${name}`);
    console.log(`
    Subtotal: $${subtotal.toFixed(2)}
    Sales tax: $${tax.toFixed(2)}
    Order Total: $${total.toFixed(2)}
    `);
    inquirer.prompt([{
        name: "confirm",
        message: "Confirm this order?",
        type: "confirm"
    }]).then((answers) => {
        if (answers.confirm === true) {
            connection.query('UPDATE products SET ? WHERE product_name = ?', [{ stock_quantity: stock - ordered, product_sales: sales + subtotal }, name], function (error, results, fields) {
                if (error) throw error;
            });
            console.log(`
        \nThank you! Your order of ${ordered} ${name} has been placed!\n`);
            startPrompt();
        } else {
            console.log("Thank you for considering Bamazon!");
            startPrompt();
        }
    })

}
