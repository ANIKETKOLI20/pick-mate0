import { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function MultiSelect({ rowId, selectedMultiOptions, updateSelectedMultiOptions }) {
  const [options, setOptions] = useLocalStorage("defaultOptions", ["Option 1", "Option 2", "Option 3", "Option 4"]);
  const [selected, setSelected] = useLocalStorage(`multiSelectOptions-${rowId}`, []);
  const [newOption, setNewOption] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  // Function to toggle options in multi-select
  const toggleOption = (option) => {
    const updated = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];

    setSelected(updated);
    updateSelectedMultiOptions(rowId, updated);
  };

  // Function to add new custom options
  const addOption = () => {
    if (!newOption.trim()) return;

    if (options.includes(newOption)) {
      setError("This option already exists!");
      return;
    }

    if (options.length >= 6) {
      setError("You can add up to 6 custom options.");
      return;
    }

    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    setNewOption("");
    setError("");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex items-center justify-between px-3 py-2 border-2 rounded-md cursor-pointer ${dropdownOpen ? "border-blue-500" : "border-gray-300"}`}
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <div className="flex flex-wrap gap-2">
          {selected.length ? (
            selected.map((option) => (
              <span key={option} className="flex items-center gap-2 p-2 rounded-lg bg-gray-300 text-black hover:bg-gray-600">
                {option}
                <button
                  className="text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(option);
                  }}
                >
                  <X size={16} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500">Select Options</span>
          )}
        </div>
        <span className={`ml-2 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={16} />
        </span>
      </div>

      {dropdownOpen && (
        <ul className="absolute z-10 mt-2 p-2 bg-gray-100 border rounded-md shadow max-h-60 overflow-auto">
          {options.map((option) => (
            <li key={option} className="py-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleOption(option)}
                />
                {option}
              </label>
            </li>
          ))}
          <li className="mt-2 flex items-center gap-2">
            <input
              type="text"
              className="input input-bordered flex-grow"
              placeholder="Add new option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <button onClick={addOption} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400" disabled={!newOption.trim()}>
              + Add
            </button>
          </li>
        </ul>
      )}

      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
}
