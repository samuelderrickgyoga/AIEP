import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategorySelector = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Select a Category</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.category_id}>
            <button onClick={() => onSelectCategory(category.category_id)}>
              {category.category_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelector;
