import React, { useState, useEffect } from 'react';
import recipeCategoryMapping from './recipeCategoryMapping';

function RecipeFilter({ onFilterChange, selectedCategories }) {
  const [selectedFilters, setSelectedFilters] = useState(selectedCategories || []);

  const handleFilterChange = (category) => {
    setSelectedFilters((prevState) => {
      if (prevState.includes(category)) {
        return prevState.filter((item) => item !== category);
      } else {
        return [...prevState, category];
      }
    });
  };

  useEffect(() => {
    setSelectedFilters(selectedCategories);
  }, [selectedCategories]);

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Фільтр</h2>
      {Object.entries(recipeCategoryMapping).map(([category, displayName]) => (
        <div key={category} className="mb-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={selectedFilters.includes(category)}
              onChange={() => handleFilterChange(category)}
            />
            <span className="ml-2">{displayName}</span>
          </label>
        </div>
      ))}
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => onFilterChange(selectedFilters)}>
        Застосувати фільтри
      </button>
    </div>
  );
}

export default RecipeFilter;
