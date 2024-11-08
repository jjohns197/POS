import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'; // Link to your styles

function App() {
  return (
    <Router>
      <div className="grid-container">
        {/* Top boxes */}
        <Link to="/orders"><div className="box top">Orders</div></Link>
        <Link to="/sales"><div className="box top">Sales</div></Link>
        <Link to="/product"><div className="box top">Products</div></Link>
        <Link to="/customers"><div className="box top">Customers</div></Link>

        {/* Middle row with title and boxes */}
        <Link to="/reports"><div className="box middle-left">Reports</div></Link>
        <div className="title">POS System</div>
        <Link to="/shipment"><div className="box middle-right">Shipment</div></Link>

        {/* Bottom boxes */}
        <Link to="/employees"><div className="box bottom">Employees</div></Link>
        <Link to="/receipts"><div className="box bottom">Receipts</div></Link>
        <Link to="/help-support"><div className="box bottom">Help/Support</div></Link>
        <Link to="/refunds-returns"><div className="box bottom">Refunds/Returns</div></Link>
      </div>

      <Routes>
        <Route path="/orders" element={<h2>Orders Page</h2>} />
        <Route path="/sales" element={<h2>Sales Page</h2>} />
        <Route path="/product" element={<h2>Products Page</h2>} />
        <Route path="/customers" element={<h2>Customers Page</h2>} />
        <Route path="/reports" element={<h2>Reports Page</h2>} />
        <Route path="/shipment" element={<h2>Shipment Page</h2>} />
        <Route path="/employees" element={<h2>Employees Page</h2>} />
        <Route path="/receipts" element={<h2>Receipts Page</h2>} />
        <Route path="/help-support" element={<h2>Help/Support Page</h2>} />
        <Route path="/refunds-returns" element={<h2>Refunds/Returns Page</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
