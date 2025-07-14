import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../../../public/assets/logo.png";
import "../../../styles/register.css";
import Spinner from "../../../components/Spinner.jsx";

const RegisterForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.post(
        ` ${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`,
        values
      );
      message.success("Registration successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      message.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="loginForm"
      >
        <div className="registerFormLogo">
          <img src={logo} alt="logo" />
          <h2>Create a new account</h2>
        </div>

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter a username" }]}
        >
          <Input placeholder="Username" className="formInput" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="Email" className="formInput" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password placeholder="Password" className="formInput" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={loading}>
            {loading ? <Spinner size="small" /> : "Register"}
          </Button>
          <div className="auth-link">
            <span>Already have an account? </span>
            <Link to="/auth/login">Login</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
