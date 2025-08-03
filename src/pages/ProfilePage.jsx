import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-bold">Welcome, {user?.name || "Guest"}</h2>
      <p>Email: {user?.email}</p>
      <button
        onClick={() => navigate("/my-profile")}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Upload Paper
      </button>
    </div>
  );
};

export default ProfilePage;
