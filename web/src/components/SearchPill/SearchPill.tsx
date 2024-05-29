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
			<p>{searchTerm}</p>
			<p>
				<FontAwesomeIcon size="lg" icon={faCircleXmark} />
			</p>
		</div>
	);
}
