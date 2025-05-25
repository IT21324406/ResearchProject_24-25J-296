import React from "react";
import { useNavigate } from "react-router-dom";

const FetchPage = ({ status }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h3>DATA FETCHING</h3>
      <p>{status}</p>
      <button onClick={() => navigate("/apply")} style={{ marginTop: "10px" }}>
        Fetch Data
      </button>
    </div>
  );
};

export default FetchPage;
