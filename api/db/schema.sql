DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS product_ingredients;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS pet_products;
DROP TABLE IF EXISTS searches;

DROP FUNCTION IF EXISTS get_products_with_score;

DROP INDEX IF EXISTS idx_products_name;

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

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  pet_name VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  species VARCHAR(255) NOT NULL,
  breed VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS pet_products (
  id SERIAL PRIMARY KEY,
  pet_id INT NOT NULL,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  is_favorite TIMESTAMP DEFAULT NULL,
  is_excluded TIMESTAMP DEFAULT NULL,
  CONSTRAINT fk_pet_id FOREIGN KEY (pet_id) REFERENCES pets (id) ON DELETE CASCADE,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS searches (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  include_terms TEXT NOT NULL,
  exclude_terms TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Function to get products with score
-- Currently not being used in products.js > productSearchQueryBuilder
CREATE OR REPLACE FUNCTION get_products_with_score(p_include_ingredients JSON, p_exclude_ingredients JSON)
RETURNS TABLE(
	id INT,
	brand character varying(255),
	name TEXT,
	ingredients TEXT,
	score BIGINT
) AS $$
BEGIN
	RETURN QUERY 
	WITH 
		terms AS (
			SELECT 
				user_id, 
				LOWER(term::text) AS term, 
				1 AS score
			FROM 
				searches, 
				json_array_elements_text(p_include_ingredients::json) AS term
			UNION ALL
			SELECT 
				user_id, 
				LOWER(term::text) AS term, 
				-1 AS score
			FROM 
				searches, 
				json_array_elements_text(p_exclude_ingredients::json) AS term
		),
		product_scores AS (
			SELECT 
				p.id, 
				p.brand, 
				p.name, 
				p.ingredients, 
				t.user_id, 
				SUM(t.score) AS score
			FROM 
				products p
			JOIN 
				terms t ON LOWER(p.ingredients) LIKE '%' || t.term || '%'
			GROUP BY 
				p.id, 
				p.brand, 
				p.name, 
				p.ingredients, 
				t.user_id
		)
	SELECT DISTINCT
		p.id, 
		p.brand, 
		p.name, 
		p.ingredients, 
		ps.score
	FROM 
		products p
	JOIN 
		product_scores ps ON p.id = ps.id
	ORDER BY 
		score DESC 
	LIMIT 50;
END; $$ 
LANGUAGE plpgsql;

CREATE INDEX idx_products_name ON products (brand, name, ingredients);
