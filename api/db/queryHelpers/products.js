const queryArrayBuilder = (arr) => {
	return arr.map((each) => `'${each}'`);
};

export const productCountQueryBuilder = ({
	includeIngredients = [],
	excludeIngredients = [],
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
		? `(${formattedIncludeIngredients
				.map(
					(_, index) =>
						`(LOWER(products.ingredients) LIKE '%' || LOWER($${
							index + 1
						}) || '%' OR LOWER(products.brand) LIKE '%' || LOWER($${
							index + 1
						}) || '%' OR LOWER(products.name) LIKE '%' || LOWER($${
							index + 1
						}) || '%')`
				)
				.join(" AND ")})`
		: "";

	const excludeSubQuery = hasExcludeIngredients
		? `NOT (${formattedExcludeIngredients
				.map(
					(_, index) =>
						`(LOWER(products.ingredients) LIKE '%' || LOWER($${
							index + formattedIncludeIngredients.length + 1
						}) || '%' OR LOWER(products.brand) LIKE '%' || LOWER($${
							index + formattedIncludeIngredients.length + 1
						}) || '%' OR LOWER(products.name) LIKE '%' || LOWER($${
							index + formattedIncludeIngredients.length + 1
						}) || '%')`
				)
				.join(" OR ")})`
		: "";

	const formattedQuery = `SELECT COUNT(*)
    FROM products
    ${hasIncludeIngredients || hasExcludeIngredients ? " WHERE " : ""}
    ${includeSubQuery}
    ${hasBothIncludeAndExcludeIngredients ? " AND " : ""}
    ${excludeSubQuery}
    ;`;

	return {
		productCountQuery: formattedQuery,
		productCountParams: [...includeIngredients, ...excludeIngredients],
	};
};

export const productSearchQueryBuilder = ({
	includeIngredients = [],
	excludeIngredients = [],
	page = 1,
	limit = 20,
	userId = null,
}) => {
	const formattedIncludeIngredients =
		queryArrayBuilder(includeIngredients) || [];
	const formattedExcludeIngredients =
		queryArrayBuilder(excludeIngredients) || [];

	const hasIncludeIngredients = formattedIncludeIngredients.length > 0;
	const hasExcludeIngredients = formattedExcludeIngredients.length > 0;
	const hasBothIncludeAndExcludeIngredients =
		hasIncludeIngredients && hasExcludeIngredients;

	const hasPage = !!page && page > 0;

	const hasLimit = !!limit && limit > 0;

	const hasUserId = !!userId;

	// -- updated default limit to 86 to flag issues with pagination
	const limitSubQuery = hasLimit ? ` LIMIT ${limit} ` : " LIMIT 86 ";

	const offset = page * limit;

	const offsetSubQuery = hasPage && hasLimit ? ` OFFSET ${offset} ` : "";

	const termsSubQuery = `
	WITH terms AS (
		SELECT 
			user_id, 
			LOWER(term::text) AS term, 
			1 AS score
		FROM 
			searches, 
			json_array_elements_text(include_terms::json) AS term
		UNION ALL
		SELECT 
			user_id, 
			LOWER(term::text) AS term,
			-1 AS score
		FROM 
			searches,
			json_array_elements_text(exclude_terms::json) AS term
		${hasUserId ? `WHERE user_id = ${userId}` : ""}
	),
	`;

	const productScoresSubQuery = `
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
	`;

	const productAndProductScoresJoinSubQuery = `
	    SELECT DISTINCT
        p.id, 
        p.brand, 
        p.name, 
        p.ingredients, 
        ps.score
    FROM 
        products p
    JOIN 
        product_scores ps ON p.id = ps.id`;

	const includeSubQuery = hasIncludeIngredients
		? `(${formattedIncludeIngredients
				.map(
					(_, index) =>
						`(LOWER(p.ingredients) LIKE '%' || LOWER($${
							index + 1
						}) || '%' OR LOWER(p.brand) LIKE '%' || LOWER($${
							index + 1
						}) || '%' OR LOWER(p.name) LIKE '%' || LOWER($${index + 1}) || '%')`
				)
				.join(" AND ")})`
		: "";

	const excludeSubQuery = hasExcludeIngredients
		? `NOT (${formattedExcludeIngredients
				.map(
					(_, index) =>
						`(LOWER(p.ingredients) LIKE '%' || LOWER($${
							index + formattedIncludeIngredients.length + 1
						}) || '%' OR LOWER(p.brand) LIKE '%' || LOWER($${
							index + formattedIncludeIngredients.length + 1
						}) || '%' OR LOWER(p.name) LIKE '%' || LOWER($${
							index + formattedIncludeIngredients.length + 1
						}) || '%')`
				)
				.join(" OR ")})`
		: "";

	const orderBySubQuery = " ORDER BY score DESC ";

	const formattedQuery = `
		${termsSubQuery}
	 	${productScoresSubQuery}
		${productAndProductScoresJoinSubQuery}
    ${hasIncludeIngredients || hasExcludeIngredients ? " WHERE " : ""}
    ${includeSubQuery}
    ${hasBothIncludeAndExcludeIngredients ? " AND " : ""}
    ${excludeSubQuery}
		${orderBySubQuery}
    ${limitSubQuery}
    ${offsetSubQuery}
    ;`;

	const returnObj = {
		ingredientsQuery: formattedQuery,
		ingredientsArray: [...includeIngredients, ...excludeIngredients],
		page,
		limit,
	};

	return returnObj;
};
