import React, { useState } from "react";
//import { useNavigate } from "react-router-dom"; // import useNavigate
import { usePreferences } from "./PreferencesContext";
import "../css/PreferencesPage.css"; // You can place the styles here

const PreferencesPage = () => {
  const { preferences } = usePreferences();
  const [openItem, setOpenItem] = useState(null);
  //const navigate = useNavigate();

  const toggleItem = (key) => {
    setOpenItem(openItem === key ? null : key);
  };

  return (
    <div className="preferences-container">
    <button className="remove-btn" onClick={() => window.location.href = 'landing.html'}>BACK</button>
      {/* <button className="remove-btn" onClick={() => navigate("/")}>BACK</button>    */}
      <div className="details-box">
        <h2>Detail View</h2>
        <div className="preference-list">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="preference-item">
              <div className="preference-header" onClick={() => toggleItem(key)}>
                <span className={`arrow ${openItem === key ? "up" : "down"}`}>✔</span>
                <span className="label">{key.replace(/([A-Z])/g, ' $1')}</span>
              </div>
              {openItem === key && <div className="preference-value">{value}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;

// import React, { useState } from "react";
// import { usePreferences } from "./PreferencesContext";
// import { useNavigate } from "react-router-dom";
// import "../css/PreferencesPage.css";

// const PreferencesPage = () => {
//   const { preferences, clearPreferences } = usePreferences();
//   const [openItem, setOpenItem] = useState(null);
//   const navigate = useNavigate();

//   const toggleItem = (key) => {
//     setOpenItem(openItem === key ? null : key);
//   };

//   // const handleRemovePreferences = () => {
//   //   clearPreferences(); // Clear from context

//   //   // Optional: Clear from backend
//   // fetch("http://127.0.0.1:5000/clear-data", {
//   //   method: "POST",
//   // })
//   //   .then((res) => {
//   //     if (!res.ok) {
//   //       console.error("Failed to delete preferences on server");
//   //     }
//   //   })
//   //   .catch((err) => console.error("Error deleting preferences:", err));

//   //   navigate("/"); // Redirect to homepage
//   // };

//   return (
//     <div className="preferences-container">
//       <button className="remove-btn" onClick={handleRemovePreferences}>
//         REMOVE PREFERENCES
//       </button>
//       <div className="details-box">
//         <h2>Detail View</h2>
//         <div className="preference-list">
//           {Object.entries(preferences).map(([key, value]) => (
//             <div key={key} className="preference-item">
//               <div className="preference-header" onClick={() => toggleItem(key)}>
//                 <span className={`arrow ${openItem === key ? "up" : "down"}`}>✔</span>
//                 <span className="label">{key.replace(/([A-Z])/g, ' $1')}</span>
//               </div>
//               {openItem === key && <div className="preference-value">{value}</div>}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PreferencesPage;
