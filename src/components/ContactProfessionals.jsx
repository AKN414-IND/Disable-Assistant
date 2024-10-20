import React from 'react';
import { Button, Card, Row, Col } from 'antd';
import './ContactProfessionals.css';
const professionals = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Doctor',
    whatsapp: '1234567890',
    email: 'john.doe@example.com',
    image: 'https://via.placeholder.com/100', 
  },
  {
    id: 2,
    name: 'Jane Smith',
    designation: 'Doctor',
    whatsapp: '0987654321',
    email: 'jane.smith@example.com',
    image: 'https://via.placeholder.com/100', 
  },
];

export default function ContactProfessionals() {
  return (
    <div className="container">
      <h2 className="title">Contact Professionals</h2>
      <Row gutter={16}>
        {professionals.map((professional) => (
          <Col xs={24} sm={12} md={8} lg={6} key={professional.id}>
            <Card
              hoverable
              className="professional-card"
              cover={<img alt={professional.name} src={professional.image} className="professional-image" />}
            >
              <Card.Meta
                title={<span className="professional-name">{professional.name}</span>}
                description={<span className="professional-designation">{professional.designation}</span>}
              />
              <div className="button-container">
                <Button 
                  type="primary" 
                  onClick={() => window.open(`https://wa.me/${professional.whatsapp}`, '_blank')}
                  className="contact-button"
                >
                  WhatsApp
                </Button>
                <Button 
                  type="default" 
                  onClick={() => window.open(`mailto:${professional.email}`, '_blank')}
                  className="contact-button"
                >
                  Email
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
