// MenuCalendar.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';  // You can use a calendar library like react-calendar
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import RecipeCard from './../recipes/RecipeCard';  // Assuming you have a RecipeCard component

function MenuCalendar() {
  const [date, setDate] = useState(new Date());
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    // Fetch the menu for the selected date
    axios.get(`/api/menus?date=${date.toISOString().split('T')[0]}`)
      .then(response => {
        setMenu(response.data);
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
        setMenu(null);
      });
  }, [date]);

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <Calendar
          onChange={setDate}
          value={date}
          locale="uk-UA"
          tileClassName={({ date, view }) => view === 'month' && 'p-4'}
        />
      </div>
      <div className="w-1/2 p-4">
        {menu ? (
          <div>
            <h2 className="text-2xl mb-4">Menu for {date.toDateString()}</h2>
            <div>
              <h3>Breakfast</h3>
              {menu.breakfast ? <RecipeCard recipe={menu.breakfast} /> : 'no recipe'}
            </div>
            <div>
              <h3>Snack</h3>
              {menu.snack ? <RecipeCard recipe={menu.snack} /> : "no recipe"}
            </div>
            <div>
              <h3>Lunch</h3>
              {menu.lunch ? <RecipeCard recipe={menu.lunch} /> : "no recipe"}
            </div>
            <div>
              <h3>Dinner</h3>
              {menu.dinner ? <RecipeCard recipe={menu.dinner} /> : "no recipe"}
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
