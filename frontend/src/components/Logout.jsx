import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate("/signin");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
      }}
      className="flex items-center justify-center text-gray-600 active:text-black"
    >
      <span className="text-4xl font-normal">
        <IoLogOutOutline />
      </span>
    </button>
  );
};
