import React from "react";

const Instructions = () => {
  return (
    <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Instructions</h1>

      <section style={{ marginBottom: "20px" }}>
        <h2>Department</h2>
        <p>
          This page is dedicated to creating a department for a company,
          organization, etc. This is a pivotal page. The ‘POS System’ will not
          allow you to create or update an employee unless that employee is
          enlisted in a created department. After the successful creation of a
          department, you can proceed to create an established employee.
        </p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Employee</h2>
        <p>
          The employee page is where you can add or delete an employee. Deleting
          an employee is simple: select the employee that you no longer want and
          hit the delete button. The employee will be removed from the ‘live
          preview’ table and the MySQL database. To add an employee:
        </p>
        <ol>
          <li>
            <strong>Select Department:</strong> Choose a department from the
            dropdown, created earlier on the Department page.
          </li>
          <li>
            <strong>Add Employee:</strong> Enter the first name, last name, and
            date of birth. For now, contact details are omitted for future
            iterations. Hit ‘add employee’ to populate the new entry in the
            ‘Employee List’.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Reports</h2>
        <p>
          The reports page is for monitoring employees. Add short notes about
          an individual employee (limited to 100 characters for now). You can
          also delete reports.
        </p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Products</h2>
        <p>
          Add, update, or delete a product. Changes update the ‘product preview
          table’ and the MySQL database. Refresh the page to view live updates.
        </p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Customers</h2>
        <p>
          Add, update, or delete customers, providing first name, last name,
          email, and phone number. All actions are linked to a MySQL database.
          Note: Orders require at least one customer and product.
        </p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Orders</h2>
        <p>
          Add or delete orders. Deleted orders are removed from associated
          pages and MySQL. To add an order:
        </p>
        <ol>
          <li>Select a customer.</li>
          <li>Select product(s).</li>
          <li>Click ‘add product’ to update the order.</li>
        </ol>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Sales</h2>
        <p>
          Functions like a cart. View and modify orders, add products, select an
          employee, and assign customers. A running total calculates the order
          cost. Submitting sends the order to the Receipts page and MySQL.
        </p>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Receipts</h2>
        <p>
          Displays completed orders with totals. Deleting a receipt removes the
          order from all associated pages and the MySQL database.
        </p>
      </section>
    </div>
  );
};

export default Instructions;
