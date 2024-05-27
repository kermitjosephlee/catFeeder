export function queryBuilder({
	includedIngredients,
	excludedIngredients,
}: {
	includedIngredients: string[];
	excludedIngredients: string[];
}): string {
	const hasQuery =
		includedIngredients.length > 0 || excludedIngredients.length > 0;
	const hasQueryStr = hasQuery ? "?" : "";
	const includeStr =
		includedIngredients.length > 0
			? `include=${includedIngredients.join(",")}`
			: "";
	const excludeStr =
		excludedIngredients.length > 0
			? `exclude=${excludedIngredients.join(",")}`
			: "";

	return `${hasQueryStr}${includeStr}${
		excludeStr.length > 0 ? "&" : ""
	}${excludeStr}`;
}
