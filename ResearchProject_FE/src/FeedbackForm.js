import React, { useState } from "react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    fontColor: "",
    fontSize: "",
    alignment: "",
    colorScheme: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data); // Update UI with predictions
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Font Color:
        <input type="text" name="fontColor" value={formData.fontColor} onChange={handleChange} />
      </label>
      <br />
      <label>
        Font Size:
        <input type="text" name="fontSize" value={formData.fontSize} onChange={handleChange} />
      </label>
      <br />
      <label>
        Alignment:
        <input type="text" name="alignment" value={formData.alignment} onChange={handleChange} />
      </label>
      <br />
      <label>
        Color Scheme:
        <input type="text" name="colorScheme" value={formData.colorScheme} onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FeedbackForm;
