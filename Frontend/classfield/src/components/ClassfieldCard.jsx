import { useState, useEffect, useContext } from "react";
import { Card, Button, message, Tag } from "antd";
import { Link } from "react-router-dom";
import { CrownFilled } from "@ant-design/icons";
import axios from "axios";
import { UserContext } from "../contexts/user.context";
import { getIsPremiumStatus } from "../utilites/blockchainUtils";

const { Meta } = Card;

export default function ClassfieldCard({ classfield, categories }) {
  const { id, photo, title, description, category, date, premiumtag } =
    classfield;
  const { getUserFavorite, username } = useContext(UserContext);

  const [favorite, setFavorite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(premiumtag);

  useEffect(() => {
    const checkStatus = async () => {
      if (username) {
        const data = await getUserFavorite(id);
        if (data?.results?.length > 0) {
          setFavorite(data.results[0]);
        } else {
          setFavorite(null);
        }
      }

      try {
        const blockchainStatus = await getIsPremiumStatus(Number(id));
        if (blockchainStatus !== premiumtag) {
          setIsPremium(blockchainStatus || premiumtag);
        }
      } catch (e) {
        console.error("Blockchain sync error for card:", id, e);
      }
    };
    checkStatus();
  }, [id, username, getUserFavorite, premiumtag]);

  const addToFavorite = async () => {
    if (!username) {
      message.warning("Please log in to add favorites");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      if (favorite) {
        await axios.delete(
          `http://127.0.0.1:8000/api/favorites/${favorite.id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
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
      message.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      hoverable
      style={{
        width: "325px",
        borderRadius: "12px",
        overflow: "hidden",
        border: isPremium ? "3px solid #fadb14" : "1px solid #e0e0e0",
        boxShadow: isPremium ? "0 4px 15px rgba(250, 219, 20, 0.4)" : "none",
        transition: "all 0.3s ease",
      }}
      cover={
        <div style={{ position: "relative" }}>
          {isPremium && (
            <Tag
              color="gold"
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 2,
                fontWeight: "bold",
                borderRadius: "4px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              <CrownFilled /> PREMIUM
            </Tag>
          )}
          <img
            style={{ height: "300px", objectFit: "cover", width: "100%" }}
            draggable={false}
            alt={title}
            src={
              photo ||
              "https://sesupport.edumall.jp/hc/article_attachments/900009570963/noImage.jpg"
            }
          />
        </div>
      }
      actions={[
        <div style={{ display: "flex", padding: "0 10px", gap: "10px" }}>
          <Button
            block
            loading={loading}
            onClick={addToFavorite}
            style={{
              backgroundColor: favorite ? "#ff4d4f" : "#ffffff",
              color: favorite ? "#ffffff" : "#003a8c",
              borderColor: favorite ? "#ff4d4f" : "#91d5ff",
              fontWeight: "500",
              width: "140px",
            }}
          >
            {favorite ? "In Favorites" : "Favorite"}
          </Button>

          <Link to={`/classfield_page/${id}`} style={{ flex: 1 }}>
            <Button
              block
              type="primary"
              style={{
                backgroundColor: isPremium ? "#fadb14" : "#0050b3",
                borderColor: isPremium ? "#fadb14" : "#0050b3",
                color: isPremium ? "#000" : "#fff",
                fontWeight: "600",
                width: "140px",
              }}
            >
              Details
            </Button>
          </Link>
        </div>,
      ]}
    >
      <Meta
        title={
          <div style={{ textAlign: "center", marginBottom: "4px" }}>
            <span
              style={{
                color: isPremium ? "#d4b106" : "#000000",
                fontSize: "20px",
                fontWeight: "bold",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {isPremium && <CrownFilled style={{ marginRight: 5 }} />}
              {title}
            </span>
          </div>
        }
        description={
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "10px" }}>
              <span
                style={{
                  color: "#1890ff",
                  fontWeight: "600",
                  backgroundColor: "#e6f7ff",
                  padding: "2px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                }}
              >
                {categories?.find((c) => c.id === category)?.title || "General"}
              </span>
            </div>
            <p
              style={{
                color: "#595959",
                fontSize: "14px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "40px",
              }}
            >
              {description}
            </p>
            <div
              style={{
                borderTop: "1px solid #f0f0f0",
                paddingTop: "8px",
                fontSize: "12px",
                fontStyle: "italic",
                color: isPremium ? "#8c8c8c" : "#bfbfbf",
              }}
            >
              Posted: {date?.slice(0, 10)}
            </div>
          </div>
        }
      />
    </Card>
  );
}
