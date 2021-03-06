# bamazon

# Introduction

This program was designed to mimic an Amazon-like storefront with MySQL integration. The app takes in orders from customers and depletes the stock from the store's inventory. Depending on the program that is run (either bamazonCustomer.js or bamazonManager.js) there will be different functionalities that will be utilized.

# bamazonCustomer.js Demonstration

To begin, simply run the command `node bamazonCustomer.js to start the application. The first page seen is a welcome page that requires user input to progress. Refer to the gif below to see a simple demonstration of ordering a product that is in stock.

  <p align="center">
  <img height="640" width="500" src="/videos/customerOrder.gif">
  </p>
  
  In the case that an order is placed without any stock available, the program will inform the user of such a case.
  
  <p align="center">
  <img height="640" width="500" src="/videos/orderFail.gif">
  </p>
  
  # bamazonManager.js Demonstration

In the previous demo, the user attempted to order a product that was not in stock. In the bamazonManager file, there is functionality built in to replenish stock for items.

  <p align="center">
  <img height="640" width="500" src="/videos/managerInventory.gif">
  </p>
  
  The manager file also has the functionality to add a new product to the storefront, as shown below.
  
   <p align="center">
  <img height="640" width="500" src="/videos/managerProduct.gif">
  </p>
  
  # Dependencies
  * dotenv
  * mysql
  * inquirer
