import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate, Link } from 'react-router-dom'; 
import "./Login.css";

const onFinish = (values, navigate) => {
  const { username, password } = values;

  if (username === 'admin' && password === 'admin') {
    console.log('Login successful!');
    navigate('/home');  
  } else {
    console.log('Invalid username or password');
    alert('Invalid credentials! Please try again.');
  }
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export const Login = () => {
  const navigate = useNavigate(); 
  return (
    <div className="ent1">
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={(values) => onFinish(values, navigate)} 
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
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

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Login 
          </Button>
        </Form.Item>
        
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <div>
            New user? <Link to="/register">Register</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
