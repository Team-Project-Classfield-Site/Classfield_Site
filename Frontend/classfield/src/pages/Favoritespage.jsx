import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/user.context";
import { Empty, Spin } from "antd";
import { HeartFilled } from "@ant-design/icons";
import ClassfieldCard from "../components/ClassfieldCard";

const FavoritesPage = () => {
  const { getUserFavorites, username } = useContext(UserContext);
  const [classfields, setClassfields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      if (!username) {
        setClassfields([]);
        setLoading(false);
        return;
      }

      try {
        // Крок 1: отримуємо список улюблених (містить лише ID оголошень)
        const favData = await getUserFavorites();
        const favorites = favData.results || [];

        if (favorites.length === 0) {
          setClassfields([]);
          setLoading(false);
          return;
        }

        // Крок 2: для кожного улюбленого завантажуємо повні дані оголошення
        const token = localStorage.getItem("access_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const classfieldRequests = favorites.map((fav) => {
          // classfield може бути числом (ID) або об'єктом
          const classfieldId =
            typeof fav.classfield === "object"
              ? fav.classfield?.id
              : fav.classfield;

          return axios
            .get(`http://127.0.0.1:8000/api/classfields/${classfieldId}/`, {
              headers,
            })
            .then((res) => res.data)
            .catch(() => null); // якщо оголошення видалене — пропускаємо
        });

        const results = await Promise.all(classfieldRequests);
        // Фільтруємо null (видалені оголошення)
        setClassfields(results.filter(Boolean));
      } catch (err) {
        console.error("Error loading favorites:", err);
        setClassfields([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [username, getUserFavorites]);

  return (
    <div>
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
        <h1
          style={{
            color: "#fff",
            fontSize: "36px",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <HeartFilled style={{ color: "#ff4d4f" }} />
          Улюблені оголошення
        </h1>
        <p style={{ color: "#ffffff", margin: 0 }}>
          {username
            ? `Збережено оголошень: ${classfields.length}`
            : "Увійдіть, щоб побачити улюблені"}
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "50px 0px",
          borderRadius: "20px",
          boxShadow: "0 -10px 20px rgba(0,0,0,0.05)",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent:
            loading || classfields.length === 0 ? "center" : "flex-start",
          alignItems:
            loading || classfields.length === 0 ? "center" : "stretch",
        }}
      >
        {loading ? (
          <Spin size="large" />
        ) : !username ? (
          <Empty
            description={
              <span>
                Будь ласка,{" "}
                <Link to="/login" style={{ color: "#03498b" }}>
                  увійдіть
                </Link>{" "}
                щоб побачити улюблені оголошення
              </span>
            }
          />
        ) : classfields.length === 0 ? (
          <Empty
            image={
              <HeartFilled style={{ fontSize: 64, color: "#ffccc7" }} />
            }
            description={
              <span style={{ color: "#aaa", fontSize: "16px" }}>
                У вас ще немає улюблених оголошень
              </span>
            }
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "29px",
              justifyContent:
                classfields.length === 1 ? "center" : "flex-start",
              padding: "0 40px",
            }}
          >
            {classfields.map((item) => (
              <ClassfieldCard
                key={item.id}
                classfield={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;