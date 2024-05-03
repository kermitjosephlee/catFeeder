import { useState, useEffect } from "react";

export function CatFoodData() {
  const [catFoodData, setCatFoodData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((response) => response.json())
      .then((data) => setCatFoodData(data));
  }, []);

  return <pre>{JSON.stringify(catFoodData, null, 2)}</pre>;
}
