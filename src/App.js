import React, { useState, useEffect } from "react";
import SingleSelect from "./components/SingleSelect";
import MultiSelect from "./components/MultiSelect";

export default function App() {
  // State for managing rows in the table
  const [rows, setRows] = useState([
    { id: "1", singleSelect: "", multiSelect: [] },
  ]);

  // State for managing theme (light/dark)
  const [theme, setTheme] = useState("light");

  // Load saved rows and theme from localStorage when the app initializes
  useEffect(() => {
    const savedRows = JSON.parse(localStorage.getItem("rows")) || [
      { id: "1", singleSelect: "", multiSelect: [] },
    ];
    setRows(savedRows);

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Save rows to localStorage whenever rows change
  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  // Save theme to localStorage and apply it
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Function to add a new row
  const addRow = () => {
    setRows([
      ...rows,
      { id: `${rows.length + 1}`, singleSelect: "", multiSelect: [] },
    ]);
  };

  // Function to update the selected value of single select for a row
  const updateSingleSelect = (rowId, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, singleSelect: value } : row
      )
    );
  };

  // Function to update the selected multi select values for a row
  const updateMultiSelect = (rowId, values) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, multiSelect: values } : row
      )
    );
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-4">PICK MATE</h1>
      <p className="text-center mb-6">
        Customize rows with single and multi-select options. Choices are saved
        locally and persist after refresh.
      </p>

      {/* Button to toggle between light and dark themes */}
      <button
        onClick={toggleTheme}
        className="btn btn-primary mb-4 mx-auto block"
      >
        Toggle Theme
      </button>

      {/* Table structure to display rows */}
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Label 1</th>
            <th className="border px-4 py-2">Label 2</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through rows to display them in the table */}
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`${theme === "dark" ? "" : "hover:bg-gray-50"}`}
            >
              <td className="border px-4 py-2">
                <SingleSelect
                  rowId={row.id}
                  selectedOptions={rows.map((r) => r.singleSelect)}
                  updateSelectedOptions={updateSingleSelect}
                />
              </td>
              <td className="border px-4 py-2">
                <MultiSelect
                  rowId={row.id}
                  selectedMultiOptions={row.multiSelect}
                  updateSelectedMultiOptions={updateMultiSelect}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to add a new row */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 m-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          onClick={addRow}
        >
          + Add New Row
        </button>
      </div>
    </div>
  );
}
