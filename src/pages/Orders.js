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
  const [orderDetails, setOrderDetails] = useState({
    orderId: null,
    orderDate: null,
    customerFirstName: "",
    customerLastName: "",
  });
  const [showCustomerPreview, setShowCustomerPreview] = useState(false);
  const [previewProducts, setPreviewProducts] = useState([]);
  const [showCustomerSelection, setShowCustomerSelection] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats as MM/DD/YYYY
  };
  const navigate = useNavigate();

  useEffect(() => {

    fetchCustomers();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("Orders State:", orders); // Debugging
  }, [orders]);

  const fetchOrders = () => {
    axios
      .get('http://localhost:5001/orders')
      .then((response) => {
        console.log("Fetched Orders:", response.data); // Debugging
        const groupedOrders = response.data.reduce((acc, order) => {
          if (!acc[order.order_id]) {
            acc[order.order_id] = {
              ...order,
              products: [], // Initialize an empty products array
            };
          }
          acc[order.order_id].products.push({
            product_id: order.product_id,
            product_name: order.product_name,
            total_amount: order.total_amount,
          });
          return acc;
        }, {});

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
      alert("Please select a customer first.");
      return;
    }

    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    const newOrder = {
      customer_id: selectedCustomer.customer_id,
      products: selectedProducts.map((product) => ({
        product_id: product.product_id,
        quantity: 1, // Default quantity
      })),
    };

    console.log("Submitting Order:", newOrder); // Debugging

    axios
      .post("http://localhost:5001/orders", newOrder)
      .then(() => {
        fetchOrders(); // Refresh orders
        setSelectedProducts([]); // Clear selected products
        alert("Order created successfully!");
      })
      .catch((error) => console.error("Error creating order:", error));
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

  const handleAddClick = () => {
    if (!selectedCustomer) {
      setShowCustomerSelection(true); // Reveal the "Select a Customer" section
      alert("You must add a customer first.");
      return;
    }

    // Additional logic for adding products or proceeding further can go here
  };

  const handleCheckboxChange = (product) => {
    setSelectedProducts((prevProducts) => {
      // Check if product is already selected
      if (prevProducts.some((p) => p.product_id === product.product_id)) {
        // Remove product if already selected
        return prevProducts.filter((p) => p.product_id !== product.product_id);
      } else {
        // Add product if not already selected
        return [...prevProducts, product];
      }
    });
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Orders</h1>

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
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, orderIndex) => (
              <React.Fragment key={orderIndex}>
                <tr
                  style={{
                    backgroundColor: selectedOrder?.order_id === order.order_id ? "#e0e0e0" : "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedOrder(order)} // Set the clicked order as selected
                >
                  <td>{order.order_id}</td>
                  <td>{formatDate(order.order_date)}</td>
                  <td>{order.customer_fName}</td>
                  <td>{order.customer_lName}</td>
                  <td>{order.products[0]?.product_id || "N/A"}</td>
                  <td>{order.products[0]?.product_name || "N/A"}</td>
                  <td>${order.products[0]?.total_amount?.toFixed(2) || "0.00"}</td>
                </tr>
                {order.products.slice(1).map((product, productIndex) => (
                  <tr key={productIndex}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{product.product_id}</td>
                    <td>{product.product_name}</td>
                    <td>${product.total_amount?.toFixed(2)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="button-container">
        <button onClick={handleAddClick}>Add</button>

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
                <th>Select</th>
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
                  onClick={() => setSelectedProducts((prevProducts) => [...prevProducts, product])}
                  style={{
                    backgroundColor: selectedProducts.some((p) => p.product_id === product.product_id)
                      ? '#e0e0e0'
                      : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.some((p) => p.product_id === product.product_id)}
                      onChange={() => handleCheckboxChange(product)}
                    />
                  </td>
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

            // Submit logic
            console.log('Submitting Order:', {
              customer: selectedCustomer,
              products: previewProducts,
            });
            alert('Order submitted successfully!');
            setSelectedCustomer(null);
            setSelectedProducts([]);
            setPreviewProducts([]);
          }}
        >
          Submit Order
        </button>

      </div>

    </div>
  );
}

export default Orders;