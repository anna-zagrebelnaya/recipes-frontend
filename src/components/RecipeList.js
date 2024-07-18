import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import categoryMapping from './categoryMapping';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/recipes')
      .then(response => {
        setRecipes(response.data);
      });
  }, []);

  const handleAddRecipe = () => {
    navigate('/add');
  };

  const handleDeleteRecipes = () => {
    selectedRecipes.forEach(id => {
      axios.delete(`/api/recipes/${id}`)
        .then(() => {
          setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
          setSelectedRecipes([]);
        });
    });
  };

  const handleSelectRecipe = (e, id) => {
    e.stopPropagation();
    setSelectedRecipes(prevState =>
      prevState.includes(id)
        ? prevState.filter(recipeId => recipeId !== id)
        : [...prevState, id]
    );
  };

  const handleGenerateGroceryList = () => {
    axios.post('/api/recipes/generate-grocery-list', selectedRecipes)
      .then(response => {
        setGroceryList(response.data.items);
      });
  };

  const handleItemClick = (e, id) => {
    e.stopPropagation();
    navigate(`/edit/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Список рецептів</h1>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handleAddRecipe} className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center">
          <FaPlus className="mr-2" /> Додати
        </button>
        <button onClick={handleDeleteRecipes} className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center">
          <FaTrash className="mr-2" /> Видалити
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map(recipe => (
          <div key={recipe.id} className="border rounded-lg p-4 shadow hover:shadow-lg flex">
            <input
              type="checkbox"
              onChange={(e) => handleSelectRecipe(e, recipe.id)}
              checked={selectedRecipes.includes(recipe.id)}
              className="mr-2"
            />
            {recipe.imageUrl && (
              <img
                src={`/uploads/${recipe.imageUrl}`}
                alt={recipe.name}
                className="w-24 h-24 object-cover cursor-pointer mr-4 rounded-lg"
                onClick={(e) => handleItemClick(e, recipe.id)}
              />
            )}
            <div className="flex flex-col justify-center">
              <span className="font-bold cursor-pointer" onClick={(e) => handleItemClick(e, recipe.id)}>{recipe.name}</span>
              <span className="text-sm text-gray-500">{categoryMapping[recipe.category]}</span>
              <span className="text-sm text-gray-500">{recipe.calories} ккал</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleGenerateGroceryList} className="bg-blue-500 text-white px-4 py-2 rounded-full mt-4">Створити список закупок</button>
      {groceryList.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Список закупок</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Продукт</th>
                <th className="py-2">Кількість</th>
              </tr>
            </thead>
            <tbody>
              {groceryList.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.quantity} {item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecipeList;
