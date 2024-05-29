import { useCancelSearch, useGetUser, useSearch } from "@hooks";
import { SearchType } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

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
			{searches.map((search, index) => (
				<div
					className="flex justify-between items-center mt-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
					key={index}>
					<div onClick={() => handleSearch(search)}>
						{search.include?.map((each) => (
							<p key={each} className="btn btn-outline btn-success mr-1">
								{each}
							</p>
						))}
						{search.exclude?.map((each) => (
							<p key={each} className="btn btn-outline btn-error mr-1">
								{each}
							</p>
						))}
					</div>
					<div onClick={() => handleRemoveSearch(search.id.toString())}>
						<FontAwesomeIcon size="lg" icon={faCircleXmark} />
					</div>
				</div>
			))}
		</div>
	);
}
