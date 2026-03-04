import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Upload, Space, Typography, Card } from "antd";
import {
  CheckCircleOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../contexts/user.context";
import { useContext } from "react";
const { Title, Text } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUsername } = useContext(UserContext);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("phone", values.phone);

    if (values.avatar && values.avatar[0] && values.avatar[0].originFileObj) {
      formData.append("avatar", values.avatar[0].originFileObj);
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/register/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      setUsername(values.username);
      navigate("/");
    } catch (error) {
      console.error(error);
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
        <div style={{ maxWidth: "500px", marginBottom: "100px" }}>
          <ShopOutlined
            style={{ fontSize: "48px", marginBottom: "24px", color: "#69c0ff" }}
          />

          <Title
            style={{ color: "#fff", marginBottom: "16px", fontSize: "42px" }}
          >
            Classfields Marketplace
          </Title>

          <Title
            level={3}
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontWeight: 300,
              marginBottom: "40px",
            }}
          >
            The largest community of buyers and sellers in Ukraine.
          </Title>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <Space size="middle">
              <CheckCircleOutlined
                style={{ fontSize: "20px", color: "#b7eb8f" }}
              />
              <Text style={{ color: "#fff", fontSize: "16px" }}>
                Sell your items in minutes
              </Text>
            </Space>

            <Space size="middle">
              <SafetyCertificateOutlined
                style={{ fontSize: "20px", color: "#b7eb8f" }}
              />
              <Text style={{ color: "#fff", fontSize: "16px" }}>
                Verified and safe transactions
              </Text>
            </Space>

            <Space size="middle">
              <GlobalOutlined style={{ fontSize: "20px", color: "#b7eb8f" }} />
              <Text style={{ color: "#fff", fontSize: "16px" }}>
                Access to thousands of unique products
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
            maxWidth: "500px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "32px" }}
          >
            Sign Up
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="avatar"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                maxCount={1}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Avatar</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
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
              <Input.Password size="large" placeholder="Create a password" />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <Input size="large" placeholder="+380..." />
            </Form.Item>

            <Form.Item style={{ marginTop: "32px" }}>
              <Button type="primary" htmlType="submit" size="large" block>
                Create Account
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">
                Already have an account? <Link to="/login">Log in</Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
