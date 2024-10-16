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
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Form
          className="login-form"
          name="login"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
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

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Button 
              onClick={handleGoogleSignIn} 
              loading={loading}
              icon={
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google logo" 
                  className="google-icon"
                />
              }
              className="google-signin-btn"
            >
              Sign in with Google
            </Button>
          </Form.Item>
          
          <Form.Item>
            <div className="register-link">
              New user? <Link to="/register">Register</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};