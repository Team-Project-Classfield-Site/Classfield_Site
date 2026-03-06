import { useState, useEffect, useContext } from "react";
import { Card, Button, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/user.context";

const { Meta } = Card;

export default function ClassfieldCard({
  classfield,
  categories,
}) {
  const { id, photo, title, description, category, date } = classfield;
  const { getUserFavorite, username } = useContext(UserContext);

  const [favorite, setFavorite] = useState(null);
  const [loading, setLoading] = useState(false);

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
    };
    checkStatus();
  }, [id, username]);

  const addToFavorite = async () => {
    if (!username) {
      message.warning("Please log in to add favorites");
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  const isFavorite = favorite !== null;

  return (
    <Card
      hoverable
      style={{
        width: "325px",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        overflow: "hidden",
      }}
      cover={
        <img
          style={{ height: "300px", objectFit: "cover" }}
          draggable={false}
          alt={title}
          src={
            photo ||
            "https://sesupport.edumall.jp/hc/article_attachments/900009570963/noImage.jpg"
          }
        />
      }
      actions={[
        <div style={{ display: "flex", padding: "0 10px", gap: "10px" }}>
          <Button
            block
            loading={loading}
            onClick={addToFavorite}
            style={{
              backgroundColor: isFavorite ? "#ff4d4f" : "#ffffff",
              color: isFavorite ? "#ffffff" : "#003a8c",
              borderColor: isFavorite ? "#ff4d4f" : "#91d5ff",
              fontWeight: "500",
              width: "150px",
            }}
          >
            {isFavorite ? "In Favorites" : "Add to favorite"}
          </Button>

          <Link to={`/classfield_page/${id}`} style={{ flex: 1 }}>
            <Button
              block
              type="primary"
              style={{
                backgroundColor: "#0050b3",
                borderColor: "#0050b3",
                fontWeight: "500",
                width: "150px",
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
                color: "#000000",
                fontSize: "20px",
                fontWeight: "bold",
                display: "block",
              }}
            >
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