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


// Callback for retrieving department information from database
function get_departments(data, callback){
    var sql ="SELECT DISTINCT department_name FROM products"

    connection.query(sql, function(err, results){
        if (err) throw err;
        departments = results;

        return callback(results);
    })
}

departments = [];
dept_arr = [];

get_departments(null, function(result){
    departments = result;
    dept_arr = departments.map((el) => {
        return el.department_name;
    })
    return dept_arr
})
// End callback data retrieval


function startPrompt() {
    inquirer.prompt([{
        type: "list",
        name: "manage",
        message: "Please select an application",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "List Departments", "Log off"]
    }]).then(function (user) {
        if (user.manage === "View Products for Sale") {
            viewItems();
        } else if (user.manage === "View Low Inventory") {
            lowInventory();
        } else if (user.manage === "Add to Inventory") {
            selectInventory();
        } else if (user.manage === "Add New Product") {
            addProduct();
        } else if (user.manage === "List Departments") {
            listDepartments();
            setTimeout(startPrompt, 3000)
        } else if (user.manage === "Log off") connection.end();
    });
}

function viewItems() {
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
        Stock: ${el.stock_quantity}
        `)
            })
            startPrompt();
        })
}

function lowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5',
        (error, results, fields) => {
            let products_arr = [];
            results.forEach((el) => {
                products_arr.push(el);
                console.log(`
        Item ID: ${el.item_id}
        Product: ${el.product_name}
        Department: ${el.department_name}
        Price: $${el.price.toFixed(2)}
        Stock Remaining: ${el.stock_quantity}
            `)
            })
            if (products_arr.length === 0) console.log("\nInventory is sufficient\n");
            startPrompt();
        })
}

function selectInventory() {
    connection.query('SELECT * FROM products',
        (error, results, fields) => {
            let products_arr = [];
            results.forEach((el) => {
                products_arr.push(`${el.product_name} -- Stock: ${el.stock_quantity}`);
            })
            addInventory(products_arr)
        })
}

function addInventory(arr) {
    inquirer.prompt([{
        name: "item",
        type: "list",
        choices: arr,
        message: "Select an item to add more inventory"
    }, {
        name: "quantity",
        type: "input",
        message: "Specify an amount to add to inventory",
        validate: function validateBid(num) {
            var reg = /^[+-]?\d+(\.\d+)?$/;
            return (reg.test(num) && num != 0) || "Invalid number!";
        }
    }]).then((answers) => {
        let item = answers.item.slice(0, answers.item.indexOf(' -- '));
        let quantity = answers.quantity;
        confirmInventory(quantity, item)
    })
}

function confirmInventory(num, name) {
    inquirer.prompt([{
        name: "confirm",
        type: "confirm",
        message: `Add ${num} to the stock of ${name}?`
    }]).then((answers) => {
        if (answers.confirm === true) {
            connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?', [num, name], function (error, results, fields) {
                if (error) throw error;
                console.log(`\nAdded ${num} items to stock of ${name}\n`);
                startPrompt();
            });
        } else {
            startPrompt();
        }
    })
}

function addProduct() {
    inquirer.prompt([
        {
            name: "product",
            message: "Enter the product name",
            type: "input"
        }, {
            name: "department",
            message: "Enter the department name",
            type: "list",
            choices: dept_arr
        }, {
            name: "price",
            message: "Enter the selling price",
            type: "input",
            validate: function validateBid(num) {
                var reg = /^[+-]?\d+(\.\d+)?$/;
                return (reg.test(num) && num != 0) || "Invalid number!";
            }
        }]).then(function (answers) {
            let product_name = answers.product; let product_dept = answers.department; let product_price = answers.price;
            confirmProduct(product_name, product_dept, product_price)
        })
}

function confirmProduct(name, dept, price) {
    console.log(`
    Product: ${name}
    Department: ${dept}
    Price: $${price}
    `)
    inquirer.prompt([{
        name: "confirm",
        message: "Add this product to the database?",
        type: "confirm"
    }]).then(function (answers) {
        if (answers.confirm === true) {
            connection.query('INSERT INTO products SET ?', { product_name: `${name}`, department_name: `${dept}`, price: `${price}` }
                , (error, results, fields) => {
                    if (error) throw error;
                    console.log(`\nAdded ${name} to the database\n`);
                })
            setTimeout(startPrompt, 3000);
        } else {
            startPrompt();
        }
    })
}

function listDepartments() {
    dept_arr.forEach((el) => 
        console.log(`        ${el}`)
    )
}