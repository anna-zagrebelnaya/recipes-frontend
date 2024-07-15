import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

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

  const handleEditRecipe = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteRecipe = (id) => {
    axios.delete(`/api/recipes/${id}`)
      .then(() => {
        setRecipes(recipes.filter(recipe => recipe.id !== id));
      });
  };

  const handleSelectRecipe = (id) => {
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

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Всі рецепти</h1>
        <button onClick={handleAddRecipe} className="p-2 bg-yellow-500 text-white rounded-full">
          <FaPlus />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {recipes.map(recipe => (
          <div key={recipe.id} className="border rounded-lg shadow-sm overflow-hidden relative">
            <input
              type="checkbox"
              onChange={() => handleSelectRecipe(recipe.id)}
              checked={selectedRecipes.includes(recipe.id)}
              className="absolute mt-2 ml-2"
            />
            {recipe.imageUrl && (
              <img
                src={`/uploads/${recipe.imageUrl}`}
                alt={recipe.name}
                className="w-full h-40 object-cover"
                style={{ maxWidth: '100px', maxHeight: '100px', display: 'block', margin: '0 auto' }}
              />
            )}
            <div className="p-2 text-center">
              <h2 className="text-lg font-semibold">{recipe.name}</h2>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEditRecipe(recipe.id)}
                  className="text-blue-500"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => handleDeleteRecipe(recipe.id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {groceryList.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Grocery List</h2>
          <table className="w-full mt-2 border-collapse">
            <tbody>
              {groceryList.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.quantity} {item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        onClick={handleGenerateGroceryList}
        className="mt-4 p-2 bg-yellow-500 text-white rounded"
      >
        Generate Grocery List
      </button>
    </div>
  );
}

export default RecipeList;
