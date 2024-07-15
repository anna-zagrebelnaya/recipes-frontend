import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AddRecipe() {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState([{ productName: '', unit: '', quantity: 0 }]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [descriptionHtml, setDescriptionHtml] = useState([]);
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
    const formData = new FormData();
    formData.append('recipe', new Blob([JSON.stringify({
      name,
      ingredients: ingredients.map(ingredient => ({
        product: { name: ingredient.productName, unit: ingredient.unit },
        quantity: parseInt(ingredient.quantity, 10)
      })),
      description: `<ul>${descriptionHtml.map(item => `<li>${item}</li>`).join('')}</ul>`
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

  return (
    <div style={styles.container}>
      <h1>{id ? 'Edit Recipe' : 'Add Recipe'}</h1>
      <input
        type="text"
        placeholder="Recipe Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={styles.input}
      />
      <h2>Ingredients</h2>
      {ingredients.map((ingredient, index) => (
        <div key={index} style={styles.ingredientRow}>
          <input
            type="text"
            placeholder="Product Name"
            name="productName"
            value={ingredient.productName}
            onChange={e => handleChangeIngredient(index, e)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Quantity"
            name="quantity"
            value={ingredient.quantity}
            onChange={e => handleChangeIngredient(index, e)}
            style={{ width: '80px', margin: '0 10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          <select
            name="unit"
            value={ingredient.unit}
            onChange={e => handleChangeIngredient(index, e)}
            style={{ width: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Select Unit</option>
            <option value="G">G</option>
            <option value="ML">ML</option>
            <option value="TBSP">TBSP</option>
            <option value="TSP">TSP</option>
            <option value="U">U</option>
          </select>
        </div>
      ))}
      <button onClick={handleAddIngredient} style={styles.button}>Add Ingredient</button>
      <h2>Description</h2>
      {descriptionHtml.map((item, index) => (
        <input
          key={index}
          type="text"
          value={item}
          onChange={e => handleDescriptionChange(index, e)}
          style={styles.input}
        />
      ))}
      <button onClick={handleAddDescriptionItem} style={styles.button}>Add Description Item</button>
      <h2>Image</h2>
      <div
        style={styles.imageContainer}
        onClick={handleImageClick}
      >
        {image ? (
          image instanceof File ? (
            <img src={URL.createObjectURL(image)} alt="Recipe" style={styles.image} />
          ) : (
            <img src={"/uploads/"+image} alt="Recipe" style={styles.image} />
          )
        ) : (
          <span style={styles.imagePlaceholder}>+</span>
        )}
      </div>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <button onClick={handleSubmit} style={styles.button}>{id ? 'Update Recipe' : 'Save Recipe'}</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    resize: 'vertical'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  ingredientRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  imageContainer: {
    width: '200px',
    height: '200px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  imagePlaceholder: {
    fontSize: '48px',
    color: '#ccc'
  }
};

export default AddRecipe;
