import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import categoryMapping from './categoryMapping';
import unitMapping from './unitMapping';

function RecipeModal({ isModalOpen, handleCloseModal, recipe }) {
  const { name, category, calories, ingredients, descriptionHtml, image } = recipe;

  return (
    <Modal show={isModalOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Рецепт</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mb-4">
          {image && (
            <img
              src={image instanceof File ? URL.createObjectURL(image) : `/uploads/${image}`}
              alt="Recipe"
              className="me-3 rounded-lg" // Bootstrap class for right margin
              style={{ maxWidth: '150px', height: 'auto' }} // Adjust the size of the image
            />
          )}
          <div className="flex flex-col justify-center">
            <span className="font-bold cursor-pointer">{name}</span>
            <span className="text-sm text-gray-500">{categoryMapping[category]}</span>
            <span className="text-sm text-gray-500">{calories} ккал</span>
          </div>
        </div>
        <h4 className="text-xl font-bold mb-2">Інгредієнти:</h4>
        <ul className="list-disc pl-5 mb-4">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="d-flex justify-content-between">
              <span>{ingredient.productName}</span>
              <span>{ingredient.quantity === 0 ? 'за смаком' : ingredient.quantity} {ingredient.quantity === 0 ? '' : unitMapping[ingredient.unit]}</span>
            </li>
          ))}
        </ul>
        <h4 className="text-xl font-bold mb-2">Спосіб приготування:</h4>
        <ul className="list-decimal pl-5">
          {descriptionHtml.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>Закрити</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RecipeModal;
