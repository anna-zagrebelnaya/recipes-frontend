import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import RecipeCard from './../recipes/RecipeCard';
import RecipeModal from './../recipes/RecipeModal';
import RecipeListModal from './RecipeListModal';

function MenuCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menu, setMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeListModalOpen, setIsRecipeListModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentMeal, setCurrentMeal] = useState(null);

  const fetchMenu = (date) => {
    const correctedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const formattedDate = correctedDate.toISOString().split('T')[0];

    axios.get(`/api/menus?date=${formattedDate}`)
      .then(response => {
        setMenu(response.data);
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
        setMenu(null);
      });
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    fetchMenu(date);
  };

  useEffect(() => {
    fetchMenu(new Date());
  }, []);

  const handleRecipeClick = (e, recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleOpenRecipeListModal = (meal) => {
    setCurrentMeal(meal);
    setIsRecipeListModalOpen(true);
  };

  const handleCloseRecipeListModal = () => {
    setIsRecipeListModalOpen(false);
    setCurrentMeal(null);
  };

  const handleSelectRecipe = (recipe) => {
    const newMenu = { ...menu };

    if (currentMeal) {
      newMenu[currentMeal] = recipe;
    }

    setMenu(newMenu);

    const correctedDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
    const formattedDate = correctedDate.toISOString().split('T')[0];

    const menuData = {
      date: formattedDate,
      breakfastId: newMenu.breakfast ? newMenu.breakfast.id : null,
      snackId: newMenu.snack ? newMenu.snack.id : null,
      lunchId: newMenu.lunch ? newMenu.lunch.id : null,
      dinnerId: newMenu.dinner ? newMenu.dinner.id : null,
    };

    if (menu && menu.id) {
      axios.put(`/api/menus/${menu.id}`, menuData)
        .then(response => {
          setMenu(response.data);
        })
        .catch(error => {
          console.error('Error updating menu:', error);
        });
    } else {
      axios.post('/api/menus', menuData)
        .then(response => {
          setMenu(response.data);
        })
        .catch(error => {
          console.error('Error creating menu:', error);
        });
    }

    handleCloseRecipeListModal();
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-1/3 p-4 min-w-72">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>
      <div className="w-2/3 p-4">
        <h2 className="text-2xl mb-4">Меню</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {menu && menu.breakfast ? (
              <RecipeCard recipe={menu.breakfast} handleItemClick={handleRecipeClick} />
            ) : (
              <div
                className="flex items-center justify-center border border-gray-300 rounded-lg min-w-60 min-h-32 text-2xl text-gray-300"
                onClick={() => handleOpenRecipeListModal('breakfast')}
               >
                Сніданок
              </div>
            )}
          </div>
          <div>
            {menu && menu.snack ? (
              <RecipeCard recipe={menu.snack} handleItemClick={handleRecipeClick} />
            ) : (
              <div
                className="flex items-center justify-center border border-gray-300 rounded-lg min-w-60 min-h-32 text-2xl text-gray-300"
                onClick={() => handleOpenRecipeListModal('snack')}
               >
                Перекус
              </div>
            )}
          </div>
          <div>
            {menu && menu.lunch ? (
              <RecipeCard recipe={menu.lunch} handleItemClick={handleRecipeClick} />
            ) : (
              <div
                className="flex items-center justify-center border border-gray-300 rounded-lg min-w-60 min-h-32 text-2xl text-gray-300"
                onClick={() => handleOpenRecipeListModal('lunch')}
               >
                Обід
              </div>
            )}
          </div>
          <div>
            {menu && menu.dinner ? (
              <RecipeCard recipe={menu.dinner} handleItemClick={handleRecipeClick} />
            ) : (
              <div
                className="flex items-center justify-center border border-gray-300 rounded-lg min-w-60 min-h-32 text-2xl text-gray-300"
                onClick={() => handleOpenRecipeListModal('dinner')}
               >
                Вечеря
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedRecipe && (
        <RecipeModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          recipe={selectedRecipe}
        />
      )}
      <RecipeListModal
        isModalOpen={isRecipeListModalOpen}
        handleCloseModal={handleCloseRecipeListModal}
        handleSelectRecipe={handleSelectRecipe}
      />
    </div>
  );
}

export default MenuCalendar;
