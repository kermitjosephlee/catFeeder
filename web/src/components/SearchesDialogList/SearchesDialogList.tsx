import { useCancelSearch, useGetUser, useSearch } from "@hooks";
import { SearchType } from "@types";
import { SearchesDialogListItem } from "@components";

export function SearchesDialogList() {
	const user = useGetUser();
	const cancelSearch = useCancelSearch();
	const {
		setIncludedSearchTerms,
		setExcludedSearchTerms,
		setIsSaveSearchButtonDisabled,
	} = useSearch();
	const searches = user?.searches;

	if (!searches || searches.length === 0) {
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

	const handleRemoveSearch = (id: string) => {
		cancelSearch({ userId: user.id, searchId: id });
	};

	return (
		<div className="pt-6">
			{searches.map((search) => (
				<SearchesDialogListItem
					key={search.id}
					search={search}
					handleSearch={handleSearch}
					handleRemoveSearch={handleRemoveSearch}
				/>
			))}
		</div>
	);
}
