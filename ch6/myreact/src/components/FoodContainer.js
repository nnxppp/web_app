import { useEffect, useState } from 'react';
import FoodForm from './FoodForm';
import FoodList from './FoodList';

const initialFood = [
  { name: 'cake', price: 35, isBestSeller: true },
  { name: 'bread', price: 25, isBestSeller: false },
  { name: 'milk', price: 15, isBestSeller: true },
  { name: 'donut', price: 45, isBestSeller: false },
  { name: 'cookie', price: 55, isBestSeller: true },
];

const MODE_STORAGE_KEY = 'menu-management-mode';

function getSavedMode() {
  try {
    return window.localStorage.getItem(MODE_STORAGE_KEY) === 'admin' ? 'admin' : 'user';
  } catch (error) {
    console.error('Unable to read the saved menu mode.', error);
    return 'user';
  }
}

const FoodContainer = () => {
  const [food, setFood] = useState(initialFood);
  const [mode, setMode] = useState(getSavedMode);
  const isAdmin = mode === 'admin';

  useEffect(() => {
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Unable to save the menu mode.', error);
    }
  }, [mode]);

  const deleteItem = (index) => {
    setFood((items) => items.filter((_, itemIndex) => itemIndex !== index));
  };

  const addItem = (item) => {
    setFood((items) => [...items, item]);
  };

  return (
    <section className="exercise-card menu-card" aria-labelledby="menu-heading">
      <div className="mode-bar">
        <span>{isAdmin ? 'Admin Mode' : 'User Mode'}</span>
        <button
          onClick={() => setMode(isAdmin ? 'user' : 'admin')}
          aria-label={`Switch to ${isAdmin ? 'user' : 'admin'} mode`}
        >
          {isAdmin ? 'User' : 'Admin'}
        </button>
      </div>

      <h2 id="menu-heading">Our Menu</h2>
      <FoodList food={food} isAdmin={isAdmin} onDelete={deleteItem} />
      {isAdmin && <FoodForm onAdd={addItem} />}
    </section>
  );
};

export default FoodContainer;
