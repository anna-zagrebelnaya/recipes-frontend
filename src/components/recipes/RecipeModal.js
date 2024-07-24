import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeCategoryMapping from './recipeCategoryMapping';
import unitMapping from './unitMapping';

function RecipeModal({ isModalOpen, handleCloseModal, recipe }) {
  const { name, category, calories, ingredients, description, imageUrl } = recipe;

  const parseHtmlToArray = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return Array.from(doc.querySelectorAll('ul > li')).map(li => li.innerHTML);
  };

  const descriptionHtml = parseHtmlToArray(recipe.description);

  return (
    <Modal show={isModalOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Рецепт</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mb-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Recipe"
              className="me-3 rounded-lg" // Bootstrap class for right margin
              style={{ maxWidth: '150px', height: 'auto' }} // Adjust the size of the image
            />
          )}
          <div className="flex flex-col justify-center">
            <span className="font-bold cursor-pointer">{name}</span>
            <span className="text-sm text-gray-500">{recipeCategoryMapping[category]}</span>
            <span className="text-sm text-gray-500">{calories} ккал</span>
          </div>
        </div>
        <h4 className="text-xl font-bold mb-2">Інгредієнти:</h4>
        <ul className="list-disc pl-5 mb-4">
          {ingredients && ingredients.map((ingredient, index) => (
            <li key={index} className="d-flex justify-content-between">
              <span>{ingredient.product.name}</span>
              <span>{ingredient.quantity === 0 ? 'за смаком' : ingredient.quantity} {ingredient.quantity === 0 ? '' : unitMapping[ingredient.product.unit]}</span>
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
