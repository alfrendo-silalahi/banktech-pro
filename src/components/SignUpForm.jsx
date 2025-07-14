import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoadingOutlined,
  MailOutlined,
} from "@ant-design/icons";
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
      logActivity("signup_attempt", "auth", { username: values.username });

      const result = await registerUser(
        values.email,
        values.name,
        values.password
      );

      if (result.success) {
        logActivity("signup_success", "auth", {
          username: values.username,
          accountNumber: result.accountNumber,
        });
        login(result.user.token);
        message.success(
          `Account created! Your account number: ${result.accountNumber}`
        );
      } else {
        logActivity("signup_failed", "auth", {
          username: values.username,
          error: result.error,
        });
        throw new Error(result.error);
      }
    } catch (err) {
      logActivity("signup_error", "auth", {
        username: values.username,
        error: err.message,
      });
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
      {/* Email */}
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Password is required",
          },
          {
            type: "email",
            message: "Invalid email format",
          },
        ]}
      >
        <Input
          size="large"
          placeholder="Your email"
          prefix={<MailOutlined className="mr-1" />}
        />
      </Form.Item>

      {/* Name */}
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Name is required" }]}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="mr-1" />}
          placeholder="Your name"
        />
      </Form.Item>

      {/* Password */}
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Password is required" },
          { min: 6, message: "Password must be at least 6 characters" },
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
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
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
