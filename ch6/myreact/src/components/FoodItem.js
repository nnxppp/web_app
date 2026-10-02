const FoodItem = ({ name, price, isBestSeller, showDelete, onDelete }) => (
  <li className="food-item">
    <span>{name} - {price} baht</span>
    {isBestSeller && (
      <span className="best-seller" role="img" aria-label="Best seller">🏅</span>
    )}
    {showDelete && <button onClick={onDelete}>Del</button>}
  </li>
);

export default FoodItem;
