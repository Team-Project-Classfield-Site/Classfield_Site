import ClassfieldCard from "../components/ClassfieldCard";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../components/Pagination";
import { UserContext } from "../contexts/user.context";
import { useState, useEffect, useContext } from "react";

const HomePage = () => {
  const {
    data: classfields,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    loading,
    error,
  } = usePagination("classfields/");

  const { data: categories } = usePagination("categories/");
  const { getUserFavorites, username } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getUserFavorites();
      setFavorites(data.results || []);
    };

    if (username) {
      fetchItems();
    } else {
      setFavorites([]);
    }
  }, [username, getUserFavorites]);

  if (loading)
    return <div style={{ textAlign: "center" }}>Завантаження...</div>;
  if (error)
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;

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
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "36px", paddingBottom: "15px" }}>
          Актуальні оголошення
        </h1>
        <p style={{ color: "#ffffff", paddingBottom: "50px" }}>
          Всього на сайті: {totalCount} товарів
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "50px 0px",
          borderRadius: "20px",
          boxShadow: "0 -10px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            justifyContent: "center",
          }}
        >
          {classfields?.map((item) => {
            const favoriteEntry = favorites.find(
              (fav) => Number(fav.classfield) === Number(item.id),
            );

            return (
              <ClassfieldCard
                key={item.id}
                favorite_id={favoriteEntry ? favoriteEntry.id : null}
                classfield={item}
                categories={categories}
              />
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
