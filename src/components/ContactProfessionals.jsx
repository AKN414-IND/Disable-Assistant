import React from 'react';
import { Button, Card, Row, Col } from 'antd';
const professionals = [
  {
    id: 1,
    name: 'dummy 1',
    designation: 'Doc',
    whatsapp: '1234567890',
    email: 'john.doe@example.com',
    image: 'https://via.placeholder.com/100', 
  },
  {
    id: 2,
    name: 'dummy 2',
    designation: 'Doc',
    whatsapp: '0987654321',
    email: 'jane.smith@example.com',
    image: 'https://via.placeholder.com/100', 
  },
];

export default function ContactProfessionals() {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Contact Professionals</h2>
      <Row gutter={6}>
        {professionals.map((professional) => (
          <Col span={4} key={professional.id}>
            <Card
              hoverable
              style={{ borderRadius: '10px' }}
              cover={<img alt={professional.name} src={professional.image} style={{ borderRadius: '10px 10px 0 0' }} />}
            >
              <Card.Meta
                title={professional.name}
                description={professional.designation}
              />
              <div style={{ marginTop: '10px' }}>
                <Button 
                  type="primary" 
                  onClick={() => window.open(`https://wa.me/${professional.whatsapp}`, '_blank')}
                >
                  WhatsApp
                </Button>
                <Button 
                  type="default" 
                  onClick={() => window.open(`mailto:${professional.email}`, '_blank')}
                  style={{ marginLeft: '10px' }}
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
