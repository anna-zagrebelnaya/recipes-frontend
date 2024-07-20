import React, { useState, useEffect, useRef } from 'react';

function IngredientDropdown({ index, ingredient, handleChangeIngredient, products }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  const filterIngredientSuggestions = (input) => {
    const filteredSuggestions = products.filter((product) =>
      product.name.toLowerCase().startsWith(input.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
    setHighlightedIndex(-1); // Reset highlighted index when filtering
  };

  useEffect(() => {
    if (ingredient.productName) {
      filterIngredientSuggestions(ingredient.productName);
    } else {
      setSuggestions([]);
    }
  }, [ingredient.productName, products]);

  const handleSuggestionClick = (product) => {
    handleChangeIngredient(index, {
      target: { name: 'productName', value: product.name }
    });
    handleChangeIngredient(index, {
      target: { name: 'unit', value: product.unit }
    });
    handleChangeIngredient(index, {
      target: { name: 'category', value: product.category }
    });
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    handleChangeIngredient(index, e);
    filterIngredientSuggestions(value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    filterIngredientSuggestions(ingredient.productName);
  };

  const handleBlur = (e) => {
    // Delay to allow click event to fire before suggestions are hidden
    setTimeout(() => {
      if (!inputRef.current.contains(e.relatedTarget)) {
        setIsFocused(false);
      }
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1
      );
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex]);
    }
  };

  return (
    <div className="relative" ref={inputRef}>
      <input
        type="text"
        name="productName"
        value={ingredient.productName}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Інгредієнт"
        autoComplete="off" // Disable browser autocomplete
      />
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${highlightedIndex === index ? 'bg-gray-200' : ''}`}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default IngredientDropdown;
