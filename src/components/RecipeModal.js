import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function RecipeModal({ isModalOpen, handleCloseModal, name, category, calories, ingredients, descriptionHtml, image, unitMapping, categoryMapping }) {
  return (
    <Modal show={isModalOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Рецепт</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <div className="flex items-center">
            <p className="mb-2 mr-2">{categoryMapping[category]}</p>
            <p className="mb-2">{calories} ккал</p>
        </div>
        {image && (
          <img
            src={image instanceof File ? URL.createObjectURL(image) : `/uploads/${image}`}
            alt="Recipe"
            className="mb-4 max-w-full h-auto"
          />
        )}
        <h4 className="text-xl font-bold mb-2">Інгредієнти:</h4>
        <ul className="list-disc pl-5 mb-4">
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.productName} - {ingredient.quantity === 0 ? 'за смаком' : `${ingredient.quantity} ${unitMapping[ingredient.unit]}`}
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
