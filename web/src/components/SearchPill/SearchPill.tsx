import { SearchEnum } from "./SearchEnum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

interface IProps {
	searchTerm: string;
	type: SearchEnum;
	handleSearchTermCancel: (searchTerm: string) => void;
}

export function SearchPill({
	searchTerm,
	type,
	handleSearchTermCancel,
}: IProps) {
	const onClick = () => {
		handleSearchTermCancel(searchTerm);
	};
	return (
		<div
			className={
				type === SearchEnum.INCLUDED
					? "flex text-lg justify-between m-1 px-4 cursor-pointer btn btn-outline btn-success"
					: "flex text-lg justify-between m-1 px-4 cursor-pointer btn btn-outline btn-error"
			}
			onClick={onClick}>
			<div className="flex items-center">
				<p className="pr-2">{type === SearchEnum.INCLUDED ? "+" : "-"}</p>
				<p className="overflow-hidden">{searchTerm}</p>
			</div>
			<p>
				<FontAwesomeIcon size="lg" icon={faCircleXmark} />
			</p>
		</div>
	);
}
