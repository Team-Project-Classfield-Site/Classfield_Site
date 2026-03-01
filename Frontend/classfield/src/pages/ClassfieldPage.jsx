import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Card,
  Tag,
  Button,
  Row,
  Col,
  Divider,
  Skeleton,
  Empty,
  Avatar,
  Space,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

function ClassfieldPage() {
  const { id } = useParams();
  const [classfield, setClassfield] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getClassfield = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/classfields/${id}/`,
        );
        setClassfield(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    const getComments = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/comments/?classfield=${id}`,
        );
        const data =
          response.data.results ||
          (Array.isArray(response.data) ? response.data : []);
        setComments(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    getClassfield();
    getComments();
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: "50px" }}>
        <Skeleton active />
      </div>
    );

  if (!classfield)
    return (
      <Empty description="Оголошення не знайдено" style={{ marginTop: 100 }} />
    );

  return (
    <div
      style={{
        padding: "25px",
        backgroundColor: "#f0f2f5",
        minHeight: "810px",
        borderRadius: 10,
      }}
    >
      <Link to="/">
        <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 20 }}>
          Back
        </Button>
      </Link>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            bodyStyle={{ padding: 0 }}
            cover={
              <img
                alt={classfield.title}
                src={
                  classfield.photo ||
                  "https://sesupport.edumall.jp/hc/article_attachments/900009570963/noImage.jpg"
                }
                style={{
                  borderRadius: "12px",
                  height: "500px",
                  objectFit: "cover",
                }}
              />
            }
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          />
        </Col>

        <Col xs={24} md={12}>
          <Card
            style={{
              borderRadius: "12px",
              height: "100%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Tag color="blue" icon={<TagOutlined />}>
                {classfield.category_title || "General"}
              </Tag>
              <Text type="secondary" style={{ marginLeft: 10 }}>
                <CalendarOutlined /> Posted: {classfield.date?.slice(0, 10)}
              </Text>
            </div>

            <Title level={2}>{classfield.title}</Title>

            <Title level={3} style={{ color: "#1890ff", marginTop: 0 }}>
              {classfield.price?.toLocaleString()} ₴
            </Title>

            <Divider />

            <Title level={4}>Description</Title>
            <Paragraph style={{ fontSize: "16px", color: "#595959" }}>
              {classfield.description}
            </Paragraph>

            <Divider />

            <div
              style={{
                padding: "15px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                border: "1px solid #f0f0f0",
                marginBottom: 20,
              }}
            >
              <Space align="center" size="large">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  src={classfield.owner_avatar}
                />
                <div>
                  <Text type="secondary" style={{ display: "block" }}>
                    Seller
                  </Text>
                  <Text strong style={{ fontSize: "18px" }}>
                    {classfield.owner_name || "Unknown User"}
                  </Text>
                </div>
              </Space>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<PhoneOutlined />}
                  style={{ backgroundColor: "#001529", borderColor: "#001529" }}
                >
                  Show Phone
                </Button>
              </Col>
              <Col span={12}>
                <Button size="large" block icon={<MessageOutlined />}>
                  Write Message
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card title="Comments" style={{ marginTop: 24, borderRadius: "12px" }}>
        {!comments || comments.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No comments yet"
          />
        ) : (
          comments.map((item, index) => (
            <div key={index} style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  src={item.author_avatar}
                  size="small"
                />
                <Text strong style={{ marginLeft: "8px" }}>
                  {item.author_name || "User"}
                </Text>
                <Text
                  type="secondary"
                  style={{ fontSize: "12px", marginLeft: "auto" }}
                >
                  {item.date?.slice(0, 10)}
                </Text>
              </div>
              <Paragraph style={{ paddingLeft: "32px" }}>
                {item.text || item}
              </Paragraph>
              {index < comments.length - 1 && (
                <Divider style={{ margin: "12px 0" }} />
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

export default ClassfieldPage;
