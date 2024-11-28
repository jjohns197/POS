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
  const { customer_id, products } = req.body;

  console.log('Received customer_id:', customer_id);
  console.log('Received products:', products); // Log this to debug

  if (!customer_id || !products || products.length === 0) {
    return res.status(400).json({ error: "Missing required data" });
  }

  const invalidProduct = products.find(
    (product) => !product.product_id || typeof product.quantity !== 'number'
  );

  if (invalidProduct) {
    return res.status(400).json({ error: "Invalid product data in the request" });
  }

  // Insert new order
  const insertOrderQuery = `
      INSERT INTO orders (order_date, customer_id)
      VALUES (NOW(), ?)
  `;

  db.query(insertOrderQuery, [customer_id], (err, orderResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create order" });
    }

    const orderId = orderResult.insertId;

    // Insert products for the order
    const insertProductsQuery = `
          INSERT INTO order_products (order_id, product_id, quantity)
          VALUES ?
      `;

    const productValues = products.map(product => [orderId, product.product_id, product.quantity]);

    db.query(insertProductsQuery, [productValues], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add products to order" });
      }

      res.status(201).json({ message: "Order created successfully", orderId });
    });
  });
});
// Get all orders
app.get('/orders', (req, res) => {
  const query = `
  SELECT 
  o.order_id, 
  o.order_date, 
  c.customer_fName, 
  c.customer_lName, 
  op.product_id, 
  p.product_name, 
  p.price * IFNULL(op.quantity, 1) AS total_amount
FROM orders o
JOIN customer c ON o.customer_id = c.customer_id
LEFT JOIN order_products op ON o.order_id = op.order_id
LEFT JOIN product p ON op.product_id = p.product_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch orders" });
    } else {
      res.status(200).json(results);
    }
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

app.get('/Customers', (req, res) => {
  const query = 'SELECT * FROM customer';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch customers" });
    } else {
      res.status(200).json(results);
    }
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
      res.status(500).json({ error: "Failed to fetch products" });
    } else {
      res.status(200).json(results);
    }
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

//Employees//

app.get('/employees', (req, res) => {
  const sql = 'SELECT * FROM Employee';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).send('Error fetching employees');
    } else {
      res.json(results);
    }
  });
});

app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { employee_fName, employee_lName, employee_dob, dept_id } = req.body;
  const sql = `
    UPDATE Employee
    SET employee_fName = ?, employee_lName = ?, employee_dob = ?, dept_id = ?
    WHERE employee_id = ?
  `;
  db.query(sql, [employee_fName, employee_lName, employee_dob, dept_id, id], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      res.status(500).send('Error updating employee');
    } else {
      res.send({ message: 'Employee updated successfully' });
    }
  });
});

app.post('/employees', (req, res) => {
  const { employee_fName, employee_lName, employee_dob, dept_id } = req.body;
  const sql = `
    INSERT INTO Employee (employee_fName, employee_lName, employee_dob, dept_id)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [employee_fName, employee_lName, employee_dob, dept_id], (err, result) => {
    if (err) {
      console.error('Error adding employee:', err);
      res.status(500).send('Error adding employee');
    } else {
      res.status(200).send({ message: 'Employee added successfully', employeeId: result.insertId });
    }
  });
});

app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Employee WHERE employee_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send('Error deleting employee');
    } else {
      res.send({ message: 'Employee deleted successfully' });
    }
  });
});

//Department//

app.get('/departments', (req, res) => {
  const sql = 'SELECT * FROM Department';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching departments:', err);
      res.status(500).send('Error fetching departments');
    } else {
      res.json(results);
    }
  });
});

app.delete('/departments/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Department WHERE dept_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting department:', err);
      res.status(500).send('Error deleting department');
    } else {
      res.send({ message: 'Department deleted successfully' });
    }
  });
});

app.post('/departments', (req, res) => {
  const { dept_name, dept_phone } = req.body;
  if (!dept_name || !dept_phone) {
    return res.status(400).send('Missing required fields');
  }
  const sql = 'INSERT INTO Department (dept_name, dept_phone) VALUES (?, ?)';
  db.query(sql, [dept_name, dept_phone], (err, result) => {
    if (err) {
      console.error('Error adding department:', err);
      res.status(500).send('Error adding department');
    } else {
      res.status(200).send({ message: 'Department added successfully', deptId: result.insertId });
    }
  });
});

app.put('/departments/:id', (req, res) => {
  const { id } = req.params;
  const { dept_name, dept_phone } = req.body;
  if (!dept_name || !dept_phone) {
    return res.status(400).send('Missing required fields');
  }
  const sql = 'UPDATE Department SET dept_name = ?, dept_phone = ? WHERE dept_id = ?';
  db.query(sql, [dept_name, dept_phone, id], (err, result) => {
    if (err) {
      console.error('Error updating department:', err);
      res.status(500).send('Error updating department');
    } else {
      res.send({ message: 'Department updated successfully' });
    }
  });
});

//Receipts//

app.get('/Receipts', (req, res) => {
  const query = `
    SELECT 
      r.receipt_id,
      r.employee_id,
      e.employee_fName,
      e.employee_lName,
      r.customer_id,
      c.customer_fName,
      c.customer_lName,
      r.receipt_date,
      r.total_amt
    FROM receipts r
    JOIN Employee e ON r.employee_id = e.employee_id
    JOIN Customer c ON r.customer_id = c.customer_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch receipts" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Submit order and create receipt
app.post('/submit-order', (req, res) => {
  const { total_amount, employee_id, customer_id, selectedProducts } = req.body;

  if (!total_amount || !employee_id || !customer_id) {
    return res.status(400).json({ error: "Missing required data" });
  }

  const receiptDate = new Date().toISOString().split('T')[0];

  const receiptQuery = `
    INSERT INTO receipts (employee_id, customer_id, receipt_date, total_amt)
    VALUES (?, ?, ?, ?)
  `;

  db.query(receiptQuery, [employee_id, customer_id, receiptDate, total_amount], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create receipt" });
    }

    const receiptId = result.insertId;

    if (selectedProducts && selectedProducts.length > 0) {
      const orderValues = selectedProducts.map(product => [receiptId, product.product_id, product.price]);

      const orderQuery = `
        INSERT INTO order_products (receipt_id, product_id, product_price)
        VALUES ?
      `;

      db.query(orderQuery, [orderValues], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to add products to order" });
        }

        res.status(201).json({ message: "Order submitted successfully", receiptId });
      });
    } else {
      res.status(201).json({ message: "Order submitted successfully", receiptId });
    }
  });
});

app.listen(5001, () => {
  console.log('Server running on port 5001');
});