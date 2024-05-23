import format from "pg-format";

const queryArrayBuilder = (arr) => {
  return arr.map((each) => `'${each}'`);
};

export const ingredientsJoinQueryBuilder = ({
  includeIngredients,
  excludeIngredients,
}) => {
  const formattedIncludeIngredients =
    queryArrayBuilder(includeIngredients) || [];
  const formattedExcludeIngredients =
    queryArrayBuilder(excludeIngredients) || [];

  const hasIncludeIngredients = formattedIncludeIngredients.length > 0;
  const hasExcludeIngredients = formattedExcludeIngredients.length > 0;
  const hasBothIncludeAndExcludeIngredients =
    hasIncludeIngredients && hasExcludeIngredients;

  const includeSubQuery = `NOT EXISTS (
      SELECT 1 FROM UNNEST(ARRAY[${formattedIncludeIngredients}]) AS required_ingredient
      WHERE NOT EXISTS (
          SELECT 1
          FROM product_ingredients
          JOIN ingredients ON product_ingredients.ingredient_id = ingredients.id
          WHERE products.id = product_ingredients.product_id
          AND LOWER(ingredients.name) LIKE '%' || LOWER(required_ingredient) || '%'
      )
  )`;

  const excludeSubQuery = `NOT EXISTS (
      SELECT 1 FROM UNNEST(ARRAY[${formattedExcludeIngredients}]) AS unwanted_ingredient
      WHERE EXISTS (
          SELECT 1
          FROM product_ingredients
          JOIN ingredients ON product_ingredients.ingredient_id = ingredients.id
          WHERE products.id = product_ingredients.product_id
          AND LOWER(ingredients.name) LIKE '%' || LOWER(unwanted_ingredient) || '%'
      )
  )`;

  const formattedQuery = format(`SELECT products.*
  FROM products
  WHERE
  ${hasIncludeIngredients ? includeSubQuery : ""}
  ${hasBothIncludeAndExcludeIngredients ? " AND " : ""}
  ${hasExcludeIngredients ? excludeSubQuery : ""}
 ;`);

  return formattedQuery;
};

export const ingredientsQueryBuilder = ({
  includeIngredients,
  excludeIngredients,
}) => {
  const formattedIncludeIngredients =
    queryArrayBuilder(includeIngredients) || [];
  const formattedExcludeIngredients =
    queryArrayBuilder(excludeIngredients) || [];

  const hasIncludeIngredients = formattedIncludeIngredients.length > 0;
  const hasExcludeIngredients = formattedExcludeIngredients.length > 0;
  const hasBothIncludeAndExcludeIngredients =
    hasIncludeIngredients && hasExcludeIngredients;

  const includeSubQuery = hasIncludeIngredients
    ? `(${formattedIncludeIngredients.map(
        (ingredient) => `LOWER(products.ingredients) LIKE '%' || LOWER(${ingredient}) || '%'`
      ).join(" OR ")})`
    : "";
  
  const excludeSubQuery = hasExcludeIngredients
    ? `NOT (${formattedExcludeIngredients.map(
        (ingredient) => `LOWER(products.ingredients) LIKE '%' || LOWER(${ingredient}) || '%'`
      ).join(" OR ")})`
    : "";

    const formattedQuery = `SELECT products.*
    FROM products
    ${hasIncludeIngredients || hasExcludeIngredients ? " WHERE " : ""}
    ${includeSubQuery}
    ${hasBothIncludeAndExcludeIngredients ? " AND " : ""}
    ${excludeSubQuery}
    LIMIT 50
    ;`;
    
    return formattedQuery;
};
