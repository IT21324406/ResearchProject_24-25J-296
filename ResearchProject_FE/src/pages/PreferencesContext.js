import React, { createContext, useContext, useState } from "react";

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(null);

  
  const clearPreferences = () => {
    setPreferences({});
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences, clearPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

//export const usePreferences = () => useContext(PreferencesContext);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};