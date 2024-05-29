import { useContext } from "react";
import { SearchContext } from "@contexts";

export function useSearch() {
	const {
		excludedSearchTerms,
		includedSearchTerms,
		isSaveSearchButtonDisabled,
		setExcludedSearchTerms,
		setIncludedSearchTerms,
		setIsSaveSearchButtonDisabled,
	} = useContext(SearchContext);

	return {
		excludedSearchTerms,
		includedSearchTerms,
		isSaveSearchButtonDisabled,
		setExcludedSearchTerms,
		setIncludedSearchTerms,
		setIsSaveSearchButtonDisabled,
	};
}
