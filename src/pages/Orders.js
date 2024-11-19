    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';

    function Orders() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showCustomerPreview, setShowCustomerPreview] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchOrders = () => {
        axios
            .get('http://localhost:5001/orders')
            .then((response) => {
                // Group orders by order_id
                const groupedOrders = response.data.reduce((acc, order) => {
                    if (!acc[order.order_id]) {
                        acc[order.order_id] = {
                            ...order,
                            products: [], // Initialize an empty products array
                        };
                    }
                    // Push product details into the products array
                    acc[order.order_id].products.push({
                        product_id: order.product_id,
                        product_name: order.product_name,
                    });
                    return acc;
                }, {});
    
                // Convert grouped orders from an object to an array
                setOrders(Object.values(groupedOrders));
            })
            .catch((error) => console.error('Error fetching orders:', error));
    };

    const fetchCustomers = () => {
        axios
        .get('http://localhost:5001/Customers')
        .then((response) => setCustomers(response.data))
        .catch((error) => console.error('Error fetching customers:', error));
    };

    const fetchProducts = () => {
        axios
        .get('http://localhost:5001/Product')
        .then((response) => setProducts(response.data))
        .catch((error) => console.error('Error fetching products:', error));
    };

    const handleAddProduct = () => {
        if (!selectedCustomer) {
          alert('Please select a customer first.');
          return;
        }
      
        if (!selectedProducts) {
          alert('Please select a product to add.');
          return;
        }
      
        const newOrder = {
          order_date: new Date().toISOString().split('T')[0],
          customer_id: selectedCustomer.customer_id,
          total_amount: selectedProducts.price,
          products: [selectedProducts.product_id],
        };
      
        axios
          .post('http://localhost:5001/orders', newOrder)
          .then(() => {
            fetchOrders(); // Refresh orders
            fetchProducts(); // Refresh product list
            setSelectedProducts([]); // Clear selected products
            alert('Product added to the order successfully!');
          })
          .catch((error) => console.error('Error adding product to the order:', error));
      };

    
    const handleDeleteOrder = () => {
        if (!selectedOrder) {
        alert('Please select an order to delete.');
        return;
        }

        axios
        .delete(`http://localhost:5001/orders/${selectedOrder.order_id}`)
        .then(() => {
            fetchOrders();
            setSelectedOrder([]);
            alert('Order deleted successfully');
        })
        .catch((error) => console.error('Error deleting order:', error));
    };

    return (
        <div>
        <h2 style={{ textAlign: 'center' }}>Orders</h2>

        {/* Live Orders Preview */}
        <div className="order-preview">

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
        style={{
            backgroundColor:
            selectedOrder?.order_id === order.order_id ? '#e0e0e0' : 'transparent',
        }}
        >
            <td>{order.order_id}</td>
            <td>{order.order_date || 'N/A'}</td>
            <td>{order.customer_fName || 'N/A'}</td>
            <td>{order.customer_lName || 'N/A'}</td>
            <td>{order.product_id || 'N/A'}</td>
            <td>{order.product_name || 'N/A'}</td>
            <td>${order.total_amount}</td>
        </tr>
        ))}
    </tbody>
    </table>
        </div>

        {/* Action Buttons */}
        <div className="button-container">
            <button onClick={() => setShowCustomerPreview(true)}>Add</button>
            
            <button onClick={handleDeleteOrder}>Delete</button>
        </div>


        {/* Customer Selection */}
      <div>
        <h3>Select a Customer</h3>
        <select
          onChange={(e) =>
            setSelectedCustomer(
              customers.find(
                (customer) => customer.customer_id === parseInt(e.target.value)
              )
            )
          }
        >
          <option value="" disabled selected>
            Select a customer
          </option>
          {customers.map((customer) => (
            <option key={customer.customer_id} value={customer.customer_id}>
              {customer.customer_fName} {customer.customer_lName}
            </option>
          ))}
        </select>
      </div>

        {/* Products Preview Section */}
        {selectedCustomer && (
            <div>
            <h3>Choose a Product to Add</h3>
            <table>
            <thead>
                <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                <tr
                    key={product.product_id}
                    onClick={() => setSelectedProducts(product)}
                    style={{
                    backgroundColor: selectedProducts?.product_id === product.product_id ? '#e0e0e0' : 'transparent',
                    cursor: 'pointer',
                    }}
                >
                    <td>{product.product_id}</td>
                    <td>{product.product_name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.product_quantity}</td>
                </tr>
                ))}
            </tbody>
            </table>
            <button onClick={handleAddProduct}>Add Product</button>
        </div>
        )}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <button
        onClick={() => {
        if (!selectedCustomer || !selectedProducts) {
            alert('Please select a customer and at least one product before submitting.');
            return;
        }

        const finalizedOrder = {
            customer: selectedCustomer,
            product: selectedProducts,
        };

        // Submit logic here
        console.log('Finalizing Order:', finalizedOrder);
        alert('Order submitted successfully!');
        setSelectedCustomer([]);
        setSelectedProducts([]);
        }}
    >
        Submit Order
    </button>
    
    </div>
        
        </div>
    );
    }

    export default Orders;