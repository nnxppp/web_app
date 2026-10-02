import FoodItem from './FoodItem';

const FoodList = ({ food, isAdmin, onDelete }) => (
  <ul className="food-list">
    {food.map((item, index) => (
      <FoodItem
        key={`${item.name}-${index}`}
        name={item.name}
        price={item.price}
        isBestSeller={item.isBestSeller}
        showDelete={isAdmin}
        onDelete={() => onDelete(index)}
      />
    ))}
  </ul>
);

export default FoodList;
