import React, { useState, useContext } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { ThemeContext } from '../App';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState({});

  const [profile, setProfile] = useState({
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    travelSummary: 'weekly',
    newFeatures: true,
    systemUpdates: false
  });

  const [preferences, setPreferences] = useState({
    distanceUnit: 'km',
    dateRange: 'last-month',
    defaultMapView: 'standard',
    autoRefresh: true,
    language: 'english'
  });

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = (section) => {
    setSaveStatus({ [section]: 'success' });
    
    setTimeout(() => {
      setSaveStatus({});
    }, 3000);
  };

  
  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (profile.newPassword !== profile.confirmPassword) {
      setSaveStatus({ profile: 'error', message: 'New passwords do not match' });
      return;
    }
    
    setSaveStatus({ profile: 'success', message: 'Password updated successfully' });
    
    setProfile(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div>
      <h2 className="mb-4">Settings</h2>
      
      <Card className="mb-4">
        <Card.Body className="p-0">
          <div className="settings-nav">
            <Button 
              variant={activeTab === 'profile' ? 'primary' : 'outline-primary'} 
              className="rounded-0"
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user me-2"></i>Profile
            </Button>
            <Button 
              variant={activeTab === 'notifications' ? 'primary' : 'outline-primary'} 
              className="rounded-0"
              onClick={() => setActiveTab('notifications')}
            >
              <i className="fas fa-bell me-2"></i>Notifications
            </Button>
            <Button 
              variant={activeTab === 'preferences' ? 'primary' : 'outline-primary'} 
              className="rounded-0"
              onClick={() => setActiveTab('preferences')}
            >
              <i className="fas fa-sliders-h me-2"></i>Preferences
            </Button>
            <Button 
              variant={activeTab === 'appearance' ? 'primary' : 'outline-primary'} 
              className="rounded-0"
              onClick={() => setActiveTab('appearance')}
            >
              <i className="fas fa-palette me-2"></i>Appearance
            </Button>
          </div>
        </Card.Body>
      </Card>

      {activeTab === 'profile' && (
        <Card>
          <Card.Header>
            <h5 className="card-title mb-0">Profile Settings</h5>
          </Card.Header>
          <Card.Body>
            {saveStatus.profile && (
              <Alert variant={saveStatus.profile === 'success' ? 'success' : 'danger'}>
                {saveStatus.message || (saveStatus.profile === 'success' ? 'Profile updated successfully!' : 'Error updating profile')}
              </Alert>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => handleProfileChange('displayName', e.target.value)}
                    placeholder="Enter your display name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    placeholder="Enter your email address"
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />
            
            <h6 className="mb-3">Change Password</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={profile.currentPassword}
                    onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={profile.newPassword}
                    onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={profile.confirmPassword}
                    onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Button variant="primary" onClick={handlePasswordReset}>
              Update Password
            </Button>
          </Card.Body>
          <Card.Footer className="bg-light">
            <Button variant="primary" onClick={() => saveSettings('profile')}>
              Save Profile Changes
            </Button>
          </Card.Footer>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <Card.Header>
            <h5 className="card-title mb-0">Notification Settings</h5>
          </Card.Header>
          <Card.Body>
            {saveStatus.notifications && (
              <Alert variant={saveStatus.notifications === 'success' ? 'success' : 'danger'}>
                {saveStatus.notifications === 'success' ? 'Notification settings updated successfully!' : 'Error updating notification settings'}
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="email-alerts"
                label="Enable Email Alerts"
                checked={notifications.emailAlerts}
                onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
              />
              <Form.Text className="text-muted">
                Receive important notifications via email
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Travel Summary Frequency</Form.Label>
              <Form.Select
                value={notifications.travelSummary}
                onChange={(e) => handleNotificationChange('travelSummary', e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </Form.Select>
              <Form.Text className="text-muted">
                How often you receive travel summary reports
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="new-features"
                label="New Feature Announcements"
                checked={notifications.newFeatures}
                onChange={(e) => handleNotificationChange('newFeatures', e.target.checked)}
              />
              <Form.Text className="text-muted">
                Get notified about new features and updates
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="system-updates"
                label="System Update Notifications"
                checked={notifications.systemUpdates}
                onChange={(e) => handleNotificationChange('systemUpdates', e.target.checked)}
              />
              <Form.Text className="text-muted">
                Receive alerts about system maintenance and updates
              </Form.Text>
            </Form.Group>
          </Card.Body>
          <Card.Footer className="bg-light">
            <Button variant="primary" onClick={() => saveSettings('notifications')}>
              Save Notification Settings
            </Button>
          </Card.Footer>
        </Card>
      )}

      {activeTab === 'preferences' && (
        <Card>
          <Card.Header>
            <h5 className="card-title mb-0">Data Preferences</h5>
          </Card.Header>
          <Card.Body>
            {saveStatus.preferences && (
              <Alert variant={saveStatus.preferences === 'success' ? 'success' : 'danger'}>
                {saveStatus.preferences === 'success' ? 'Preferences updated successfully!' : 'Error updating preferences'}
              </Alert>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Distance Units</Form.Label>
                  <Form.Select
                    value={preferences.distanceUnit}
                    onChange={(e) => handlePreferenceChange('distanceUnit', e.target.value)}
                  >
                    <option value="km">Kilometers (km)</option>
                    <option value="miles">Miles</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Default Date Range</Form.Label>
                  <Form.Select
                    value={preferences.dateRange}
                    onChange={(e) => handlePreferenceChange('dateRange', e.target.value)}
                  >
                    <option value="last-week">Last Week</option>
                    <option value="last-month">Last Month</option>
                    <option value="last-quarter">Last Quarter</option>
                    <option value="last-year">Last Year</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Default Map View</Form.Label>
              <Form.Select
                value={preferences.defaultMapView}
                onChange={(e) => handlePreferenceChange('defaultMapView', e.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
                <option value="dark">Dark Mode</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="auto-refresh"
                label="Auto-Refresh Data"
                checked={preferences.autoRefresh}
                onChange={(e) => handlePreferenceChange('autoRefresh', e.target.checked)}
              />
              <Form.Text className="text-muted">
                Automatically refresh data when returning to the dashboard
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Language Preference</Form.Label>
              <Form.Select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
              >
                <option value="english">English</option>
                <option value="malayalam">Malayalam</option>
                <option value="hindi">Hindi</option>
                <option value="tamil">Tamil</option>
              </Form.Select>
            </Form.Group>
          </Card.Body>
          <Card.Footer className="bg-light">
            <Button variant="primary" onClick={() => saveSettings('preferences')}>
              Save Preferences
            </Button>
          </Card.Footer>
        </Card>
      )}

      {activeTab === 'appearance' && (
        <Card>
          <Card.Header>
            <h5 className="card-title mb-0">Appearance Settings</h5>
          </Card.Header>
          <Card.Body>
            {saveStatus.appearance && (
              <Alert variant={saveStatus.appearance === 'success' ? 'success' : 'danger'}>
                {saveStatus.appearance === 'success' ? 'Appearance settings updated successfully!' : 'Error updating appearance settings'}
              </Alert>
            )}
            
            <Form.Group className="mb-4">
              <Form.Label>Theme</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  id="light-theme"
                  name="theme"
                  label="Light Theme"
                  checked={!isDarkMode}
                  onChange={() => isDarkMode && toggleTheme()}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="dark-theme"
                  name="theme"
                  label="Dark Theme"
                  checked={isDarkMode}
                  onChange={() => !isDarkMode && toggleTheme()}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Accent Color</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {['#0d6efd', '#198754', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14'].map(color => (
                  <div
                    key={color}
                    className="color-swatch"
                    style={{
                      backgroundColor: color,
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: '2px solid #dee2e6'
                    }}
                    title={color}
                    onClick={() => {
                      document.documentElement.style.setProperty('--primary', color);
                    }}
                  />
                ))}
              </div>
              <Form.Text className="text-muted">
                Click on a color to set it as the primary accent color
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Font Size</Form.Label>
              <Form.Select defaultValue="medium">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="x-large">Extra Large</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="reduce-motion"
                label="Reduce Motion"
                defaultChecked={false}
              />
              <Form.Text className="text-muted">
                Reduce animations and transitions for better accessibility
              </Form.Text>
            </Form.Group>
          </Card.Body>
          <Card.Footer className="bg-light">
            <Button variant="primary" onClick={() => saveSettings('appearance')}>
              Save Appearance Settings
            </Button>
            <Button variant="outline-secondary" className="ms-2" onClick={() => {
              document.documentElement.style.setProperty('--primary', '#0d6efd');
            }}>
              Reset to Default
            </Button>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
};

export default Settings;