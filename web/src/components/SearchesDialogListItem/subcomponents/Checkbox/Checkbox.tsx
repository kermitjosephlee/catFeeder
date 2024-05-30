import { FaRegSquare, FaRegWindowClose } from "react-icons/fa";

export function Checkbox({
	checked,
	onClick,
}: {
	checked: boolean;
	onClick: () => void;
}) {
	return checked ? (
		<FaRegWindowClose onClick={onClick} />
	) : (
		<FaRegSquare onClick={onClick} />
	);
}
