import { useState } from 'react';

const FoodForm = ({ onAdd }) => {
  const [inputs, setInputs] = useState({ name: '', price: '', isBestSeller: 'true' });
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const name = inputs.name.trim();
    const price = Number(inputs.price);

    if (!name || !Number.isFinite(price) || price <= 0) {
      setError('Enter a food name and a price greater than 0.');
      return;
    }

    setError('');
    onAdd({
      name,
      price,
      isBestSeller: inputs.isBestSeller === 'true',
    });
    setInputs({ name: '', price: '', isBestSeller: 'true' });
  }

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <h3>New Food</h3>
      <label>
        <span>name:</span>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        <span>price:</span>
        <input
          type="number"
          name="price"
          min="0.01"
          step="any"
          value={inputs.price}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        <span>Best Seller:</span>
        <select name="isBestSeller" value={inputs.isBestSeller} onChange={handleChange}>
          <option value="true">BestSeller</option>
          <option value="false">Normal</option>
        </select>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit">Add menu</button>
    </form>
  );
};

export default FoodForm;
