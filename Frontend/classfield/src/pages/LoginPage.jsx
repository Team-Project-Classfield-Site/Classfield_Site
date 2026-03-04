import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, Card, Space } from "antd";
import {
  LoginOutlined,
  ShopOutlined,
  UnlockOutlined,
  RocketOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../contexts/user.context";
import { useContext } from "react";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUsername } = useContext(UserContext);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/login/`,
        values,
      );
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      setUsername(values.username);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "750px", width: "100%" }}>
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #1890ff 0%, #001529 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "60px",
          color: "#fff",
          height: "750px",
          borderRadius: "20px",
          boxShadow: "10px 0 30px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ maxWidth: "500px", marginBottom: "133px" }}>
          <ShopOutlined
            style={{ fontSize: "48px", marginBottom: "24px", color: "#69c0ff" }}
          />

          <Title
            style={{ color: "#fff", marginBottom: "16px", fontSize: "42px" }}
          >
            Welcome Back!
          </Title>

          <Title
            level={3}
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontWeight: 300,
              marginBottom: "40px",
            }}
          >
            Log in to manage your ads and messages.
          </Title>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <Space size="middle">
              <RocketOutlined style={{ fontSize: "20px", color: "#b7eb8f" }} />
              <Text style={{ color: "#fff", fontSize: "16px" }}>
                Fast access to your listings
              </Text>
            </Space>

            <Space size="middle">
              <UnlockOutlined style={{ fontSize: "20px", color: "#b7eb8f" }} />
              <Text style={{ color: "#fff", fontSize: "16px" }}>
                Secure account management
              </Text>
            </Space>

            <Space size="middle">
              <SafetyOutlined style={{ fontSize: "20px", color: "#b7eb8f" }} />
              <Text style={{ color: "#fff", fontSize: "16px" }}>
                Protected personal data
              </Text>
            </Space>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f0f2f5",
          padding: "40px",
          height: "750px",
          borderRadius: "20px",
          marginLeft: "20px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "450px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <LoginOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
            <Title level={2} style={{ marginTop: "16px" }}>
              Sign In
            </Title>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Username or Email"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username or email!",
                },
              ]}
            >
              <Input size="large" placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password size="large" placeholder="Enter your password" />
            </Form.Item>

            <Form.Item style={{ marginTop: "32px" }}>
              <Button type="primary" htmlType="submit" size="large" block>
                Login
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">
                New to Classfields?{" "}
                <Link to="/register">Create an account</Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
