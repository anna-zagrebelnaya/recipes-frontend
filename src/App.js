import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RecipeList from './components/recipes/RecipeList';
import AddRecipe from './components/recipes/AddRecipe';
import MenuCalendar from './components/menus/MenuCalendar';
import Login from './components/auth/Login';
import Unauthorized from './components/auth/Unauthorized';
import Missing from './components/Missing';
import Layout from './components/Layout';
import RequireAuth from "./components/auth/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth allowedRoles={['ROLE_USER']}/>} >
          <Route path="/" element={<MenuCalendar />} />
        </Route>
        
        <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']}/>} >
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/add" element={<AddRecipe />} />
          <Route path="/recipes/edit/:id" element={<AddRecipe />} />
        </Route>
      
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
