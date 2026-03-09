import { Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

const developers = [
  {
    id: 1,
    name: "zdkazuha",
    role: "Frontend Developer",
    color: "#0050b3",
    tasks: [
      "Розробка головної сторінки",
      "Компонент карток оголошень",
      "Реалізував блокчейн функціонал",
    ],
    description:
      "Відповідав за розробку інтерфейсу головної сторінки, реалізацію карток оголошень.",
  },
  {
    id: 2,
    name: "uankee",
    role: "Backend Developer",
    color: "#006d75",
    tasks: ["CRUD", "z", "z"],
    description:
      "CRUD...",
  },
  {
    id: 3,
    name: "Jar1kkk",
    role: "carry",
    color: "#531dab",
    tasks: ["Пагінація", "JWT аутентифікація", "Улюблені"],
    description:
      "Реалізував сторінку улюблене, фільтр по назві, пагінацію та систему JWT аутентифікації.",
  },
  {
    id: 4,
    name: "Clyde",
    role: "moral support",
    color: "#874d00",
    tasks: ["support", "mentor", ""],
    description:
      "Підтримував моральних дух команди і налаштовував на потужну працю.",
  },
  {
    id: 5,
    name: "ChatGPT",
    role: "Helper",
    color: "#820014",
    tasks: ["helped everyone at any time"],
    description:
      "Допомагав кожному в будь який час.",
  },
];

const DeveloperCard = ({ dev }) => (
  <div
    style={{
      width: "300px",
      borderRadius: "16px",
      border: "1px solid #e8e8e8",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 24px 24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.3s, transform 0.3s",
      cursor: "default",
      gap: "0",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    {/* Avatar */}
    <Avatar
      size={80}
      icon={<UserOutlined />}
      style={{ backgroundColor: dev.color, fontSize: "32px", marginBottom: "14px" }}
    />

    {/* Name */}
    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#000", marginBottom: "12px", textAlign: "center" }}>
      {dev.name}
    </div>

    {/* Description */}
    <p style={{
      color: "#595959",
      fontSize: "14px",
      textAlign: "center",
      margin: "0 0 20px 0",
      lineHeight: "1.6",
      flex: 1,
    }}>
      {dev.description}
    </p>

    {/* Divider */}
    <div style={{ width: "100%", height: "1px", backgroundColor: "#f0f0f0", marginBottom: "20px" }} />

    {/* Tasks */}
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      width: "100%",
      height: "108px",
      marginBottom: "16px",
    }}>
      {dev.tasks.map((task, i) => (
        <Tag
          key={i}
          color="blue"
          style={{
            borderRadius: "20px",
            padding: "4px 14px",
            fontSize: "13px",
            margin: 0,
            textAlign: "center",
          }}
        >
          {task}
        </Tag>
      ))}
    </div>

    {/* Divider */}
    <div style={{ width: "100%", height: "1px", backgroundColor: "#f0f0f0", marginBottom: "16px" }} />

    {/* Role */}
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Tag
        color={dev.color}
        style={{
          fontSize: "14px",
          padding: "6px 20px",
          borderRadius: "20px",
          fontWeight: 600,
          margin: 0,
        }}
      >
        {dev.role}
      </Tag>
    </div>
  </div>
);

const DevelopersPage = () => {
  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: "#03498b",
          padding: "30px 20px",
          textAlign: "center",
          marginBottom: "30px",
          borderRadius: 20,
          height: "135px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "36px", margin: 0 }}>
          Команда розробників
        </h1>
        <p style={{ color: "#ffffffcc", margin: 0 }}>
          Люди, які створили цей проект
        </p>
      </div>

      {/* Cards container */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "50px 40px",
          borderRadius: "20px",
          boxShadow: "0 -10px 20px rgba(0,0,0,0.05)",
          minHeight: "400px",
          marginLeft: "65px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "29px",
            justifyContent: "flex-start",
          }}
        >
          {developers.map((dev) => (
            <DeveloperCard key={dev.id} dev={dev} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevelopersPage;
