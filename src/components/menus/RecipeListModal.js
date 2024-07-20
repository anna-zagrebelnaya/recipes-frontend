import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecipeCard from './../recipes/RecipeCard';

function RecipeListModal({ isModalOpen, handleCloseModal, handleSelectRecipe }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get('/api/recipes')
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  return (
    <Modal show={isModalOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Виберіть рецепт</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
