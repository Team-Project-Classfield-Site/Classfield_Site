import React from "react";
import { Card, Button } from "antd";
import { Link } from 'react-router-dom';

const { Meta } = Card;

export default function ClassfieldCard({ classfield, categories }) {
  const { id, photo, title, description, category, date } = classfield;

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
          {/* ToDo: додати перевірку чи огологення є в улюбленому */}
          <Link to={`/add_favorite/${id}`} style={{ flex: 1 }}>
            <Button
              block
              style={{
                backgroundColor: "#ffffff",
                color: "#003a8c",
                borderColor: "#91d5ff",
                fontWeight: "500",
              }}
            >
              Add to favorite
            </Button>
          </Link>

          <Link to={`/classfield_page/${id}`} style={{ flex: 1 }}>
            <Button
              block
              type="primary"
              style={{
                backgroundColor: "#0050b3",
                borderColor: "#0050b3",
                fontWeight: "500",
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
                  letterSpacing: "0.5px",
                }}
              >
                {categories.find((c) => c.id === category)?.title ||
                  "General"}
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
                margin: "0px 0",
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
