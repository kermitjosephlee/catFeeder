import { useContext } from "react";
import { SearchContext } from "@contexts";

export function useSearch() {
	const {
		excludedSearchTerms,
		includedSearchTerms,
		isSaveSearchButtonDisabled,
		isSearchesDialogOpen,
		isDeleteMultipleModeOpen,
		setIsDeleteMultipleModeOpen,
		setIsSearchesDialogOpen,
		setExcludedSearchTerms,
		setIncludedSearchTerms,
		setIsSaveSearchButtonDisabled,
	} = useContext(SearchContext);

	return {
		excludedSearchTerms,
		includedSearchTerms,
		isSaveSearchButtonDisabled,
		isSearchesDialogOpen,
		isDeleteMultipleModeOpen,
		setIsDeleteMultipleModeOpen,
		setIsSearchesDialogOpen,
		setExcludedSearchTerms,
		setIncludedSearchTerms,
		setIsSaveSearchButtonDisabled,
	};
}
