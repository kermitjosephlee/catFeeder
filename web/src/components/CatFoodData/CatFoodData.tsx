import { useState, useEffect } from "react";
import { CatFoodCard, ICatFoodCard } from "@components";

export function CatFoodData() {
  const [catFoodData, setCatFoodData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((response) => response.json())
      .then((data) => setCatFoodData(data));
  }, []);

  return (
    <div className="columns-4 px-4">
      {catFoodData.map((catFood: ICatFoodCard) => {
        return <CatFoodCard {...catFood} />;
      })}
    </div>
  );
}
