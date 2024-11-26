import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    price: 0,
    product_quantity: 0,
    product_descr: ''
  });
  const [editProduct, setEditProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch all products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:5001/Product')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  };

  // Add a new product
  const addProduct = () => {
    axios.post('http://localhost:5001/Product', newProduct)
      .then(response => {
        setProducts([...products, response.data]);
        setNewProduct({ product_name: '', price: 0, product_quantity: 0, product_descr: '' });
      })
      .catch(error => console.error('Error adding product:', error));
  };

  // Update an existing product
  const updateProduct = () => {
    if (!selectedProduct) return;
    axios.put(`http://localhost:5001/Product/${selectedProduct.product_id}`, editProduct)
      .then(response => {
        const updatedProducts = products.map(product =>
          product.product_id === selectedProduct.product_id ? response.data : product
        );
        setProducts(updatedProducts);
        setEditProduct(null);
        setSelectedProduct(null);
      })
      .catch(error => console.error('Error updating product:', error));
  };

  // Delete a product
  const deleteProduct = () => {
    if (!selectedProduct) return;
    axios.delete(`http://localhost:5001/Product/${selectedProduct.product_id}`)
      .then(() => {
        setProducts(products.filter(product => product.product_id !== selectedProduct.product_id));
        setSelectedProduct(null);
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Products</h1>

      {/* Live Preview Section */}
      <div className="product-preview">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr
                key={product.product_id}
                onClick={() => setSelectedProduct(product)}
                style={{ backgroundColor: selectedProduct?.product_id === product.product_id ? '#e0e0e0' : 'transparent' }}
              >
                <td>{product.product_id}</td>
                <td>{product.product_name}</td>
                <td>{product.price}</td>
                <td>{product.product_quantity}</td>
                <td>{product.product_descr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="button-container">
        <button onClick={() => setNewProduct({ product_name: '', price: 0, product_quantity: 0, product_descr: '' })}>Add Product</button>
        <button onClick={() => setEditProduct(selectedProduct)}>Update Product</button>
        <button onClick={deleteProduct}>Delete Product</button>
      </div>

      {/* Modals for Adding/Updating */}
      {newProduct && (
        <div className="modal">
          <h3>Add Product</h3>
          <input type="text" placeholder="Product Name" value={newProduct.product_name} onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })} />
          <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
          <input type="number" placeholder="Quantity" value={newProduct.product_quantity} onChange={(e) => setNewProduct({ ...newProduct, product_quantity: parseInt(e.target.value) })} />
          <input type="text" placeholder="Description" value={newProduct.product_descr} onChange={(e) => setNewProduct({ ...newProduct, product_descr: e.target.value })} />
          <button onClick={addProduct}>Submit</button>
          <button onClick={() => setNewProduct(null)}>Close</button>
        </div>
      )}

      {editProduct && (
        <div className="modal">
          <h3>Update Product</h3>
          <input type="text" placeholder="Product Name" value={editProduct.product_name} onChange={(e) => setEditProduct({ ...editProduct, product_name: e.target.value })} />
          <input type="number" placeholder="Price" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })} />
          <input type="number" placeholder="Quantity" value={editProduct.product_quantity} onChange={(e) => setEditProduct({ ...editProduct, product_quantity: parseInt(e.target.value) })} />
          <input type="text" placeholder="Description" value={editProduct.product_descr} onChange={(e) => setEditProduct({ ...editProduct, product_descr: e.target.value })} />
          <button onClick={updateProduct}>Update</button>
          <button onClick={() => setEditProduct(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Products;