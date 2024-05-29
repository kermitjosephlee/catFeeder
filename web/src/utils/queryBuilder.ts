export function queryBuilder({
	includedSearchTerms,
	excludedSearchTerms,
}: {
	includedSearchTerms: string[];
	excludedSearchTerms: string[];
}): string {
	const hasQuery =
		includedSearchTerms.length > 0 || excludedSearchTerms.length > 0;
	const hasQueryStr = hasQuery ? "?" : "";
	const includeStr =
		includedSearchTerms.length > 0
			? `include=${includedSearchTerms.join(",")}`
			: "";
	const excludeStr =
		excludedSearchTerms.length > 0
			? `exclude=${excludedSearchTerms.join(",")}`
			: "";

	return `${hasQueryStr}${includeStr}${
		excludeStr.length > 0 ? "&" : ""
	}${excludeStr}`;
}
