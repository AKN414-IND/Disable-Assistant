import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd'; 
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
const Auth = ({ onAuthChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/home'); 
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        onAuthChange(); 
      }
    } catch (error) {
      setError("Authentication error: " + error.message);
      message.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <Form
        name="auth"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Button type="link" onClick={() => setIsLogin(!isLogin)}>
            Switch to {isLogin ? 'Register' : 'Login'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Auth;
