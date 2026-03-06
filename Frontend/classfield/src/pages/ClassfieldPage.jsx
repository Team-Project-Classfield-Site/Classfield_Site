import React, { useEffect, useState, useContext } from "react";
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
  message,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { UserContext } from "../contexts/user.context";

const { Title, Text, Paragraph } = Typography;

function ClassfieldPage() {
  const { id } = useParams();
  const { getUserFavorite, username } = useContext(UserContext);

  const [classfield, setClassfield] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resContent, resComments] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/classfields/${id}/`),
          axios.get(`http://127.0.0.1:8000/api/comments/?classfield=${id}`),
        ]);

        setClassfield(resContent.data);
        const commentsData =
          resComments.data.results ||
          (Array.isArray(resComments.data) ? resComments.data : []);
        setComments(commentsData);
      } catch (error) {
        console.error("Fetch error:", error);
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const checkStatus = async () => {
      if (username) {
        try {
          const data = await getUserFavorite(id);
          if (data && data.results && data.results.length > 0) {
            setFavorite(data.results[0]);
          } else {
            setFavorite(null);
          }
        } catch (e) {
          console.error("Favorite status error", e);
        }
      }
    };
    checkStatus();
  }, [id, username, getUserFavorite]);

  const addToFavorite = async () => {
    if (!username) {
      message.warning("Please log in to add favorites");
      return;
    }

    setBtnLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      if (favorite && favorite.id) {
        await axios.delete(
          `http://127.0.0.1:8000/api/favorites/${favorite.id}/`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setFavorite(null);
        message.success("Removed from favorites");
      } else {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/favorites/`,
          { classfield: id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setFavorite(response.data);
        message.success("Added to favorites");
      }
    } catch (error) {
      console.error(error.response?.data);
      message.error("Action failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const isFavorite = favorite !== null;

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
                <Button size="large" block icon={<MessageOutlined />}>
                  Write Message
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  size="large"
                  block
                  icon={<HeartOutlined />}
                  loading={btnLoading}
                  onClick={addToFavorite}
                  style={{
                    backgroundColor: isFavorite ? "#ff4d4f" : "#ffffff",
                    color: isFavorite ? "#ffffff" : "#003a8c",
                    borderColor: isFavorite ? "#ff4d4f" : "#91d5ff",
                    fontWeight: "500",
                  }}
                >
                  {isFavorite ? "In Favorites" : "Add to favorite"}
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card title="Comments" style={{ marginTop: 24, borderRadius: "12px" }}>
        {comments.length === 0 ? (
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
