import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import categoryMapping from './categoryMapping';

function RecipeCard({ recipe, handleSelectRecipe, selectedRecipes, handleItemClick }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-3 shadow hover:shadow-lg flex min-w-60">
      {handleSelectRecipe && (
        <input
          type="checkbox"
          onChange={(e) => handleSelectRecipe(e, recipe.id)}
          checked={selectedRecipes.includes(recipe.id)}
          className="mr-2"
        />
      )}
      {recipe.imageUrl && (
        <img
          src={`/uploads/${recipe.imageUrl}`}
          alt={recipe.name}
          className="w-24 h-24 object-cover cursor-pointer mr-4 rounded-lg"
          onClick={(e) => handleItemClick(e, recipe)}
        />
      )}
      <div className="flex flex-col justify-center">
        <span className="font-bold cursor-pointer" onClick={(e) => handleItemClick(e, recipe)}>{recipe.name}</span>
        <span className="text-sm text-gray-500">{categoryMapping[recipe.category]}</span>
        <span className="text-sm text-gray-500">{recipe.calories} ккал</span>
      </div>
    </div>
  );
}

export default RecipeCard;
