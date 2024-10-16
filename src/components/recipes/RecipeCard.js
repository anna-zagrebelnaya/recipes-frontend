import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FaEye, FaTimes } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import recipeCategoryMapping from './recipeCategoryMapping';
import RecipeModal from './RecipeModal';

function RecipeCard({ recipe, handleItemClick, showRemoveBtn, handleRemoveRecipe }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState(recipe);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setDetailedRecipe(recipe);
  }, [recipe]);

  const handleOpenModal = async () => {
    if (!detailedRecipe.ingredients || detailedRecipe.ingredients.length === 0) {
      try {
        const response = await axiosPrivate.get(`/api/recipes/${recipe.id}`);
        setDetailedRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="border rounded-lg p-3 shadow hover:shadow-lg flex min-w-60 relative">
      {recipe.imageUrl && (
        <img
          src={`/uploads/${recipe.imageUrl}`}
          alt={recipe.name}
          className="w-24 h-24 object-cover cursor-pointer mr-4 rounded-lg"
          onClick={(e) => handleItemClick(e, recipe)}
        />
      )}
      <div className="flex flex-col justify-center">
        <span className="font-bold cursor-pointer" onClick={(e) => handleItemClick(e, recipe)}>
          {recipe.name}
        </span>
        <span className="text-sm text-gray-500">{recipeCategoryMapping[recipe.category]}</span>
        <span className="text-sm text-gray-500">{recipe.calories} ккал</span>
      </div>
      <FaEye
        onClick={handleOpenModal}
        className="text-purple-500 text-2xl cursor-pointer absolute top-2 right-2"
      />
      {showRemoveBtn && (
        <FaTimes
          onClick={handleRemoveRecipe}
          className="text-red-500 text-2xl cursor-pointer absolute bottom-2 right-2"
        />
      )}
      <RecipeModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        recipe={detailedRecipe}
      />
    </div>
  );
}

export default RecipeCard;
