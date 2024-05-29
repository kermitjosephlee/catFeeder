import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { SearchType } from "@types";

interface IProps {
	search: SearchType;
	handleSearch: (search: SearchType) => void;
	handleRemoveSearch: (id: string) => void;
}

export function SearchesDialogListItem({
	search,
	handleSearch,
	handleRemoveSearch,
}: IProps) {
	return (
		<div
			className="flex justify-between items-center mt-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
			key={search.id}>
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
	);
}
