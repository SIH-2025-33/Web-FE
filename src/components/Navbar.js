import React, { useState, useContext } from 'react';
import { Dropdown, Form, InputGroup, Button } from 'react-bootstrap';
import { ThemeContext } from '../App';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <div className="input-group me-3" style={{ width: '300px' }}>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dropdown className="me-3">
            <Dropdown.Toggle variant="primary">
              <i className="fas fa-download me-2"></i> Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#pdf">PDF Report</Dropdown.Item>
              <Dropdown.Item href="#csv">CSV Data</Dropdown.Item>
              <Dropdown.Item href="#excel">Excel Sheet</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button 
            variant="outline-secondary" 
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