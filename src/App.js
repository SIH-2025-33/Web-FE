import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TripAnalysis from './pages/TripAnalysis';
import UserStatistics from './pages/UserStatistics';
import GeographicData from './pages/GeographicData';
import CustomerComplaints from './pages/CustomerComplaints';
import Settings from './pages/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export const ThemeContext = createContext();

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#0d6efd');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--primary', color);
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleTheme,
      accentColor,
      changeAccentColor
    }}>
      <Router>
        <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
          <Sidebar
            collapsed={sidebarCollapsed}
            toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <Navbar />
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/geographic" element={<GeographicData />} />
                <Route path="/complaints" element={<CustomerComplaints />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;