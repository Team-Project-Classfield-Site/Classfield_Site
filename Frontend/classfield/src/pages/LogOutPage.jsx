import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/user.context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LogoutPage() {
  const { clear } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        if (!accessToken || !refreshToken) {
          finalize();
          return;
        }

        await axios.post(
          "http://127.0.0.1:8000/api/logout/",
          { refresh: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } catch (error) {
        console.error("Logout error:", error.response?.data || error.message);
      } finally {
        clear();

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/");
      }
    };

    performLogout();
  }, []);

  return <></>;
}

export default LogoutPage;
