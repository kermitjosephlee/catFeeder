const PAGE_SIZE = 50;

export function queryBuilder({
	includedSearchTerms,
	excludedSearchTerms,
	page,
	isProductCount = false,
}: {
	includedSearchTerms: string[];
	excludedSearchTerms: string[];
	page?: number;
	isProductCount?: boolean;
}): string {
	const includeStr =
		includedSearchTerms.length > 0
			? `include=${includedSearchTerms.join(",")}`
			: "";
	const excludeStr =
		excludedSearchTerms.length > 0
			? `exclude=${excludedSearchTerms.join(",")}`
			: "";

	const pageStr = page || 0;

	const paginationStr = isProductCount ? "" : `&page=${pageStr}&limit=${PAGE_SIZE}`;


	return `?${includeStr}${
		excludeStr.length > 0 ? "&" : ""
	}${excludeStr}${paginationStr}`;
}
