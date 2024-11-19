const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());  // Allows us to parse JSON in request bodies

// MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'pos',  // Replace with your MySQL user
  password: 'jjohns198',  // Replace with your MySQL password
  database: 'pos_system'  // Replace with your database name
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

//Orders crud

// Create a new order
app.post('/orders', (req, res) => {
  const { order_date, customer_id, total_amount, products } = req.body; // `products` is an array of product IDs

  // Log the request data for debugging
  console.log('Order data received:', { order_date, customer_id, total_amount, products });

  if (!order_date || !customer_id || !total_amount || !Array.isArray(products)) {
    return res.status(400).send('Invalid request data');
  }

  // Insert the order into the `orders` table
  const sqlOrder = 'INSERT INTO `orders` (order_date, customer_id, total_amount) VALUES (?, ?, ?)';
  db.query(sqlOrder, [order_date, customer_id, total_amount], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).send('Error creating order');
    }

    const orderId = result.insertId; // Get the newly created order's ID

    // Insert products into the `order_products` table
    const sqlOrderProduct = 'INSERT INTO `order_products` (order_id, product_id) VALUES (?, ?)';
    products.forEach((productId) => {
      db.query(sqlOrderProduct, [orderId, productId], (err) => {
        if (err) console.error(`Error inserting product (${productId}):`, err);
      });
    });

    res.status(201).send('Order created successfully');
  });
});

// Get all orders
app.get('/orders', (req, res) => {
  const sql = `
      SELECT 
          orders.order_id, 
          orders.order_date, 
          customer.customer_fName, 
          customer.customer_lName, 
          product.product_id, 
          product.product_name, 
          orders.total_amount
      FROM orders
      LEFT JOIN customer ON orders.customer_id = customer.customer_id
      LEFT JOIN order_products ON orders.order_id = order_products.order_id
      LEFT JOIN product ON order_products.product_id = product.product_id;
  `;
  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching orders:', err);
          return res.status(500).send('Error fetching orders');
      }
      res.status(200).json(result);
  });
});

app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { order_date, customer_id, total_amount, product_id, customer_fName, customer_lName, product_name } = req.body;

  const sql = 'UPDATE `orders` SET order_date = ?, customer_id = ?, total_amount = ?, product_id = ?, customer_fName = ?, customer_lName = ?, product_name = ? WHERE order_id = ?';
  db.query(sql, [order_date, customer_id, total_amount, product_id, customer_fName, customer_lName, product_name, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating order');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Order not found');
    }
    res.status(200).send('Order updated');
  });
});

// Delete an order
app.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  // First, delete all rows in `order_products` that reference the order
  const deleteOrderProductsQuery = 'DELETE FROM `order_products` WHERE `order_id` = ?';
  db.query(deleteOrderProductsQuery, [orderId], (err) => {
    if (err) {
      console.error('Error deleting related order products:', err);
      return res.status(500).send('Error deleting related products');
    }

    // Then, delete the order itself
    const deleteOrderQuery = 'DELETE FROM `orders` WHERE `order_id` = ?';
    db.query(deleteOrderQuery, [orderId], (err) => {
      if (err) {
        console.error('Error deleting order:', err);
        return res.status(500).send('Error deleting order');
      }
      res.status(200).send('Order deleted successfully');
    });
  });
});

//Orders stop

//Customers CRUD

//Create(post): Insert a new customer
app.post('/Customers', (req, res) => {
  const { customer_fName, customer_lName, customer_email, customer_phone } = req.body;

  const query = 'INSERT INTO customer (customer_fName, customer_lName, customer_email, customer_phone) VALUES (?, ?, ?, ?)';
  db.query(query, [customer_fName, customer_lName, customer_email, customer_phone], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create customer' });
    }
    res.status(201).json({ message: 'Customer created successfully', customerId: result.insertId });
  });
})

//Read(get): Get all customers:
app.get('/Customers', (req, res) => {
  const query = 'SELECT * FROM customer';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch customers' });
    }
    res.status(200).json(results);
  });
});

//Read (Get): Get a customer by customer_id
app.get('/Customers/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM customer WHERE customer_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch customer' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(result[0]);
  });
});

//Update(Put): Update a customer
app.put('/Customers/:id', (req, res) => {
  const { id } = req.params;
  const { customer_fName, customer_lName, customer_email, customer_phone } = req.body;

  const query = 'UPDATE customer SET customer_fName = ?, customer_lName = ?, customer_email = ?, customer_phone = ? WHERE customer_id = ?';
  db.query(query, [customer_fName, customer_lName, customer_email, customer_phone, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update customer' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer updated successfully' });
  });
});

//Delete(delete): Delete a cusomter:
app.delete('/Customers/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM customer WHERE customer_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete customer' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  });
});

// CRUD for Products

// Create a new product
app.post('/Product', (req, res) => {
  const { product_name, price, product_quantity, product_descr } = req.body;
  const query = 'INSERT INTO Product (product_name, price, product_quantity, product_descr) VALUES (?, ?, ?, ?)';
  db.query(query, [product_name, price, product_quantity, product_descr], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create product' });
    }
    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  });
});

// Read all products
app.get('/Product', (req, res) => {
  const query = 'SELECT * FROM Product';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.status(200).json(results);
  });
});

// Read a single product by ID
app.get('/Product/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Product WHERE product_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(result[0]);
  });
});

// Update a product
app.put('/Product/:id', (req, res) => {
  const { id } = req.params;
  const { product_name, price, product_quantity, product_descr } = req.body;
  const query = 'UPDATE product SET product_name = ?, price = ?, product_quantity = ?, product_descr = ? WHERE product_id = ?';
  db.query(query, [product_name, price, product_quantity, product_descr, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update product' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

// Delete a product
app.delete('/Product/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Product WHERE product_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  });
});


app.listen(5001, () => {
  console.log('Server running on port 5001');
});