import { useState, useEffect } from "react";
import { CatFoodCard, ICatFoodCard } from "@components";

export function CatFoodData() {
  const [catFoodData, setCatFoodData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/ingredients")
      .then((response) => response.json())
      .then((data) => setCatFoodData(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="columns-sm p-4 gap-4">
      {catFoodData.map((catFood: ICatFoodCard) => {
        return <CatFoodCard key={catFood.id} {...catFood} />;
      })}
    </div>
  );
}
