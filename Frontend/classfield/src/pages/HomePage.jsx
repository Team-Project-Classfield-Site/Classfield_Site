import ClassfieldCard from "../components/ClassfieldCard";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../components/Pagination";
import { UserContext } from "../contexts/user.context";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlPage = Number(searchParams.get("page")) || 1;
  const urlCategory = searchParams.get("category") || "";
  const urlOrdering = searchParams.get("ordering") || "";

  const [search, setSearch] = useState(urlSearch);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const queryParams = {};
  if (urlSearch) queryParams.search = urlSearch;
  if (urlCategory) queryParams.category = urlCategory;
  if (urlOrdering) queryParams.ordering = urlOrdering;

  const {
    data: classfields,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    loading,
    error,
  } = usePagination("classfields/", queryParams, urlPage);

  const { data: categories } = usePagination("categories/");
  const { getUserFavorites, username } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (currentPage === urlPage) return;

    const params = Object.fromEntries(searchParams.entries());
    if (currentPage > 1) {
      params.page = currentPage;
    } else {
      delete params.page; 
    }
    setSearchParams(params, { replace: true });
  }, [currentPage, searchParams, setSearchParams, urlPage]);

  const handleFilterChange = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    
    delete params.page;
    setSearchParams(params, { replace: true });
    setCurrentPage(1);
  };

  const handleSearch = () => {
    handleFilterChange("search", search);
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

  if (loading && !classfields)
    return <div style={{ textAlign: "center", padding: "50px" }}>Завантаження...</div>;
  if (error)
    return <div style={{ color: "red", textAlign: "center", padding: "50px" }}>{error}</div>;

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
          {urlSearch === "" && urlCategory === ""
            ? `Всього на сайті: ${totalCount || 0} товарів`
            : `За вашим запитом знайдено: ${totalCount || 0} товарів`}
        </p>
      </div>

      {}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
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

        {}
        <select
          value={urlCategory}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
            minWidth: "150px",
          }}
        >
          <option value="">Всі категорії</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name || cat.title} 
            </option>
          ))}
        </select>

        {}
<select
  value={urlOrdering}
  onChange={(e) => handleFilterChange("ordering", e.target.value)}
  style={{
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    minWidth: "180px",
  }}
>
  <option value="">Сортувати за...</option>
  <option value="price">Спочатку дешевші</option>
  <option value="-price">Спочатку дорожчі</option>
  <option value="-date">Найновіші</option>  
  <option value="date">Найстаріші</option>
</select>

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
            {classfields?.map((item) => (
              <ClassfieldCard
                key={item.id}
                classfield={item}
                categories={categories}
              />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "auto", paddingBottom: "20px" }}>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;