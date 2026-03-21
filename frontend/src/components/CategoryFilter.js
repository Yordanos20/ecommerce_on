// src/components/CategoryFilter.js
import React, { useEffect, useState } from "react";

import api from "../services/api";

export default function CategoryFilter({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  // Fetch all categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h3>Filter by Category</h3>
      <select onChange={(e) => onSelectCategory(e.target.value)}>
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}