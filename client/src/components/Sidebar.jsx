import React from "react";
import '../index.css'

const Sidebar = () => {
  return (
    <div className="my-sidebar">
      <aside className="menu">
        <p className="menu-label">Admin</p>
        <ul className="menu-list">
          <li className="mb-1">
            <a href="/">Dashboard</a>
          </li>
          <li className="mb-1">
            <a href="/inventory">Inventory</a>
          </li>
          <li>
            <a href="/outlet">Outlet</a>
          </li>
        </ul>
        <p className="menu-label">Transaction</p>
        <ul className="menu-list">
          <li>
            <a href="cashier">Cashier</a>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
