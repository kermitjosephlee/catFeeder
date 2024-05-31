import format from "pg-format";

const queryArrayBuilder = (arr) => {
	return arr.map((each) => `'${each}'`);
};

export const productsQueryBuilder = ({
	includeIngredients = [],
	excludeIngredients = [],
	page = 1,
	limit = 20,
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

	// TODO: update LIMIT default from 1
	const limitSubQuery = hasLimit ? ` LIMIT ${limit}` : "LIMIT 1";

	const offset = page * limit;

	const offsetSubQuery = hasPage && hasLimit ? ` OFFSET ${offset}` : "";

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

	const formattedQuery = `SELECT products.*
    FROM products
    ${hasIncludeIngredients || hasExcludeIngredients ? " WHERE " : ""}
    ${includeSubQuery}
    ${hasBothIncludeAndExcludeIngredients ? " AND " : ""}
    ${excludeSubQuery}
    ${limitSubQuery}
    ${offsetSubQuery}
    ;`;

	return {
		ingredientsQuery: formattedQuery,
		ingredientsArray: [...includeIngredients, ...excludeIngredients],
		page,
		limit,
	};
};
