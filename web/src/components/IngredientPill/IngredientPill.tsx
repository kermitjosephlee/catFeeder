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
	const onClick = () => {
		handleIngredientCancel(ingredient);
	};
	return (
		<div
			className={
				type === IngredientEnum.INCLUDED
					? "flex justify-between bg-green-200 rounded-xl m-2 p-2 cursor-pointer"
					: "flex justify-between bg-red-200 rounded-xl m-2 p-2 cursor-pointer"
			}
			onClick={onClick}>
			<p>{ingredient}</p>
			<p>x</p>
		</div>
	);
}
