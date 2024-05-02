export const ingredientsQueryBuilder = ({
  includeIngredients,
  excludeIngredients,
}) => {
  const ingredientsArray = includeIngredients.map((ingredient) => {
    return `LOWER(ingredients.name) LIKE '%' || LOWER('${ingredient}') || '%' OR`;
  });

  // removes the last ' OR' from the string
  ingredientsArray[ingredientsArray.length - 1] = ingredientsArray[
    ingredientsArray.length - 1
  ].replace(" OR", "");

  const ingredientsString = ingredientsArray.join(",").replace(",", " ");

  console.log(excludeIngredients);

  return `SELECT *
  FROM products
  JOIN product_ingredients ON products.id = product_ingredients.product_id
  JOIN ingredients ON product_ingredients.ingredient_id = ingredients.id
  WHERE (${ingredientsString});`;
};

// SELECT *
// FROM products
// JOIN product_ingredients ON products.id = product_ingredients.product_id
// JOIN ingredients ON product_ingredients.ingredient_id = ingredients.id
// WHERE (
//     LOWER(ingredients.name) LIKE '%' || LOWER('ingredient1') || '%' OR
//     LOWER(ingredients.name) LIKE '%' || LOWER('ingredient2') || '%' OR
//     LOWER(ingredients.name) LIKE '%' || LOWER('ingredient3') || '%'
// );
