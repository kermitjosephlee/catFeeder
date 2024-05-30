import { useGetUser, useSearch } from "@hooks";
import { SearchType } from "@types";
import { SearchesDialogListItem } from "@components";

export function SearchesDialogList({
	deleteSearchIds,
	handleSelectDeleteSearchCheckbox,
}: {
	deleteSearchIds: string[];
	handleSelectDeleteSearchCheckbox: (id: string) => void;
}) {
	const user = useGetUser();

	const {
		setIncludedSearchTerms,
		setExcludedSearchTerms,
		setIsSaveSearchButtonDisabled,
	} = useSearch();

	const searches = user?.searches;
	console.log({ searches });
	const filteredSearches = searches?.filter((search) => !!search.id);

	if (!filteredSearches || filteredSearches.length === 0) {
		return <div>No searches found</div>;
	}

	const handleSearch = (search: SearchType) => {
		const { include, exclude } = search;

		if (include) {
			setIncludedSearchTerms(include);
		}
		if (exclude) {
			setExcludedSearchTerms(exclude);
		}
		setIsSaveSearchButtonDisabled(true);
	};

	return (
		<div className="pt-6">
			{filteredSearches.map((search) => (
				<SearchesDialogListItem
					deleteSearchIds={deleteSearchIds}
					key={search.id}
					search={search}
					handleSelectDeleteSearchCheckbox={handleSelectDeleteSearchCheckbox}
					handleSearch={handleSearch}
				/>
			))}
		</div>
	);
}
