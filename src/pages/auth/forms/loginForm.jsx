import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../../public/assets/logo.png";
import "../../../styles/register.css";

import {
  logInStart,
  logInSuccess,
  logInFailure,
} from "../../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner.jsx";

const LoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [_, setCookies] = useCookies(["access_token"]);

  const onFinish = async (values) => {
    try {
      dispatch(logInStart());
      const response = await axios.post(` /api/v1/users/login`, values);

      dispatch(logInSuccess(response));
      message.success("Login successful");
      setCookies("access_token", response.data.data.access_token);
      navigate("/");
    } catch (err) {
      dispatch(logInFailure(err));
      message.error("Login failed. Please check your credentials.");
      console.error(err);
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
          <h2>Welcome Back</h2>
          <p style={{ color: "#888", marginTop: "4px", fontSize: "14px" }}>
            Log in to continue cooking 🍳
          </p>
        </div>

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Username" className="formInput" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" className="formInput" />
        </Form.Item>

        <Form.Item style={{ marginTop: "1rem" }}>
          <Button type="primary" htmlType="submit" block disabled={loading}>
            {loading ? <Spinner size="small" /> : "Login"}
          </Button>
          <div className="auth-link">
            <span>Don't have an account? </span>
            <Link to="/auth/register">Register</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
