import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthProvider";
import { useActivity } from "../context/ActivityProvider";
import { registerUser } from "../firebase/auth";

export default function SignUpForm() {
  const { login } = useAuth();
  const { logActivity } = useActivity();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      logActivity('signup_attempt', 'auth', { username: values.username });

      const result = await registerUser(
        values.username, 
        values.password, 
        values.firstName, 
        values.lastName
      );
      
      if (result.success) {
        logActivity('signup_success', 'auth', { 
          username: values.username, 
          accountNumber: result.accountNumber 
        });
        login(result.user);
        message.success(`Account created! Your account number: ${result.accountNumber}`);
      } else {
        logActivity('signup_failed', 'auth', { username: values.username, error: result.error });
        throw new Error(result.error);
      }
    } catch (err) {
      logActivity('signup_error', 'auth', { username: values.username, error: err.message });
      message.error(err.message || "Sign Up Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="signup-form"
      onFinish={onFinish}
      requiredMark
    >
      {/* First Name */}
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "First name is required" }]}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="mr-1" />}
          placeholder="Your first name"
        />
      </Form.Item>

      {/* Last Name */}
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: "Last name is required" }]}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="mr-1" />}
          placeholder="Your last name"
        />
      </Form.Item>

      {/* Username */}
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Username is required" },
          { min: 3, message: "Username must be at least 3 characters" },
          { pattern: /^[a-zA-Z0-9_]+$/, message: "Username can only contain letters, numbers, and underscores" }
        ]}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="mr-1" />}
          placeholder="Your username"
        />
      </Form.Item>

      {/* Password */}
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Password is required" },
          { min: 6, message: "Password must be at least 6 characters" }
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="mr-1" />}
          placeholder="Your secure password"
        />
      </Form.Item>

      {/* Confirm Password */}
      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: "Please confirm your password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="mr-1" />}
          placeholder="Confirm your password"
        />
      </Form.Item>

      {/* Submit */}
      <Form.Item className="mb-2">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          icon={
            loading ? <LoadingOutlined spin style={{ color: "#fff" }} /> : null
          }
          disabled={loading}
        >
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
}