import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import ClassfieldCard from "../components/ClassfieldCard";
import { UserContext } from "../contexts/user.context";
import { usePagination } from "../hooks/usePagination";

const MyAdsPage = () => {
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = useContext(UserContext);
  const navigate = useNavigate();
  const { data: categories } = usePagination("categories/");

  const fetchMyAds = useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `classfields/?author__username=${username}`,
      );
      setMyAds(
        Array.isArray(response.data.results)
          ? response.data.results
          : response.data,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchMyAds();
  }, [fetchMyAds]);

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені?")) return;
    try {
      await axiosInstance.delete(`classfields/${id}/`);
      setMyAds((prev) => prev.filter((ad) => ad.id !== id));
    } catch (error) {
      alert("Помилка");
    }
  };

  if (loading) return <div className="p-10 text-white">Завантаження...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-3xl font-bold text-white"
            style={{ textAlign: "center" }}
          >
            Мої оголошення
          </h1>
          <p className="text-gray-400" style={{ textAlign: "center" }}>
            Керуйте своїми пропозиціями на маркетплейсі
          </p>
        </div>
        <button
          onClick={() => navigate("/add-ad")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors"
          style={{ margin: "20px 0px 20px 20px", width: "320px" }}
        >
          + Додати оголошення
        </button>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          paddingLeft: "20px",
        }}
      >
        {myAds.map((ad) => (
          <div key={ad.id} className="flex flex-col h-full">
            <div className="flex-grow">
              <ClassfieldCard classfield={ad} categories={categories} />
            </div>
            <div
              className="mt-3 flex flex-row gap-2"
              style={{ marginTop: "10px" }}
            >
              <button
                onClick={() => navigate(`/edit-ad/${ad.id}`)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-yellow-500 py-2 rounded-lg text-sm font-semibold transition-colors border border-zinc-700"
                style={{ width: "155px" }}
              >
                Редагувати
              </button>
              <button
                onClick={() => handleDelete(ad.id)}
                className="flex-1 bg-zinc-800 hover:bg-red-900/30 text-red-500 py-2 rounded-lg text-sm font-semibold transition-colors border border-zinc-700"
                style={{ width: "155px", marginLeft: "15px" }}
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAdsPage;
