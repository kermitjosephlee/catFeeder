import { IngredientPill, IngredientEnum } from "@components";

interface IProps {
	includedIngredients: string[];
	excludedIngredients: string[];
	resultsLength: number | undefined;
	handleIngredientsReset: () => void;
	handleIngredientCancel: (ingredient: string) => void;
}

export function SideBar({
	includedIngredients,
	excludedIngredients,
	resultsLength,
	handleIngredientsReset,
	handleIngredientCancel,
}: IProps) {
	const hasIngredients =
		includedIngredients.length > 0 || excludedIngredients.length > 0;

	return (
		<div className="flex flex-col min-w-48 p-3">
			{resultsLength && (
				<p>
					Match{resultsLength === 1 ? "" : "es"} {resultsLength}
				</p>
			)}

			{hasIngredients && (
				<button
					className="bg-yellow-800 text-white p-2 rounded-lg m-2"
					onClick={handleIngredientsReset}>
					Clear All
				</button>
			)}
			{includedIngredients.length > 0 && <p>Includes</p>}
			{includedIngredients.map((ingredient) => (
				<IngredientPill
					key={ingredient}
					ingredient={ingredient}
					type={IngredientEnum.INCLUDED}
					handleIngredientCancel={handleIngredientCancel}
				/>
			))}
			{excludedIngredients.length > 0 && <p>Excludes</p>}
			{excludedIngredients.map((ingredient) => (
				<IngredientPill
					key={ingredient}
					ingredient={ingredient}
					type={IngredientEnum.EXCLUDED}
					handleIngredientCancel={handleIngredientCancel}
				/>
			))}
		</div>
	);
}
