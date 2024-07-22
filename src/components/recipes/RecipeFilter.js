import React, { useState, useEffect } from 'react';
import recipeCategoryMapping from './recipeCategoryMapping';

function RecipeFilter({ onFilterChange, selectedCategories = [], selectedCalories = 'ALL' }) {
  const [selectedCategoriesFilters, setSelectedCategoriesFilters] = useState(selectedCategories);
  const [selectedCaloriesFilter, setSelectedCaloriesFilter] = useState(selectedCalories);

  const caloriesMapping = {
    'LESS_100': '<100 ккал',
    'MORE_100_LESS_200': '100-200 ккал',
    'MORE_200_LESS_300': '200-300 ккал',
    'MORE_300_LESS_400': '300-400 ккал',
    'MORE_400_LESS_500': '400-500 ккал',
    'MORE_500': '>500 ккал',
    'ALL': 'Всі',
  };

  const handleCategoryFilterChange = (category) => {
    setSelectedCategoriesFilters((prevState) => {
      if (prevState.includes(category)) {
        return prevState.filter((item) => item !== category);
      } else {
        return [...prevState, category];
      }
    });
  }

  const handleCaloriesFilterChange = (calories) => {
    setSelectedCaloriesFilter(calories);
  };

  useEffect(() => {
    setSelectedCategoriesFilters(selectedCategories);
    setSelectedCaloriesFilter(selectedCalories);
  }, [selectedCategories, selectedCalories]);

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Фільтр</h2>
      <div className="flex">
        <div className="text-sm pr-7">
          <h4 className="text-base mb-4">Категорія</h4>
          {Object.entries(recipeCategoryMapping).map(([category, displayName]) => (
            <div key={category} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedCategoriesFilters.includes(category)}
                  onChange={() => handleCategoryFilterChange(category)}
                />
                <span className="ml-2">{displayName}</span>
              </label>
            </div>
          ))}
        </div>
        <div className="text-sm pr-7">
          <h4 className="text-base mb-4">Калорійність</h4>
          {Object.entries(caloriesMapping).map(([calories, displayName]) => (
            <div key={calories} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedCaloriesFilter == calories}
                  onChange={() => handleCaloriesFilterChange(calories)}
                />
                <span className="ml-2">{displayName}</span>
              </label>
              </div>
            ))}
        </div>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => onFilterChange(selectedCategoriesFilters, selectedCaloriesFilter)}>
        Застосувати фільтри
      </button>
    </div>
  );
}

export default RecipeFilter;
