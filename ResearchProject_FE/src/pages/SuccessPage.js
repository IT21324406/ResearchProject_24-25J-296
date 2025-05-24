// import React from "react";

// const SuccessPage = () => (
//   <div>
//     <h3>PREFERENCES APPLIED</h3>
//     <div style={{ fontSize: "40px", color: "green" }}>✔️</div>
//     <p>Success! Preferences have been applied.</p>
//   </div>
// );

// export default SuccessPage;

import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {

  const navigate = useNavigate(); // ✅ Must be inside the component

  const handleNavigate = () => {
    navigate("/preferences");
  };

  return (
  <div style={{

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4"
  }}>
     <button
        onClick={handleNavigate}
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        PREFERENCES APPLIED
      </button>
    <div style={{ fontSize: "60px", color: "#22c55e", marginBottom: "16px" }}>
        <i className="fa-solid fa-check"></i>
      </div>
    <h2 style={{ margin: "10px 0", textAlign:"center" }}>SUCCESS!</h2>
    <p style={{ color: "#4b5563", fontSize: "14px" , textAlign: "center"}}>
      Preferences are applied successfully!
    </p>
  </div>
);
}

export default SuccessPage;
