import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AddRecipe() {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState([{ productName: '', unit: '', quantity: 0 }]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`/api/recipes/${id}`)
        .then(response => {
          const recipe = response.data;
          setName(recipe.name);
          setIngredients(recipe.ingredients.map(ingredient => ({
            productName: ingredient.product.name,
            unit: ingredient.product.unit,
            quantity: ingredient.quantity
          })));
          setDescription(recipe.description);
          setImage(recipe.imageUrl);
        });
    }
  }, [id]);

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
    const formData = new FormData();
    formData.append('recipe', new Blob([JSON.stringify({
      name,
      ingredients: ingredients.map(ingredient => ({
        product: { name: ingredient.productName, unit: ingredient.unit },
        quantity: parseInt(ingredient.quantity, 10)
      })),
      description
    })], {
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

  return (
    <div>
      <h1>{id ? 'Edit Recipe' : 'Add Recipe'}</h1>
      <input
        type="text"
        placeholder="Recipe Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <h2>Ingredients</h2>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Product Name"
            name="productName"
            value={ingredient.productName}
            onChange={e => handleChangeIngredient(index, e)}
          />
          <select
            name="unit"
            value={ingredient.unit}
            onChange={e => handleChangeIngredient(index, e)}
          >
            <option value="">Select Unit</option>
            <option value="G">G</option>
            <option value="ML">ML</option>
            <option value="TBSP">TBSP</option>
            <option value="TS">TS</option>
            <option value="U">U</option>
          </select>
          <input
            type="number"
            placeholder="Quantity"
            name="quantity"
            value={ingredient.quantity}
            onChange={e => handleChangeIngredient(index, e)}
          />
        </div>
      ))}
      <button onClick={handleAddIngredient}>Add Ingredient</button>
      <h2>Description</h2>
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <h2>Image</h2>
      <div
        style={{
          width: '200px',
          height: '200px',
          border: '2px solid #000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={handleImageClick}
      >
        {image ? (
          image instanceof File ? (
            <img src={URL.createObjectURL(image)} alt="Recipe" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          ) : (
            <img src={"/uploads/"+image} alt="Recipe" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          )
        ) : (
          <span>+</span>
        )}
      </div>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <button onClick={handleSubmit}>{id ? 'Update Recipe' : 'Save Recipe'}</button>
    </div>
  );
}

export default AddRecipe;
