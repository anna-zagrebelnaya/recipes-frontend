import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaTrash, FaFilter } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';
import qs from 'qs';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCalories, setSelectedCalories] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const loadRecipes = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/recipes', {
        params: { page, categories: selectedCategories, calories: selectedCalories },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
      });
      setRecipes(prevRecipes => reset ? response.data : [...prevRecipes, ...response.data]);
      setHasMore(response.data.length > 0);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategories, selectedCalories]);

  // Load recipes on initial load
  useEffect(() => {
    loadRecipes(true);  // Initial load with reset
  }, []);

  // Load more recipes when page changes
  useEffect(() => {
    if (page > 0) {
      loadRecipes();  // Load more when page changes
    }
  }, [page]);

  // Load recipes when filters change
  useEffect(() => {
    if (selectedCategories.length > 0 || selectedCalories.length > 0) {
      setPage(0);  // Reset page to 0
      loadRecipes(true);  // Load recipes with reset
    }
  }, [selectedCategories, selectedCalories]);

  const handleAddRecipe = () => {
    navigate('/recipes/add');
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

  const handleItemClick = (e, recipe) => {
    e.stopPropagation();
    navigate(`/recipes/edit/${recipe.id}`);
  };

  const handleFilterChange = (categories, calories) => {
    setSelectedCategories(categories);
    setSelectedCalories(calories);
    setPage(0);
    setShowFilter(false);
  };

  const loadMoreRecipes = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 50) {
        loadMoreRecipes();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreRecipes]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Список рецептів</h1>
      <div className="flex mb-4">
        <button onClick={handleAddRecipe} className="bg-green-500 text-white px-4 py-2 mr-4 rounded-full flex items-center">
          <FaPlus className="mr-2" /> Додати
        </button>
        <button onClick={() => setShowFilter(!showFilter)} className="bg-yellow-500 text-white px-4 py-2 mr-4 rounded-full flex items-center">
          <FaFilter className="mr-2" /> Фільтрувати
        </button>
        <button onClick={handleDeleteRecipes} className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center">
          <FaTrash className="mr-2" /> Видалити
        </button>
      </div>
      <div className="py-2">
          {showFilter && (
            <RecipeFilter onFilterChange={handleFilterChange} selectedCategories={selectedCategories} selectedCalories={selectedCalories} />
          )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            handleSelectRecipe={handleSelectRecipe}
            selectedRecipes={selectedRecipes}
            handleItemClick={handleItemClick}
          />
        ))}
      </div>
      {loading && <p>Завантаження...</p>}
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
