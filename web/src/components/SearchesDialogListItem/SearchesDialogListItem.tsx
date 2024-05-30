import { SearchType } from "@types";
import { useSearch, useGetUser, useDeleteSearch } from "@hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { Checkbox, IngredientsRow } from "./subcomponents";

interface IProps {
	deleteSearchIds: string[];
	search: SearchType;
	handleSearch: (search: SearchType) => void;
	handleSelectDeleteSearchCheckbox: (id: string) => void;
}

export function SearchesDialogListItem({
	deleteSearchIds,
	search,
	handleSearch,
	handleSelectDeleteSearchCheckbox,
}: IProps) {
	const { isDeleteMultipleModeOpen, setIsSearchesDialogOpen } = useSearch();
	const user = useGetUser();
	const deleteSearch = useDeleteSearch();

	const searchId = search?.id.toString() ?? "";

	const checked = deleteSearchIds.includes(searchId);

	const handleCheckboxClick = () => {
		handleSelectDeleteSearchCheckbox(searchId);
	};

	const handleRowClick = () => {
		setIsSearchesDialogOpen(false);
		handleSearch(search);
	};

	const handleRowDeleteClick = () => {
		if (!user) return;
		deleteSearch({ userId: user.id, searchIds: [searchId] });
		setIsSearchesDialogOpen(false);
	};

	const rowClassName = checked
		? "flex items-center grow h-16 p-2 overflow-scroll rounded-lg bg-gray-200"
		: "flex items-center grow h-16 p-2 overflow-scroll rounded-lg";

	return (
		<div
			className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"
			key={search.id}>
			<div className="flex w-full items-center">
				<div className="mr-4 flex-none w-4">
					{isDeleteMultipleModeOpen && (
						<Checkbox checked={checked} onClick={handleCheckboxClick} />
					)}
				</div>
				<div
					style={{ scrollbarWidth: "none" }}
					className={rowClassName}
					onClick={handleRowClick}>
					<IngredientsRow
						ingredients={search.include || []}
						isIncluded={true}
					/>
					<IngredientsRow
						ingredients={search.exclude || []}
						isIncluded={false}
					/>
				</div>

				<div className="flex-none w-4 pl-1 ml-1" onClick={handleRowDeleteClick}>
					{!isDeleteMultipleModeOpen && (
						<FontAwesomeIcon size="lg" icon={faCircleXmark} />
					)}
				</div>
			</div>
		</div>
	);
}
