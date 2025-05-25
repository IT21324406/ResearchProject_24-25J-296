// import React from "react";

// const ErrorPage = () => {
//   return (
//     <div style={{ textAlign: "center", padding: "12px" }}>
//       <h2 style={{ color: "red", fontSize: "1rem" }}>❌ Error Fetching Data</h2>
//       <p>Something went wrong while fetching or applying your preferences.</p>
//     </div>
//   );
// };

// export default ErrorPage;


import React from "react";

const ErrorPage = () => (
  <div style={{
    
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fef2f2"
  }}>
    <div style={{ fontSize: "60px", color: "#ef4444", marginBottom: "16px" }}>
        <i className="fas fa-frown"></i>
      </div>  
    <h2 style={{ color: "#b91c1c", margin: "10px 0" }}>OOPS </h2>
    <p style={{ color: "#6b7280", fontSize: "14px" }}>
      Something went wrong.
    </p>
  </div>
);

export default ErrorPage;
