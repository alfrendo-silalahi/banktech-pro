import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthProvider";

export default function SignInForm() {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.message || `HTTP ${res.status}`);
      }

      const resBody = await res.json();
      login(resBody.accessToken);
    } catch (err) {
      form.resetFields();
      message.error(err.message || "Sign In Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="signin-form"
      onFinish={onFinish}
      requiredMark
    >
      {/* Username */}
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Username is required" }]}
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
        rules={[{ required: true, message: "Password is required" }]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="mr-1" />}
          placeholder="Your secure password"
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
          style={
            loading
              ? {
                  backgroundColor: "#1677ff",
                  borderColor: "#1677ff",
                  color: "#fff",
                }
              : undefined
          }
        >
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
}
