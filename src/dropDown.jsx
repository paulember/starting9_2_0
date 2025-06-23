// DropdownComponent.js
import React, { useState } from "react";

const Dropdown = ({ options, onSelectionChange, isDisabled }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleDropdownChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onSelectionChange(newValue); // Call the callback function with the selected value
  };

  return (
    <select
      value={selectedValue}
      onChange={handleDropdownChange}
      disabled={isDisabled}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
