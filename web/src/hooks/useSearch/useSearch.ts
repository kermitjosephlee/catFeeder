import { useContext } from "react";
import { SearchContext } from "@contexts";

export function useSearch() {
	const {
		excludedSearchTerms,
		includedSearchTerms,
		isDeleteMultipleModeOpen,
		isSaveSearchButtonDisabled,
		isSearchesDialogOpen,
		setExcludedSearchTerms,
		setIncludedSearchTerms,
		setIsDeleteMultipleModeOpen,
		setIsSaveSearchButtonDisabled,
		setIsSearchesDialogOpen,
	} = useContext(SearchContext);

	return {
		excludedSearchTerms,
		includedSearchTerms,
		isDeleteMultipleModeOpen,
		isSaveSearchButtonDisabled,
		isSearchesDialogOpen,
		setExcludedSearchTerms,
		setIncludedSearchTerms,
		setIsDeleteMultipleModeOpen,
		setIsSaveSearchButtonDisabled,
		setIsSearchesDialogOpen,
	};
}
