import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import categoryMapping from './categoryMapping';

function AddRecipe() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('BREAKFAST');
  const [ingredients, setIngredients] = useState([{ productName: '', unit: '', quantity: 0 }]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [descriptionHtml, setDescriptionHtml] = useState([]);
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

  return (
    <div className="max-w-lg mx-auto p-5 border border-gray-300 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Редагування рецепту' : 'Новий рецепт'}</h1>
      <input
        type="text"
        placeholder="Назва Рецепту"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {Object.keys(categoryMapping).map(key => (
            <option key={key} value={key}>{categoryMapping[key]}</option>
          ))}
      </select>
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
              <option value="">Select Unit</option>
              {Object.keys(unitMapping).map(unit => (
                <option key={unit} value={unit}>{unitMapping[unit]}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={handleAddIngredient}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Додати інгредієнт
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
    </div>
  );
}

export default AddRecipe;
