import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import RecipeCard from './../recipes/RecipeCard';

function MenuCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menu, setMenu] = useState(null);

  const handleDateChange = date => {
    const correctedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    setSelectedDate(correctedDate);

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

  return (
    <div className="flex">
      <div className="w-1/3 p-4 min-w-72">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
          />
      </div>
      <div className="w-2/3 p-4">
          {menu ? (
            <div>
              <h2 className="text-2xl mb-4">Меню</h2>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    {menu.breakfast
                    ? <RecipeCard recipe={menu.breakfast} />
                    : <span className="text-4xl text-gray-300">+</span>}
                  </div>
                  <div>
                    {menu.snack
                    ? <RecipeCard recipe={menu.snack} />
                    : <span className="text-4xl text-gray-300">+</span>}
                  </div>
                  <div>
                    {menu.lunch
                    ? <RecipeCard recipe={menu.lunch} />
                    : <span className="text-4xl text-gray-300">+</span>}
                  </div>
                  <div>
                    {menu.dinner
                    ? <RecipeCard recipe={menu.dinner} />
                    : <span className="text-4xl text-gray-300">+</span>}
                  </div>
              </div>
            </div>
          ) : (
            <p>No menu available for this date.</p>
          )}
        </div>
    </div>
  );
}

export default MenuCalendar;
