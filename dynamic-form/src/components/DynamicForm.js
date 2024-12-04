import React, { useState } from "react";
import { formStructures } from "../data/formData";

const DynamicForm = () => {
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
    setFormData({});
    setProgress(0);
  };

  const handleChange = (e, fieldName) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    calculateProgress();
  };

  const calculateProgress = () => {
    const requiredFields = formStructures[formType]?.fields.filter((field) => field.required);
    const filledFields = requiredFields.filter((field) => formData[field.name]);
    setProgress((filledFields.length / requiredFields.length) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const structure = formStructures[formType];
    const errors = structure.fields
      .filter((field) => field.required && !formData[field.name])
      .map((field) => field.label);

    if (errors.length > 0) {
      alert(`Please fill out the following fields: ${errors.join(", ")}`);
      return;
    }
    setSubmittedData([...submittedData, { ...formData }]);
    setFormData({});
    setProgress(0);
    alert("Form submitted successfully!");
  };

  return (
    <div className="dynamic-form">
      <h1>Dynamic Form</h1>
      <select onChange={handleFormTypeChange} value={formType}>
        <option value="">Select Form Type</option>
        {Object.keys(formStructures).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      {formType && (
        <form onSubmit={handleSubmit}>
          {formStructures[formType]?.fields.map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              {field.type === "dropdown" ? (
                <select
                  onChange={(e) => handleChange(e, field.name)}
                  value={formData[field.name] || ""}
                  required={field.required}
                >
                  <option value="">Select</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  onChange={(e) => handleChange(e, field.name)}
                  value={formData[field.name] || ""}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}

      {progress > 0 && (
        <div>
          <h3>Progress: {progress.toFixed(0)}%</h3>
          <div style={{ width: `${progress}%`, backgroundColor: "green", height: "10px" }}></div>
        </div>
      )}

      {submittedData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(submittedData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {Object.values(data).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
                <td>
                  <button
                    onClick={() =>
                      setSubmittedData(submittedData.filter((_, idx) => idx !== index))
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DynamicForm;
