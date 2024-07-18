import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import categoryMapping from './categoryMapping';
import unitMapping from './unitMapping';

function RecipeModal({ isModalOpen, handleCloseModal, name, category, calories, ingredients, descriptionHtml, image }) {
  return (
    <Modal show={isModalOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Рецепт</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <div className="d-flex mb-4">
          {image && (
            <img
              src={image instanceof File ? URL.createObjectURL(image) : `/uploads/${image}`}
              alt="Recipe"
              className="me-3" // Bootstrap class for right margin
              style={{ maxWidth: '150px', height: 'auto' }} // Adjust the size of the image
            />
          )}
          <div>
            <p className="mb-2">{categoryMapping[category]}</p>
            <p className="mb-2">{calories} ккал</p>
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
