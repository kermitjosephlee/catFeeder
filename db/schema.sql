DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS product_ingredients;

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(255) NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_ingredients (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- INSERT INTO ingredients (name)
-- SELECT DISTINCT LOWER(TRIM(ingredient))
-- FROM (
--     SELECT unnest(string_to_array(ingredients, ',')) AS ingredient
--     FROM products
-- ) AS subquery
-- WHERE TRIM(ingredient) <> '';

-- INSERT INTO product_ingredients (product_id, ingredient_id)
-- SELECT 
--     products.id AS product_id,
--     ingredients.id AS ingredient_id
-- FROM 
--     products
-- CROSS JOIN LATERAL 
--     unnest(string_to_array(products.ingredients, ',')) AS ingredient_name
-- JOIN 
--     ingredients ON TRIM(ingredients.name) = TRIM(ingredient_name);