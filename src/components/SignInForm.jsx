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
import { signInUser } from "../firebase/auth";

export default function SignInForm() {
  const { login } = useAuth();
  const { logActivity } = useActivity();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // logActivity("login_attempt", "auth", { username: values.username });

      // Sign in with Firebase
      const result = await signInUser(values.email, values.password);

      if (result.success) {
        // logActivity("login_success", "auth", { username: values.username });
        login(result.user.accessToken);
        message.success("Sign in successful!");
      } else {
        // logActivity("login_failed", "auth", {
        //   username: values.username,
        //   error: result.error,
        // });
        throw new Error(result.error);
      }
    } catch (err) {
      // logActivity("login_error", "auth", {
      //   username: values.username,
      //   error: err.message,
      // });
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
