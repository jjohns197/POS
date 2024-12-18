import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    customer_fName: '',
    customer_lName: '',
    customer_email: '',
    customer_phone: ''
  });
  const [editCustomer, setEditCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch all customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('http://localhost:5001/Customers')
      .then(response => setCustomers(response.data))
      .catch(error => console.error('Error fetching customers:', error));
  };

  // Add a new customer
  const addCustomer = () => {
    axios.post('http://localhost:5001/Customers', newCustomer)
      .then(response => {
        setCustomers([...customers, response.data]);
        setNewCustomer({ customer_fName: '', customer_lName: '', customer_email: '', customer_phone: '' });
      })
      .catch(error => console.error('Error adding customer:', error));
  };

  // Update an existing customer
  const updateCustomer = () => {
    if (!selectedCustomer) return;
    axios.put(`http://localhost:5001/Customers/${selectedCustomer.customer_id}`, editCustomer)
      .then(response => {
        const updatedCustomers = customers.map(customer =>
          customer.customer_id === selectedCustomer.customer_id ? response.data : customer
        );
        setCustomers(updatedCustomers);
        setEditCustomer(null);
        setSelectedCustomer(null);
      })
      .catch(error => console.error('Error updating customer:', error));
  };

  // Delete a customer
  const deleteCustomer = () => {
    if (!selectedCustomer) return;
    axios.delete(`http://localhost:5001/Customers/${selectedCustomer.customer_id}`)
      .then(() => {
        setCustomers(customers.filter(customer => customer.customer_id !== selectedCustomer.customer_id));
        setSelectedCustomer(null);
      })
      .catch(error => console.error('Error deleting customer:', error));
  };

  return (
    <div className="customers-container">
      <h1 style={{ textAlign: 'center' }}>Customers</h1>

      {/* Live Preview Section */}
      <div className="customer-preview">
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr
                key={customer.customer_id}
                onClick={() => setSelectedCustomer(customer)}
                style={{ backgroundColor: selectedCustomer?.customer_id === customer.customer_id ? '#e0e0e0' : 'transparent' }}
              >
                <td>{customer.customer_id}</td>
                <td>{customer.customer_fName}</td>
                <td>{customer.customer_lName}</td>
                <td>{customer.customer_email}</td>
                <td>{customer.customer_phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* Action Buttons */}
      <div className="button-container">
        <button className = "add-button" onClick={() => setNewCustomer({ customer_fName: '', customer_lName: '', customer_email: '', customer_phone: '' })}>Add Customer</button>
        <button className = "update-button" onClick={() => setEditCustomer(selectedCustomer)}>Update Customer</button>
        <button className = "delete-button" onClick={deleteCustomer}>Delete Customer</button>
      </div>

      {/* Modals for Adding/Updating */}
      {newCustomer && (
        <div className="modal">
          <h3>Add Customer</h3>
          <input type="text" placeholder="First Name" value={newCustomer.customer_fName} onChange={(e) => setNewCustomer({ ...newCustomer, customer_fName: e.target.value })} />
          <input type="text" placeholder="Last Name" value={newCustomer.customer_lName} onChange={(e) => setNewCustomer({ ...newCustomer, customer_lName: e.target.value })} />
          <input type="email" placeholder="Email" value={newCustomer.customer_email} onChange={(e) => setNewCustomer({ ...newCustomer, customer_email: e.target.value })} />
          <input type="text" placeholder="Phone" value={newCustomer.customer_phone} onChange={(e) => setNewCustomer({ ...newCustomer, customer_phone: e.target.value })} />
          <button className="add-button" onClick={addCustomer}>Submit</button>
          <button className="delete-button" onClick={() => setNewCustomer(null)}>Close</button>
        </div>
      )}

      {editCustomer && (
        <div className="modal">
          <h3>Update Customer</h3>
          <input type="text" placeholder="First Name" value={editCustomer.customer_fName} onChange={(e) => setEditCustomer({ ...editCustomer, customer_fName: e.target.value })} />
          <input type="text" placeholder="Last Name" value={editCustomer.customer_lName} onChange={(e) => setEditCustomer({ ...editCustomer, customer_lName: e.target.value })} />
          <input type="email" placeholder="Email" value={editCustomer.customer_email} onChange={(e) => setEditCustomer({ ...editCustomer, customer_email: e.target.value })} />
          <input type="text" placeholder="Phone" value={editCustomer.customer_phone} onChange={(e) => setEditCustomer({ ...editCustomer, customer_phone: e.target.value })} />
          <button className="update-button" onClick={updateCustomer}>Update</button>
          <button className= "delete-button" onClick={() => setEditCustomer(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Customers;