<<<<<<< Updated upstream
import React from 'react';
import Auth from './Auth'; 
import "./Login.css";

export const Login = () => {
  const handleAuthChange = () => {
    console.log('Authentication state changed');
=======
import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../Firebase'; 
import "./Login.css";

const googleProvider = new GoogleAuthProvider();

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success('Login successful!');
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error.message);
      message.error('Invalid credentials! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      message.success('Google sign-in successful!');
      navigate('/home');
    } catch (error) {
      console.error('Error during Google sign-in:', error.message);
      message.error('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
>>>>>>> Stashed changes
  };

  return (
    <div className="ent1">
<<<<<<< Updated upstream
      <Auth onAuthChange={handleAuthChange} />
=======
      <Form
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please input a valid email!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={handleGoogleSignIn} loading={loading}>
            Sign in with Google
          </Button>
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div>
            New user? <Link to="/register">Register</Link>
          </div>
        </Form.Item>
      </Form>
>>>>>>> Stashed changes
    </div>
  );
};
