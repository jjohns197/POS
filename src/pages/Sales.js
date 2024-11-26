// SalesPage with Integrated OrderPreview and ProductSelection
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderPreview from './Orders';
import ProductSelection from './Products';
import './SalesPage.css';

function Sales() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [orderTotal, setOrderTotal] = useState(0);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedOrder) {
            setOrderTotal(selectedOrder.total_amount + calculateProductTotal(selectedProducts));
        } else {
            setOrderTotal(0);
        }
    }, [selectedOrder, selectedProducts]);

    const fetchOrders = () => {
        axios
            .get('http://localhost:5001/orders')
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => console.error('Error fetching orders:', error));
    };

    const fetchProducts = () => {
        axios
            .get('http://localhost:5001/products')
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => console.error('Error fetching products:', error));
    };

    const calculateProductTotal = (products) =>
        products.reduce((sum, product) => sum + product.total_amount, 0);

    const handleAddProduct = (product) => {
        setSelectedProducts((prev) => {
            if (!prev.some((p) => p.product_id === product.product_id)) {
                return [...prev, product];
            }
            return prev;
        });
    };

    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
        setSelectedProducts([]); // Clear selected products when a new order is selected
    };

    return (
        <div className="sales-page">
            <h1 className="title">Sales</h1>

            <section className="order-preview">
                <OrderPreview
                    orders={orders}
                    onSelectOrder={handleOrderSelect}
                    selectedOrder={selectedOrder}
                />
            </section>

            <section className="add-items">
                {selectedOrder && (
                    <ProductSelection
                        products={products}
                        selectedProducts={selectedProducts}
                        onAddProduct={handleAddProduct}
                    />
                )}
            </section>

            <section className="order-total">
                <h2>Order Total</h2>
                <p>Total Amount: ${orderTotal.toFixed(2)}</p>
            </section>

            <div className="actions">
                <button
                    onClick={() => console.log('Sale Submitted')}
                    disabled={!selectedOrder}
                >
                    Submit
                </button>
                <button
                    onClick={() => {
                        setSelectedOrder(null);
                        setSelectedProducts([]);
                        setOrderTotal(0);
                    }}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

export default Sales;
