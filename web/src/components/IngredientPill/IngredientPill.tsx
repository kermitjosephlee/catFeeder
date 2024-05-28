import { IngredientEnum } from "./IngredientEnum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

interface IProps {
	ingredient: string;
	type: IngredientEnum;
	handleIngredientCancel: (ingredient: string) => void;
}

export function IngredientPill({
	ingredient,
	type,
	handleIngredientCancel,
}: IProps) {
	const onClick = () => {
		handleIngredientCancel(ingredient);
	};
	return (
		<div
			className={
				type === IngredientEnum.INCLUDED
					? "flex justify-between bg-green-200 m-2 px-4 cursor-pointer btn"
					: "flex justify-between bg-red-200 m-2 px-4 cursor-pointer btn"
			}
			onClick={onClick}>
			<p>{ingredient}</p>
			<p>
				<FontAwesomeIcon icon={faCircleXmark} />
			</p>
		</div>
	);
}
