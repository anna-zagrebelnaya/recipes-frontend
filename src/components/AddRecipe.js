import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import categoryMapping from './categoryMapping';

function AddRecipe() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('BREAKFAST');
  const [calories, setCalories] = useState(0);
  const [ingredients, setIngredients] = useState([{ productName: '', unit: '', quantity: 0 }]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [descriptionHtml, setDescriptionHtml] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const unitMapping = {
    G: 'г',
    ML: 'мл',
    TBSP: 'ст.л.',
    TSP: 'ч.л.',
    U: 'шт'
  };

  useEffect(() => {
    if (id) {
      axios.get(`/api/recipes/${id}`)
        .then(response => {
          const recipe = response.data;
          setName(recipe.name);
          setCategory(recipe.category);
          setCalories(recipe.calories);
          setIngredients(recipe.ingredients.map(ingredient => ({
            productName: ingredient.product.name,
            unit: ingredient.product.unit,
            quantity: ingredient.quantity
          })));
          setDescription(recipe.description);
          setImage(recipe.imageUrl);
          setDescriptionHtml(parseHtmlToArray(recipe.description));
        });
    }
  }, [id]);

  const parseHtmlToArray = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return Array.from(doc.querySelectorAll('ul > li')).map(li => li.innerHTML);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { productName: '', unit: '', quantity: 0 }]);
  };

  const handleChangeIngredient = (index, event) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [event.target.name]: event.target.value };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = () => {
    const recipeData = {
      name,
      category,
      calories: parseInt(calories, 10),
      ingredients: ingredients.map(ingredient => ({
        product: { name: ingredient.productName, unit: ingredient.unit },
        quantity: parseInt(ingredient.quantity, 10)
      })),
      description: `<ul>${descriptionHtml.map(item => `<li>${item}</li>`).join('')}</ul>`
    };

    if (typeof image === 'string') {
      recipeData.imageUrl = image;
    }

    const formData = new FormData();
    formData.append('recipe', new Blob([JSON.stringify(recipeData)], {
      type: 'application/json'
    }));

    if (image && image instanceof File) {
      formData.append('image', image);
    }

    if (id) {
      axios.put(`/api/recipes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          console.log(response.data);
          navigate('/');
        });
    } else {
      axios.post('/api/recipes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          console.log(response.data);
          navigate('/');
        });
    }
  };

  const handleDescriptionChange = (index, event) => {
    const newDescriptionHtml = descriptionHtml.map((item, i) => {
      if (i === index) {
        return event.target.value;
      }
      return item;
    });
    setDescriptionHtml(newDescriptionHtml);
  };

  const handleAddDescriptionItem = () => {
    setDescriptionHtml([...descriptionHtml, '']);
  };

  const handleDeleteDescriptionItem = (index) => {
    const newDescriptionHtml = descriptionHtml.filter((_, i) => i !== index);
    setDescriptionHtml(newDescriptionHtml);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-lg mx-auto p-5 border border-gray-300 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">{id ? 'Редагування рецепту' : 'Новий рецепт'}</h1>
        <Button
          onClick={handleOpenModal}
          className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
        >
          Переглянути
        </Button>
      </div>
      <input
        type="text"
        placeholder="Назва Рецепту"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <div className="flex space-x-4 mb-4">
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="shadow border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {Object.keys(categoryMapping).map(key => (
            <option key={key} value={key}>{categoryMapping[key]}</option>
          ))}
        </select>
        <input
          id="calories"
          type="number"
          value={calories}
          onChange={e => setCalories(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <span className="py-2 mb-4 text-gray-700">ккал</span>
      </div>
      <div
        className="w-full h-48 border-2 border-dashed border-gray-300 flex justify-center items-center mb-4 cursor-pointer"
        onClick={handleImageClick}
      >
        {image ? (
          image instanceof File ? (
            <img src={URL.createObjectURL(image)} alt="Recipe" className="max-w-full max-h-full" />
          ) : (
            <img src={"/uploads/" + image} alt="Recipe" className="max-w-full max-h-full" />
          )
        ) : (
          <span className="text-4xl text-gray-300">+</span>
        )}
      </div>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Інгредієнти</h2>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              name="productName"
              value={ingredient.productName}
              onChange={e => handleChangeIngredient(index, e)}
              placeholder="Назва продукту"
              className="w-full p-2 mr-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="quantity"
              value={ingredient.quantity}
              onChange={e => handleChangeIngredient(index, e)}
              placeholder="Кількість"
              className="w-1/4 p-2 mr-2 border border-gray-300 rounded"
            />
            <select
              name="unit"
              value={ingredient.unit}
              onChange={e => handleChangeIngredient(index, e)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Одиниця</option>
              {Object.keys(unitMapping).map(unit => (
                <option key={unit} value={unit}>{unitMapping[unit]}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Додати Інгредієнт
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Спосіб приготування</h2>
        {descriptionHtml.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={item}
              onChange={e => handleDescriptionChange(index, e)}
              className="w-full p-2 mr-2 border border-gray-300 rounded"
            />
            <button
             onClick={() => handleDeleteDescriptionItem(index)}
             className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
             >
              ✖
             </button>
          </div>
        ))}
        <button onClick={handleAddDescriptionItem}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
         Додати крок
        </button>
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
         {id ? 'Оновити' : 'Створити'}
        </button>

      <Modal show={isModalOpen} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Перегляд рецепту</Modal.Title>
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрити
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddRecipe;
