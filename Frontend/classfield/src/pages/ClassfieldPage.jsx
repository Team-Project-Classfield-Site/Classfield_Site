import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { buyPremiumTag, getIsPremiumStatus } from "../utilites/blockchainUtils";
import { UserContext } from "../contexts/user.context";

const { Title, Text, Paragraph } = Typography;

const ActionButtons = ({
  username,
  ownerName,
  isPremium,
  premiumLoading,
  handleBuyPremium,
  btnLoading,
  addToFavorite,
  isFavorite,
}) => {
  const isOwner = username && ownerName === username;

  return (
    <Row gutter={16}>
      {isOwner ? (
        <Col span={24}>
          <Button
            type="primary"
            size="large"
            block
            icon={<TagOutlined />}
            loading={premiumLoading}
            onClick={handleBuyPremium}
            disabled={isPremium}
            style={{
              backgroundColor: isPremium ? "#52c41a" : "#fadb14",
              borderColor: isPremium ? "#52c41a" : "#fadb14",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            {isPremium ? "Premium Active" : "Buy Premium Tag (1 ETH)"}
          </Button>
        </Col>
      ) : (
        <>
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
              }}
            >
              {isFavorite ? "In Favorites" : "Add to favorite"}
            </Button>
          </Col>
        </>
      )}
    </Row>
  );
};

const CommentsSection = ({ comments }) => (
  <Card title="Comments" style={{ marginTop: 24, borderRadius: "12px" }}>
    {comments.length === 0 ? (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No comments yet" />
    ) : (
      comments.map((item, index) => (
        <div key={index} style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <Avatar icon={<UserOutlined />} src={item.author_avatar} size="small" />
            <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
              {item.author_name || "User"}
            </span>
            <span style={{ color: "#8c8c8c", fontSize: "12px", marginLeft: "auto" }}>
              {item.date?.slice(0, 10)}
            </span>
          </div>
          <Paragraph style={{ paddingLeft: "32px" }}>{item.text || item}</Paragraph>
          {index < comments.length - 1 && <Divider style={{ margin: "12px 0" }} />}
        </div>
      ))
    )}
  </Card>
);

function ClassfieldPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserFavorite, username } = useContext(UserContext);

  const [classfield, setClassfield] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resContent, resComments, blockchainStatus] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/classfields/${id}/`),
          axios.get(`http://127.0.0.1:8000/api/comments/?classfield=${id}`),
          getIsPremiumStatus(Number(id)),
        ]);

        const currentIsPremium = blockchainStatus || resContent.data.premiumtag;
        setClassfield({ ...resContent.data, premiumtag: currentIsPremium });
        setComments(resComments.data.results || []);
        setIsPremium(currentIsPremium);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!username) return;
      try {
        const data = await getUserFavorite(id);
        setFavorite(data?.results?.[0] || null);
      } catch (e) {
        console.error("Favorite status error", e);
      }
    };
    checkStatus();
  }, [id, username, getUserFavorite]);

  const handleBuyPremium = async () => {
    if (isPremium) return message.info("Це оголошення вже має Premium статус");
    
    setPremiumLoading(true);
    try {
      const success = await buyPremiumTag(Number(id));
      if (success) {
        const token = localStorage.getItem("access_token");
        await axios.patch(
          `http://127.0.0.1:8000/api/classfields/${id}/`,
          { premiumtag: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsPremium(true);
        setClassfield((prev) => ({ ...prev, premiumtag: true }));
        message.success("Преміум успішно придбано!");
      }
    } catch (error) {
      message.error("Не вдалося завершити покупку");
    } finally {
      setPremiumLoading(false);
    }
  };

  const addToFavorite = async () => {
    if (!username) return message.warning("Please log in to add favorites");
    
    setBtnLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      if (favorite) {
        await axios.delete(`http://127.0.0.1:8000/api/favorites/${favorite.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorite(null);
        message.success("Removed from favorites");
      } else {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/favorites/`,
          { classfield: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorite(response.data);
        message.success("Added to favorites");
      }
    } catch (error) {
      message.error("Action failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "50px" }}><Skeleton active /></div>;
  if (!classfield) return <Empty description="Оголошення не знайдено" style={{ marginTop: 100 }} />;

  return (
    <div style={{ padding: "25px", backgroundColor: "#f0f2f5", minHeight: "810px", borderRadius: 10 }}>
      <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
        Back
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div style={{ position: "relative" }}>
            {isPremium && (
              <Tag color="gold" style={{ position: "absolute", top: 15, left: 15, zIndex: 2, fontSize: "14px", padding: "4px 12px", fontWeight: "bold", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                ★ PREMIUM
              </Tag>
            )}
            <Card
              styles={{ body: { padding: 0 } }}
              cover={
                <img
                  alt={classfield.title}
                  src={classfield.photo || "https://sesupport.edumall.jp/hc/article_attachments/900009570963/noImage.jpg"}
                  style={{ borderRadius: "12px", height: "500px", objectFit: "cover", border: isPremium ? "4px solid #fadb14" : "none" }}
                />
              }
              style={{ borderRadius: "12px" }}
            />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Card style={{ borderRadius: "12px", height: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: 16 }}>
              <Tag color="blue" icon={<TagOutlined />}>{classfield.category_title || "General"}</Tag>
              <Text type="secondary" style={{ marginLeft: 10 }}><CalendarOutlined /> Posted: {classfield.date?.slice(0, 10)}</Text>
            </div>
            <Title level={2}>{classfield.title}</Title>
            <Title level={3} style={{ color: "#1890ff", marginTop: 0 }}>{classfield.price?.toLocaleString()} ₴</Title>
            <Divider />
            <Title level={4}>Description</Title>
            <Paragraph style={{ fontSize: "16px", color: "#595959" }}>{classfield.description}</Paragraph>
            <Divider />
            <div style={{ padding: "15px", backgroundColor: "#fafafa", borderRadius: "8px", border: "1px solid #f0f0f0", marginBottom: 20 }}>
              <Space align="center" size="large">
                <Avatar size={64} icon={<UserOutlined />} src={classfield.owner_avatar} />
                <div>
                  <Text type="secondary" style={{ display: "block" }}>Seller</Text>
                  <Text strong style={{ fontSize: "18px" }}>{classfield.owner_name || "Unknown User"}</Text>
                </div>
              </Space>
            </div>
            <ActionButtons
              username={username}
              ownerName={classfield.owner_name}
              isPremium={isPremium}
              premiumLoading={premiumLoading}
              handleBuyPremium={handleBuyPremium}
              btnLoading={btnLoading}
              addToFavorite={addToFavorite}
              isFavorite={favorite !== null}
            />
          </Card>
        </Col>
      </Row>
      <CommentsSection comments={comments} />
    </div>
  );
}

export default ClassfieldPage;
