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
    <div>
      <h1>Recipe List</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={handleAddRecipe} style={{ display: 'flex', alignItems: 'center' }}>
          <FaPlus />
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <tbody>
          {recipes.map(recipe => (
            <tr key={recipe.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleSelectRecipe(recipe.id)}
                  checked={selectedRecipes.includes(recipe.id)}
                />
              </td>
              <td>
                {recipe.imageUrl && <img src={`/uploads/${recipe.imageUrl}`} alt={recipe.name} style={{ width: '50px', height: '50px' }} />}
              </td>
              <td>{recipe.name}</td>
              <td>
                <button onClick={() => handleEditRecipe(recipe.id)} style={{ display: 'flex', alignItems: 'center' }}>
                  <FaPencilAlt />
                </button>
                <button onClick={() => handleDeleteRecipe(recipe.id)} style={{ display: 'flex', alignItems: 'center' }}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleGenerateGroceryList}>Generate Grocery List</button>
      {groceryList.length > 0 && (
        <div>
          <h2>Grocery List</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {groceryList.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity} {item.unit}</td>
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
