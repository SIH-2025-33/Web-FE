import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Badge, Table, Modal } from 'react-bootstrap';

const CustomerComplaints = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      user_id: "user_101",
      date: "2025-09-15",
      category: "App Functionality",
      priority: "High",
      status: "Open",
      description: "App crashes when trying to view trip history",
      comments: [
        {
          id: 1,
          user: "Support Agent",
          date: "2025-09-15",
          text: "We're looking into this issue. Can you provide your device model and OS version?"
        }
      ]
    },
    {
      id: 2,
      user_id: "user_102",
      date: "2025-09-14",
      category: "Data Accuracy",
      priority: "Medium",
      status: "In Progress",
      description: "Trip distance calculation seems incorrect for my bus route",
      comments: [
        {
          id: 1,
          user: "Support Agent",
          date: "2025-09-14",
          text: "Thank you for reporting this. We've forwarded this to our data team for verification."
        },
        {
          id: 2,
          user: "Data Team",
          date: "2025-09-15",
          text: "We've identified the issue with the route mapping algorithm. Fix will be deployed in the next update."
        }
      ]
    },
    {
      id: 3,
      user_id: "user_103",
      date: "2025-09-13",
      category: "Account Issues",
      priority: "Low",
      status: "Resolved",
      description: "Unable to reset password through email link",
      comments: [
        {
          id: 1,
          user: "Support Agent",
          date: "2025-09-13",
          text: "We've reset your password manually. Please check your email for temporary credentials."
        },
        {
          id: 2,
          user: "user_103",
          date: "2025-09-14",
          text: "Issue resolved. Thank you for the quick support!"
        }
      ]
    },
    {
      id: 4,
      user_id: "user_104",
      date: "2025-09-12",
      category: "Payment Issues",
      priority: "High",
      status: "Open",
      description: "Double charged for monthly subscription",
      comments: [
        {
          id: 1,
          user: "Support Agent",
          date: "2025-09-12",
          text: "We apologize for the inconvenience. Our finance team is looking into this."
        }
      ]
    },
    {
      id: 5,
      user_id: "user_105",
      date: "2025-09-11",
      category: "Feature Request",
      priority: "Low",
      status: "Closed",
      description: "Please add option to export trip data to CSV",
      comments: [
        {
          id: 1,
          user: "Product Team",
          date: "2025-09-11",
          text: "Thank you for the suggestion. This feature is planned for Q4 release."
        },
        {
          id: 2,
          user: "Product Team",
          date: "2025-09-15",
          text: "Export feature has been implemented in version 2.1.0"
        }
      ]
    }
  ]);

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = filterStatus === 'all' || complaint.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || complaint.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      Open: { bg: "danger", text: "white" },
      "In Progress": { bg: "warning", text: "dark" },
      Resolved: { bg: "success", text: "white" },
      Closed: { bg: "secondary", text: "white" }
    };
    
    return (
      <Badge 
        bg={statusStyles[status]?.bg || "secondary"} 
        text={statusStyles[status]?.text}
      >
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      High: { bg: "danger", text: "white" },
      Medium: { bg: "warning", text: "dark" },
      Low: { bg: "info", text: "white" }
    };
    
    return (
      <Badge 
        bg={priorityStyles[priority]?.bg || "secondary"} 
        text={priorityStyles[priority]?.text}
      >
        {priority}
      </Badge>
    );
  };

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === selectedComplaint.id) {
        const newCommentObj = {
          id: complaint.comments.length + 1,
          user: "Support Agent", 
          date: new Date().toISOString().split('T')[0],
          text: newComment
        };
        
        return {
          ...complaint,
          comments: [...complaint.comments, newCommentObj]
        };
      }
      return complaint;
    });
    
    setComplaints(updatedComplaints);
    setSelectedComplaint(updatedComplaints.find(c => c.id === selectedComplaint.id));
    setNewComment('');
  };

  const handleUpdateStatus = (complaintId, newStatus) => {
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return { ...complaint, status: newStatus };
      }
      return complaint;
    });
    
    setComplaints(updatedComplaints);
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
  };

  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter(c => c.status === 'Open').length;
  const highPriorityComplaints = complaints.filter(c => c.priority === 'High').length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customer Issues & Complaints</h2>
        <Button variant="primary">
          <i className="fas fa-plus me-2"></i> New Issue
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <div className="text-primary">
                <i className="fas fa-exclamation-circle fa-3x"></i>
              </div>
              <div className="number display-6 fw-bold">{totalComplaints}</div>
              <div className="label">Total Issues</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <div className="text-warning">
                <i className="fas fa-clock fa-3x"></i>
              </div>
              <div className="number display-6 fw-bold">{openComplaints}</div>
              <div className="label">Open Issues</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <div className="text-danger">
                <i className="fas fa-flag fa-3x"></i>
              </div>
              <div className="number display-6 fw-bold">{highPriorityComplaints}</div>
              <div className="label">High Priority</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Label>Status</Form.Label>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Priority</Form.Label>
              <Form.Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Category</Form.Label>
              <Form.Select>
                <option value="all">All Categories</option>
                <option value="App Functionality">App Functionality</option>
                <option value="Data Accuracy">Data Accuracy</option>
                <option value="Account Issues">Account Issues</option>
                <option value="Payment Issues">Payment Issues</option>
                <option value="Feature Request">Feature Request</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="card-title mb-0">Customer Issues</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(complaint => (
                  <tr key={complaint.id}>
                    <td>{complaint.id}</td>
                    <td>{complaint.user_id}</td>
                    <td>{complaint.date}</td>
                    <td>{complaint.category}</td>
                    <td>{getPriorityBadge(complaint.priority)}</td>
                    <td>{getStatusBadge(complaint.status)}</td>
                    <td className="text-truncate" style={{ maxWidth: '200px' }} title={complaint.description}>
                      {complaint.description}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => handleViewComplaint(complaint)}
                      >
                        <i className="fas fa-eye"></i> View
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {filteredComplaints.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <p>No issues found matching your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Issue #{selectedComplaint?.id} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>User ID:</strong> {selectedComplaint.user_id}
                </Col>
                <Col md={6}>
                  <strong>Date:</strong> {selectedComplaint.date}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Category:</strong> {selectedComplaint.category}
                </Col>
                <Col md={3}>
                  <strong>Priority:</strong> {getPriorityBadge(selectedComplaint.priority)}
                </Col>
                <Col md={3}>
                  <strong>Status:</strong> {getStatusBadge(selectedComplaint.status)}
                </Col>
              </Row>
              <div className="mb-3">
                <strong>Description:</strong>
                <p className="mt-1">{selectedComplaint.description}</p>
              </div>
              
              <hr />
              
              <h6>Comments & Updates</h6>
              <div className="comments-section" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {selectedComplaint.comments.map(comment => (
                  <div key={comment.id} className="card mb-2">
                    <div className="card-body py-2">
                      <div className="d-flex justify-content-between">
                        <strong>{comment.user}</strong>
                        <small className="text-muted">{comment.date}</small>
                      </div>
                      <p className="mb-0">{comment.text}</p>
                    </div>
                  </div>
                ))}
                
                {selectedComplaint.comments.length === 0 && (
                  <p className="text-muted">No comments yet.</p>
                )}
              </div>
              
              <div className="mt-3">
                <Form.Group>
                  <Form.Label>Add Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your response or update..."
                  />
                </Form.Group>
                <Button 
                  variant="primary" 
                  className="mt-2"
                  onClick={handleAddComment}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="me-auto">
            <Form.Select 
              value={selectedComplaint?.status} 
              onChange={(e) => handleUpdateStatus(selectedComplaint.id, e.target.value)}
              style={{ width: 'auto', display: 'inline-block' }}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </Form.Select>
          </div>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerComplaints;