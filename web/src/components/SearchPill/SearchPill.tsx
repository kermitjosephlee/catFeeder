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
					? "flex justify-between bg-green-200 m-1 px-4 cursor-pointer btn"
					: "flex justify-between bg-red-200 m-1 px-4 cursor-pointer btn"
			}
			onClick={onClick}>
			<p>{searchTerm}</p>
			<p>
				<FontAwesomeIcon icon={faCircleXmark} />
			</p>
		</div>
	);
}
