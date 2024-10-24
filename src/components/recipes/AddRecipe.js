import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import 'tailwindcss/tailwind.css';
import recipeCategoryMapping from './recipeCategoryMapping';
import productCategoryMapping from './productCategoryMapping';
import unitMapping from './unitMapping';
import RecipeModal from './RecipeModal';
import { FaEye } from 'react-icons/fa';
import DescriptionBlock from './DescriptionBlock';
import IngredientDropdown from './IngredientDropdown';

function AddRecipe() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('BREAKFAST');
  const [calories, setCalories] = useState(0);
  const [portions, setPortions] = useState(1);
  const [ingredients, setIngredients] = useState([{ productName: '', unit: '', quantity: 0 }]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [descriptionHtml, setDescriptionHtml] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const lastProductInputRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (id) {
      axiosPrivate.get(`/api/recipes/${id}`)
        .then(response => {
          const recipe = response.data;
          setName(recipe.name);
          setCategory(recipe.category);
          setCalories(recipe.calories);
          setPortions(recipe.portions);
          setIngredients(recipe.ingredients.map(ingredient => ({
            productName: ingredient.product.name,
            unit: ingredient.unit,
            category: ingredient.product.category,
            quantity: ingredient.quantity
          })));
          setDescription(recipe.description);
          setImage(recipe.imageUrl);
          setImageUrl(`/uploads/${recipe.imageUrl}`);
          setDescriptionHtml(parseHtmlToArray(recipe.description));
        });
    }

    // Fetch products once
    axiosPrivate.get('/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, [id]);

  const parseHtmlToArray = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return Array.from(doc.querySelectorAll('ul > li')).map(li => li.innerHTML);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { productName: '', unit: '', category: '', quantity: 0 }]);
    setTimeout(() => {
      if (lastProductInputRef.current) {
        lastProductInputRef.current.focus();
      }
    }, 0);
  };

  const handleChangeIngredient = (index, event) => {
    const { name, value } = event.target;
    setIngredients((prevIngredients) => {
      const newIngredients = [...prevIngredients];
      newIngredients[index] = {
        ...newIngredients[index],
        [name]: value
      };
      return newIngredients;
    });
  };

  const handleDeleteIngredient = (index) => {
    setIngredients((prevIngredients) => prevIngredients.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
        setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = () => {
    const recipeData = {
      name,
      category,
      calories: parseInt(calories, 10),
      portions: parseInt(portions, 10),
      ingredients: ingredients.map(ingredient => ({
        product: { name: ingredient.productName, unit: ingredient.unit, category: ingredient.category },
        quantity: parseInt(ingredient.quantity, 10),
        unit: ingredient.unit
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
      axiosPrivate.put(`/api/recipes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          console.log(response.data);
          navigate('/recipes');
        });
    } else {
      axiosPrivate.post('/api/recipes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          console.log(response.data);
          navigate('/recipes');
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

  const recipe = {
    name,
    category,
    calories,
    portions,
    ingredients: ingredients.map(ingredient => ({
      product: {
        name: ingredient.productName,
        unit: ingredient.unit,
        category: ingredient.category
      },
      quantity: ingredient.quantity,
      unit: ingredient.unit
    })),
    description: `<ul>${descriptionHtml.map(item => `<li>${item}</li>`).join('')}</ul>`,
    imageUrl: image
  };

  return (
    <div className="max-w-lg mx-auto p-5 border border-gray-300 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">{id ? 'Редагування рецепту' : 'Новий рецепт'}</h1>
        <FaEye
          onClick={handleOpenModal}
          className="text-purple-500 text-2xl cursor-pointer mb-4"
        />
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
          {Object.keys(recipeCategoryMapping).map(key => (
            <option key={key} value={key}>{recipeCategoryMapping[key]}</option>
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
        <input
          id="portions"
          type="number"
          min="1"
          value={portions}
          onChange={e => setPortions(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <span className="py-2 mb-4 text-gray-700">порцій</span>
      </div>
      <div
        className="w-full h-48 border-2 border-dashed border-gray-300 flex justify-center items-center mb-4 cursor-pointer"
        onClick={handleImageClick}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Recipe" className="max-w-full max-h-full" />
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
            <IngredientDropdown
              index={index}
              ingredient={ingredient}
              handleChangeIngredient={handleChangeIngredient}
              products={products}
              inputRef={index === ingredients.length - 1 ? lastProductInputRef : null}
            />
            <input
              type="number"
              name="quantity"
              value={ingredient.quantity}
              onChange={e => handleChangeIngredient(index, e)}
              placeholder="Кількість"
              className="p-2 mr-2 border border-gray-300 rounded max-w-16"
            />
            <select
              name="unit"
              value={ingredient.unit}
              onChange={e => handleChangeIngredient(index, e)}
              className="p-2 mr-2 border border-gray-300 rounded max-w-16"
            >
              <option value="">Од.</option>
              {Object.keys(unitMapping).map(unit => (
                <option key={unit} value={unit}>{unitMapping[unit]}</option>
              ))}
            </select>
            <select
              name="category"
              value={ingredient.category}
              onChange={e => handleChangeIngredient(index, e)}
              className="p-2 border border-gray-300 rounded max-w-20"
            >
              <option value="">Кат.</option>
              {Object.keys(productCategoryMapping).map(unit => (
                <option key={unit} value={unit}>{productCategoryMapping[unit]}</option>
              ))}
            </select>
            <button
              onClick={() => handleDeleteIngredient(index)}
            >
              ✖
            </button>
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
      <DescriptionBlock
        descriptionHtml={descriptionHtml}
        handleDescriptionChange={handleDescriptionChange}
        handleDeleteDescriptionItem={handleDeleteDescriptionItem}
        handleAddDescriptionItem={handleAddDescriptionItem}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
      >
        {id ? 'Оновити' : 'Створити'}
      </button>

      <RecipeModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        recipe={recipe}
      />
    </div>
  );
}

export default AddRecipe;
