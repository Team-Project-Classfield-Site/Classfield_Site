import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({
  username: null,
  setUsername: () => {},
  isAuth: () => null,
  clear: () => {},
  getUserFavorites: () => {},
  getUserFavorite: () => {},
});

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || null,
  );

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  const clear = () => {
    setUsername(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
  };

  const isAuth = () => username !== null;

  const getUserFavorites = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return { results: [] };

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/favorites/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return { results: [] };
    }
  };

  const getUserFavorite = async (classfieldId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return { results: [] };

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/favorites/`, {
        params: { classfield: classfieldId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return { results: [] };
    }
  };

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        clear,
        isAuth,
        getUserFavorites,
        getUserFavorite,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
