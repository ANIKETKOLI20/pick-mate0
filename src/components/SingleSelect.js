import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SingleSelect({ rowId, selectedOptions, updateSelectedOptions }) {
  // Local state for the selected option
  const [selected, setSelected] = useState("");

  useEffect(() => {
    // Check if the selected option for this row is stored in localStorage
    const savedSelection = localStorage.getItem(`singleSelect-${rowId}`);
    if (savedSelection) {
      setSelected(savedSelection);
    }
  }, [rowId]);

  useEffect(() => {
    if (selected !== "") {
      // Save selected option to localStorage whenever it changes
      localStorage.setItem(`singleSelect-${rowId}`, selected);
    }
  }, [selected, rowId]);

  const [availableOptions, setAvailableOptions] = useState([]);

  useEffect(() => {
    const defaultOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];

    // Initialize globallySelected if not present
    const globallySelected = JSON.parse(localStorage.getItem("globallySelectedOptions")) || [];
    if (!localStorage.getItem("defaultOptions")) {
      localStorage.setItem("defaultOptions", JSON.stringify(defaultOptions));
    }

    // Filter available options by excluding globally selected options
    const storedOptions = JSON.parse(localStorage.getItem("defaultOptions"));
    setAvailableOptions(storedOptions.filter(option => !globallySelected.includes(option)));
  }, [selectedOptions]);

  const handleChange = (value) => {
    // Update globallySelectedOptions in localStorage
    let globallySelected = JSON.parse(localStorage.getItem("globallySelectedOptions")) || [];
    if (selected) {
      // Remove the previously selected option
      globallySelected = globallySelected.filter(option => option !== selected);
    }
    if (value) {
      // Add the new selection
      globallySelected.push(value);
    }
    localStorage.setItem("globallySelectedOptions", JSON.stringify(globallySelected));

    setSelected(value);
    updateSelectedOptions(rowId, value);
  };

  const handleClearSelection = () => {
    // Remove the selected option from localStorage
    let globallySelected = JSON.parse(localStorage.getItem("globallySelectedOptions")) || [];
    globallySelected = globallySelected.filter(option => option !== selected);
    localStorage.setItem("globallySelectedOptions", JSON.stringify(globallySelected));

    setSelected(""); // Clear the local selection state
    updateSelectedOptions(rowId, ""); // Inform the parent component that the option is cleared
  };

  return (
    <div>
      {selected ? (
        <button
          className="flex items-center gap-2 p-2 rounded-lg bg-gray-300 text-black hover:bg-gray-600"
          onClick={handleClearSelection} // Clear selection on click
        >
          {selected} <span className="ml-2 text-black"><X size={16} /></span>
        </button>
      ) : (
        <select
          className="select select-bordered w-full"
          value={selected}
          onChange={(e) => handleChange(e.target.value)} // Handle selection change
        >
          <option value="">Select Option</option>
          {availableOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
