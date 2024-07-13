import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AddRecipe() {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState([{ productName: '', unit: '', quantity: 0 }]);
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

  const handleSubmit = () => {
    const recipe = {
      name,
      ingredients: ingredients.map(ingredient => ({
        product: { name: ingredient.productName, unit: ingredient.unit },
        quantity: parseInt(ingredient.quantity, 10)
      }))
    };
    if (id) {
      axios.put(`/api/recipes/${id}`, recipe)
        .then(response => {
          console.log(response.data);
          navigate('/');
        });
    } else {
      axios.post('/api/recipes', recipe)
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
      <button onClick={handleSubmit}>{id ? 'Update Recipe' : 'Save Recipe'}</button>
    </div>
  );
}

export default AddRecipe;
