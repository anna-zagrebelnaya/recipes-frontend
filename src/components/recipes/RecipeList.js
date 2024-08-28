import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaFilter } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import RecipeCard from './RecipeCard';
import RecipeFilter from './RecipeFilter';
import qs from 'qs';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCalories, setSelectedCalories] = useState([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const loadRecipes = useCallback(async (reset = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const response = await axios.get('/api/recipes', {
        params: { page, categories: selectedCategories, calories: selectedCalories },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
      });
      setRecipes(prevRecipes => reset ? response.data : [...prevRecipes, ...response.data]);
      hasMoreRef.current = response.data.length > 0;
    } finally {
      loadingRef.current = false;
    }
  }, [page, selectedCategories, selectedCalories]);

  useEffect(() => {
    loadRecipes(true);
  }, []);

  useEffect(() => {
    if (page > 0) {
      loadRecipes();
    }
  }, [page]);

  useEffect(() => {
    if (selectedCategories.length > 0 || selectedCalories.length > 0) {
      setPage(0);
      loadRecipes(true);
    }
  }, [selectedCategories, selectedCalories]);

  const handleAddRecipe = () => {
    navigate('/recipes/add');
  };

  const handleDeleteRecipe = (id) => {
    axios.delete(`/api/recipes/${id}`)
      .then(() => {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
      });
  };

  const handleGenerateGroceryList = () => {
    axios.post('/api/recipes/generate-grocery-list', recipes.map(recipe => recipe.id))
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
    if (!loadingRef.current && hasMoreRef.current) {
      setPage(prevPage => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    let debounceTimeout;
    const handleScroll = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 50) {
          loadMoreRecipes();
        }
      }, 200); // 200ms debounce interval
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(debounceTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
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
            handleItemClick={handleItemClick}
            showRemoveBtn={true}
            handleRemoveRecipe={() => handleDeleteRecipe(recipe.id)}
          />
        ))}
      </div>
      {loadingRef.current && <p>Завантаження...</p>}
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
