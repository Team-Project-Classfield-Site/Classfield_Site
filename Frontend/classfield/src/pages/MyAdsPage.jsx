import { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axios";
import ClassfieldCard from "../components/ClassfieldCard";
import { UserContext } from "../contexts/user.context";

const MyAdsPage = () => {
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = useContext(UserContext);

  const fetchMyAds = async () => {
    try {
      const response = await axiosInstance.get(`classfields/?author__username=${username}`);
      setMyAds(response.data.results);
    } catch (error) {
      console.error("Помилка завантаження оголошень:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchMyAds();
  }, [username]);

  const handleDelete = async (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити це оголошення?")) {
      try {
        await axiosInstance.delete(`classfields/${id}/`);
        setMyAds(myAds.filter(ad => ad.id !== id));
      } catch (error) {
        alert("Помилка при видаленні");
      }
    }
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мої оголошення</h1>
        <button 
          onClick={() => window.location.href = '/add-ad'} 
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Додати нове
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {myAds.map(ad => (
          <div key={ad.id} className="relative">
            <ClassfieldCard classfield={ad} />
            <div className="mt-2 flex gap-2">
              <button 
                onClick={() => window.location.href = `/edit-ad/${ad.id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Редагувати
              </button>
              <button 
                onClick={() => handleDelete(ad.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
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