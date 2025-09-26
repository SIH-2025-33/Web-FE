import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GeographicData from "./pages/GeographicData";
import Sidebar from "./components/Sidebar";
import './App.css';
import JourneyTablePage from "./pages/JourneyTablePage";
import CustomerComplaints from "./pages/CustomerComplaints";
import SettingsPage from "./pages/Settings";

export const ThemeContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={`app-wrapper ${isDarkMode ? "dark-mode" : ""}`}>
        <Router>
          <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
          <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/geographic" element={<GeographicData />} />
              <Route path="/journeys" element={<JourneyTablePage />} />
              <Route path="/complaints" element={<CustomerComplaints />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
