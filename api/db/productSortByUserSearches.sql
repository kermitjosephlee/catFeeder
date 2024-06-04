
-- RETURN PRODUCTS SORTED BY USER'S SEARCH TERMS
WITH terms AS (
  SELECT user_id, LOWER(term::text) AS term, 1 AS score
  FROM searches, json_array_elements_text(include_terms::json) AS term
  WHERE user_id = 6
  UNION ALL
  SELECT user_id, LOWER(term::text) AS term, -1 AS score
  FROM searches, json_array_elements_text(exclude_terms::json) AS term
  WHERE user_id = 6
),
product_scores AS (
  SELECT p.id, p.brand, p.name, p.ingredients, SUM(t.score) AS score
  FROM products p
  JOIN terms t ON LOWER(p.ingredients) LIKE '%' || LOWER(t.term) || '%'
  GROUP BY p.id, p.brand, p.name, p.ingredients
)
SELECT id, brand, name, ingredients, score
FROM product_scores
ORDER BY score DESC LIMIT 10;


-- RETURN PRODUCTS SORTED BY ALL USERS SEARCH TERMS
WITH terms AS (
  SELECT user_id, LOWER(term::text) AS term, 1 AS score
  FROM searches, json_array_elements_text(include_terms::json) AS term
  UNION ALL
  SELECT user_id, LOWER(term::text) AS term, -1 AS score
  FROM searches, json_array_elements_text(exclude_terms::json) AS term
),
product_scores AS (
  SELECT p.id, p.brand, p.name, p.ingredients, t.user_id, SUM(t.score) AS score
  FROM products p
  JOIN terms t ON LOWER(p.ingredients) LIKE '%' || t.term || '%'
  GROUP BY p.id, p.brand, p.name, p.ingredients, t.user_id
)
SELECT id, brand, name, ingredients, score
FROM product_scores
ORDER BY score DESC 
LIMIT 10 OFFSET 0;