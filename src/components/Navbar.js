// src/components/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Dropdown, Form, InputGroup, Button } from 'react-bootstrap';
import { ThemeContext } from "../App";
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={`custom-navbar ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left Section - Logo */}
        <div className="navbar-logo">
          <h4 className="mb-0">Travel Dashboard</h4>
        </div>

        {/* Center Section - Search */}
        <div className="navbar-search">
          <InputGroup>
            <InputGroup.Text className="search-icon">
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Right Section - Actions */}
        <div className="navbar-actions d-flex align-items-center">
          <Dropdown className="me-3">
            <Dropdown.Toggle variant={isDarkMode ? 'secondary' : 'primary'}>
              <i className="fas fa-download me-2"></i> Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#pdf">PDF Report</Dropdown.Item>
              <Dropdown.Item href="#csv">CSV Data</Dropdown.Item>
              <Dropdown.Item href="#excel">Excel Sheet</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button
            variant={isDarkMode ? 'outline-light' : 'outline-dark'}
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
