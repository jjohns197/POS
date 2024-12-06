    import React, { useState, useEffect } from 'react';
    import axios from 'axios';

    const Receipts = () => {
        const [receipts, setReceipts] = useState([]);
        const [employees, setEmployees] = useState([]);
        const [customers, setCustomers] = useState([]);
        const [products, setProducts] = useState([]);
        const [selectedReceipt, setSelectedReceipt] = useState(null);
        const [loading, setLoading] = useState(true);

        // Fetch all necessary data on component mount
        useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const [receiptsRes, employeesRes, customersRes, productsRes] = await Promise.all([
                        axios.get('http://localhost:5001/Receipts'),
                        axios.get('http://localhost:5001/employees'),
                        axios.get('http://localhost:5001/Customers'),
                        axios.get('http://localhost:5001/Product'),
                    ]);
                    setReceipts(receiptsRes.data);
                    setEmployees(employeesRes.data);
                    setCustomers(customersRes.data);
                    setProducts(productsRes.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, []);

        const handleRowSelection = (receipt) => {
            setSelectedReceipt(receipt);
        };

        const handleDelete = () => {
            if (!selectedReceipt) {
                alert('Please select a receipt to delete.');
                return;
            }
        
            if (!selectedReceipt.order_id) {
                alert('This receipt has no associated order.');
                return;
            }
        
            if (!window.confirm('Are you sure you want to delete this order and its associated receipt?')) {
                return;
            }
        
            axios
                .delete(`http://localhost:5001/orders/${selectedReceipt.order_id}`)
                .then(() => {
                    alert('Order and associated receipt deleted successfully');
                    fetchReceipts(); // Refresh receipts after deletion
                    setSelectedReceipt(null); // Clear selection
                })
                .catch((error) => {
                    console.error('Error deleting order and receipt:', error);
                    alert('Failed to delete the order and receipt. Please try again.');
                });
        };

        // Extract associated data for the selected receipt
        const getAssociatedDetails = () => {
            if (!selectedReceipt) return null;

            const employee = employees.find((emp) => emp.employee_id === selectedReceipt.employee_id);
            const customer = customers.find((cust) => cust.customer_id === selectedReceipt.customer_id);
            const additionalProducts = products.filter(
                (product) => product.order_id === selectedReceipt.order_id // Assuming order_id is in the Product table
            );

            return { employee, customer, additionalProducts };
        };
        
        const fetchReceipts = () => {
            axios
                .get('http://localhost:5001/Receipts')
                .then((response) => setReceipts(response.data))
                .catch((error) => console.error('Error fetching receipts:', error));
        };
        
        // Call fetchReceipts when the component mounts
        useEffect(() => {
            fetchReceipts();
        }, []);

        const associatedDetails = getAssociatedDetails();

        return (
            <div className="receipts-page">
                <h1 style={{ textAlign: 'center' }}>Receipts</h1>
                {loading ? (
                    <p>Loading receipts...</p>
                ) : (
                    <table border="1" style={{ width: '100%', textAlign: 'center' }}>
                        <thead>
                            <tr>
                                <th>Receipt ID</th>
                                <th>Employee ID</th>
                                <th>Customer ID</th>
                                <th>Receipt Date</th>
                                <th>Total Amount</th>
                                <th>Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                        {receipts.map((receipt) => (
                            <tr
                                key={receipt.receipt_id}
                                onClick={() => setSelectedReceipt(receipt)}
                                style={{
                                        backgroundColor: selectedReceipt?.receipt_id === receipt.receipt_id ? 'lightgray' : 'white',
                                        cursor: 'pointer',
                        }}
        >
                            <td>{receipt.receipt_id}</td>
                            <td>{receipt.employee_id}</td>
                            <td>{receipt.customer_id}</td>
                            <td>{receipt.receipt_date}</td>
                            <td>${receipt.total_amt.toFixed(2)}</td>
                            <td>{receipt.order_id}</td>
                             </tr>
                            ))}
                        </tbody>
                        </table>
                    )}

                {selectedReceipt && associatedDetails && (
                    <div style={{ marginTop: '20px' }}>
                        <h2>Receipt Details</h2>
                        <p><strong>Receipt ID:</strong> {selectedReceipt.receipt_id}</p>
                        <p>
                            <strong>Employee:</strong>{' '}
                            {associatedDetails.employee
                                ? `${associatedDetails.employee.employee_fName} ${associatedDetails.employee.employee_lName}`
                                : 'Not Found'}
                        </p>
                        <p>
                            <strong>Customer:</strong>{' '}
                            {associatedDetails.customer
                                ? `${associatedDetails.customer.customer_fName} ${associatedDetails.customer.customer_lName}`
                                : 'Not Found'}
                        </p>
                        <p><strong>Receipt Date:</strong> {selectedReceipt.receipt_date}</p>
                        <p><strong>Total Amount:</strong> ${selectedReceipt.total_amt.toFixed(2)}</p>
                        <p><strong>Order ID:</strong> {selectedReceipt.order_id}</p>


                        <button
                            onClick={handleDelete}
                            style={{
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            marginTop: '10px',
                        }}
                        >Delete Receipt
                        </button>
                    </div>
                )}
            </div>
        );
    };

    export default Receipts;