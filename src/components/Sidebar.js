import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/geographic', icon: 'fas fa-map-marker-alt', label: 'Geographic Data' },
    { path: '/journeys', icon: 'fas fa-route', label: 'Journeys' },  // ✅ New
    { path: '/complaints', icon: 'fas fa-exclamation-circle', label: 'Customer Issues' }, 
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed ? (
          <div className="text-center mb-4">
            <h4><i className="fas fa-map-marked-alt me-2"></i>Kerala NATPAC</h4>
            <p className="text-muted">Travel Data Analytics</p>
          </div>
        ) : (
          <div className="text-center mb-4">
            <h4><i className="fas fa-map-marked-alt"></i></h4>
          </div>
        )}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>

      <ul className="nav flex-column">
        {menuItems.map(item => (
          <li className="nav-item" key={item.path}>
            <Link 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              to={item.path}
            >
              <i className={item.icon}></i>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
        {/* <li className="nav-item mt-4">
          <a className="nav-link" href="#logout">
            <i className="fas fa-sign-out-alt"></i>
            {!collapsed && <span>Logout</span>}
          </a>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
