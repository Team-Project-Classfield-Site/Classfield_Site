import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/user.context";
import { useNavigate } from "react-router-dom";

function LogOutPage() {
  const { clear } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    clear();

    navigate("/");
  }, []);

  return <></>;
}

export default LogOutPage;
