import ClassfieldCard from "../components/ClassfieldCard";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../components/Pagination";

const HomePage = () => {
  const {
    data: classfields,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    loading,
    error,
    search,
    handleSearch,
  } = usePagination("classfields/");
  const { data: categories } = usePagination("categories/");

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

     <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Пошук за назвою..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />
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
        {classfields?.length === 0 && (
            <p style={{ color: "#999" }}>Нічого не знайдено</p>
        )}
        {classfields?.map((item) => (
          <ClassfieldCard
            key={item.id}
            classfield={item}
            categories={categories}
          />
        ))}
      </div>

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
