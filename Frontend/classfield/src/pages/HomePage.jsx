import ClassfieldCard from "../components/ClassfieldCard";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../components/Pagination";
import { UserContext } from "../contexts/user.context";
import { useState, useEffect, useContext } from "react";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: classfields,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    loading,
    error,
  } = usePagination("classfields/", searchQuery ? { search: searchQuery } : {});
  const { data: categories } = usePagination("categories/");
  const { getUserFavorites, username } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);

  const handleSearch = () => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

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
          {searchQuery == ""
            ? `Всього на сайті: ${totalCount} товарів`
            : `За вашим запитом на сайті знайдено: ${totalCount} товарів`}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Пошук по назві..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "300px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            background: "#03498b",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Знайти
        </button>
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
          justifyContent: classfields?.length === 0 ? "center" : "flex-start",
          alignItems: classfields?.length === 0 ? "center" : "stretch",
        }}
      >
        {classfields?.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: "18px" }}>
            Оголошень не знайдено
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "29px",
              justifyContent:
                classfields?.length === 1 ? "center" : "flex-start",
              padding: "0 40px",
            }}
          >
            {classfields?.map((item) => {
              return (
                <ClassfieldCard
                  key={item.id}
                  classfield={item}
                  categories={categories}
                />
              );
            })}
          </div>
        )}

        <div style={{ textAlign: "center", height: "0px" }}>
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
