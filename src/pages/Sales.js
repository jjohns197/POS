// Updated Sales.js file to include the requested features
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sales = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formats as MM/DD/YYYY
    };

    // Fetch data on component mount
    useEffect(() => {
        axios.get('http://localhost:5001/orders').then(response => setOrders(response.data));
        axios.get('http://localhost:5001/Product').then(response => setProducts(response.data));
        axios.get('http://localhost:5001/employees').then(response => setEmployees(response.data));
        axios.get('http://localhost:5001/Customers').then(response => setCustomers(response.data));
    }, []);

    useEffect(() => {
        calculateTotalAmount();
    }, [selectedOrder, selectedProducts]);

    // Calculate total dynamically for selected order and products
    const calculateTotalAmount = () => {
        if (!selectedOrder) return 0;

        // Sum total_amount for all rows with the selected order_id
        const orderTotal = orders
            .filter(order => order.order_id === selectedOrder.order_id)
            .reduce((sum, order) => sum + order.total_amount, 0);

        // Sum the prices of any additionally selected products
        const productTotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);

        // Set the total amount
        setTotalAmount(orderTotal + productTotal);
    };

    // Submit order
    const handleSubmitOrder = () => {
        if (!selectedOrder || !selectedEmployee || !selectedCustomer) {
            alert('Please select all required fields before submitting.');
            return;
        }

        calculateTotalAmount();

        const data = {
            total_amount: totalAmount,
            employee_id: selectedEmployee.employee_id,
            customer_id: selectedCustomer.customer_id,
            selectedProducts: selectedProducts.map(product => ({
                product_id: product.product_id,
                price: product.price,
            })),
        };

        axios.post('http://localhost:5001/submit-order', data)
            .then(response => {
                alert('Order submitted successfully');
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error submitting order:', error);
            });
    };

    return (
        <div className="sales-page">
            <h1 style={{ textAlign: 'center' }}>Sales</h1>

            {/* Order Preview Table */}
            <h2>Order Preview</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Customer First Name</th>
                        <th>Customer Last Name</th>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr
                            key={order.order_id}
                            onClick={() => setSelectedOrder(order)}
                            style={{ backgroundColor: selectedOrder?.order_id === order.order_id ? 'lightgray' : 'white' }}
                        >
                            <td>{order.order_id}</td>
                            <td>{formatDate(order.order_date)}</td>
                            <td>{order.customer_fName}</td>
                            <td>{order.customer_lName}</td>
                            <td>{order.product_id || "N/A"}</td>
                            <td>{order.product_name || "N/A"}</td>
                            <td>{order.total_amount}</td>
                        </tr>

                    ))}
                </tbody>
            </table>

            {/* Product Selection Dropdown */}
            <h2>Select Additional Products</h2>
            <select
                onChange={e => {
                    const product = products.find(p => p.product_id === parseInt(e.target.value));
                    if (product) setSelectedProducts([...selectedProducts, product]);
                }}
            >
                <option value="">Select a product</option>
                {products.map(product => (
                    <option key={product.product_id} value={product.product_id}>
                        {product.product_name} - ${product.price}
                    </option>
                ))}
            </select>

            <ul>
                {selectedProducts.map((product, index) => (
                    <li key={index}>{product.product_name} - ${product.price}</li>
                ))}
            </ul>

            {/* Employee Preview Table */}
            <h2>Select Employee</h2>
            <select onChange={e => setSelectedEmployee(employees.find(emp => emp.employee_id === parseInt(e.target.value)))}>
                <option value="">Select an employee</option>
                {employees.map(employee => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                        {employee.employee_fName} {employee.employee_lName}
                    </option>
                ))}
            </select>

            {/* Customer Selection Dropdown */}
            <h2>Which customer picked up the order ? </h2>
            <select onChange={e => setSelectedCustomer(customers.find(cust => cust.customer_id === parseInt(e.target.value)))}>
                <option value="">Select a customer</option>
                {customers.map(customer => (
                    <option key={customer.customer_id} value={customer.customer_id}>
                        {customer.customer_fName} {customer.customer_lName}
                    </option>
                ))}
            </select>

            {/* Total Amount and Submit Button */}
            <h2>Total Amount: ${totalAmount.toFixed(2)}</h2>
            <button onClick={() => {
                calculateTotalAmount();
                handleSubmitOrder();
            }}>Submit Order</button>
        </div>
    );
};

export default Sales;
