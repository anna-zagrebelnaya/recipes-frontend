import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeList from './components/recipes/RecipeList';
import AddRecipe from './components/recipes/AddRecipe';
import MenuCalendar from './components/menus/MenuCalendar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuCalendar />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/add" element={<AddRecipe />} />
        <Route path="/recipes/edit/:id" element={<AddRecipe />} />
      </Routes>
    </Router>
  );
}

export default App;
