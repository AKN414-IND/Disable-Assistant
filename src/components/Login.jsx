import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase'; 
import "./Login.css";

const googleProvider = new GoogleAuthProvider();

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and registration

  const onFinishLogin = async (values) => {
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

  const onFinishRegister = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      message.success('Registration successful! You can now log in.');
      setIsRegistering(false); // Switch back to login after successful registration
    } catch (error) {
      console.error('Error during registration:', error.message);
      message.error('Registration failed. Please try again.');
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
          onFinish={isRegistering ? onFinishRegister : onFinishLogin}
          autoComplete="off"
        >
          {!isRegistering && (
            <>
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
            </>
          )}

          {isRegistering && (
            <>
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
                  Register
                </Button>
              </Form.Item>
            </>
          )}

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
              {isRegistering ? (
                <>
                  Already have an account? <Button type="link" onClick={() => setIsRegistering(false)}>Login</Button>
                </>
              ) : (
                <>
                  New user? <Button type="link" onClick={() => setIsRegistering(true)}>Register</Button>
                </>
              )}
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
