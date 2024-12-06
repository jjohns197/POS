import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Sales from './pages/Sales';
import Department from './pages/Department';
import Employees from './pages/Employees';
import Receipts from './pages/Receipts';
import Reports from './pages/Reports';

function Layout() {
  return (
    <div className="grid-container">
      <Link to="/orders"><div className="box top">Orders</div></Link>
      <Link to="/sales"><div className="box top">Sales</div></Link>
      <Link to="/product"><div className="box top">Products</div></Link>
      <Link to="/customers"><div className="box top">Customers</div></Link>

      <Link to="/reports"><div className="box middle-left">Reports</div></Link>
      <div className="title">POS System</div>
      <Link to="/shipment"><div className="box middle-right">Shipment</div></Link>

      <Link to="/employees"><div className="box bottom">Employees</div></Link>
      <Link to="/receipts"><div className="box bottom">Receipts</div></Link>
      <Link to="/help-support"><div className="box bottom">Help/Support</div></Link>
      <Link to="/departments"><div className="box bottom">Departments</div></Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/product" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reports" element={<Reports Page/>} />
        <Route path="/shipment" element={<h2>Shipment Page</h2>} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="/help-support" element={<h2>Help/Support Page</h2>} />
        <Route path="/departments" element={<Department />} />
      </Routes>
    </Router>
  );
}

export default App;
