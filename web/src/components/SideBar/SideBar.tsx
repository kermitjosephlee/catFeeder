interface IProps {
	includedIngredients: string[];
	excludedIngredients: string[];
}

export function SideBar({ includedIngredients, excludedIngredients }: IProps) {
	return (
		<div className="flex flex-col w-[50%]">
			{includedIngredients.length > 0 && <p>Includes</p>}
			{includedIngredients.map((ingredient) => (
				<p key={ingredient}>{ingredient}</p>
			))}
			{excludedIngredients.length > 0 && <p>Excludes</p>}
			{excludedIngredients.map((ingredient) => (
				<p key={ingredient}>{ingredient}</p>
			))}
		</div>
	);
}
