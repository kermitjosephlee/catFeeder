import { IngredientEnum } from "./IngredientEnum";

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
	return (
		<div
			className={
				type === IngredientEnum.INCLUDED
					? "bg-green-300 rounded-xl m-2 p-2 cursor-pointer"
					: "bg-red-300 rounded-xl m-2 p-2 cursor-pointer"
			}
			onClick={() => handleIngredientCancel(ingredient)}
		>
			{ingredient}
		</div>
	);
}
