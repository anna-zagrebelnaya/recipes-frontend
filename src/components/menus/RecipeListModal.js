import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecipeCard from './../recipes/RecipeCard';
import RecipeFilter from './../recipes/RecipeFilter';
import './../styles/customModal.css';
import qs from 'qs';

function RecipeListModal({ isModalOpen, currentCategory, handleCloseModal, handleSelectRecipe }) {
  const [recipes, setRecipes] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    handleFilterChange([currentCategory]);
  }, [currentCategory]);

  const handleFilterChange = (filters) => {
    setSelectedCategories(filters);
    axios.get('/api/recipes', {
      params: { categories: filters },
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    })
      .then(response => {
        setRecipes(response.data);
      });
    setShowFilter(false);
  };

  return (
    <Modal show={isModalOpen} onHide={handleCloseModal} dialogClassName="custom-modal-dialog">
      <Modal.Header closeButton>
        <Modal.Title>Виберіть рецепт</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <button onClick={() => setShowFilter(!showFilter)} className="bg-yellow-500 text-white px-4 py-2 mb-4 rounded-full flex items-center">
          <FaFilter className="mr-2" /> Фільтрувати
        </button>
        <div className="py-2">
            {showFilter && (
              <RecipeFilter onFilterChange={handleFilterChange} selectedCategories={selectedCategories} />
            )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} handleItemClick={() => handleSelectRecipe(recipe)} />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>Закрити</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RecipeListModal;
