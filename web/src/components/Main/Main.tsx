import { CatFoodData, IngredientsBar, SideBar } from "@components";
import { IResult } from "../../App";

interface IProps {
	results: IResult[];
	includedIngredients: string[];
	excludedIngredients: string[];
	handleIngredientsReset: () => void;
	handleIngredientCancel: (ingredient: string) => void;
}

export function Main({
	results,
	includedIngredients,
	excludedIngredients,
	handleIngredientsReset,
	handleIngredientCancel,
}: IProps) {
	const resultsLength = results.length;

	return (
		<div className="flex w-full">
			<SideBar
				includedIngredients={includedIngredients}
				excludedIngredients={excludedIngredients}
				resultsLength={resultsLength}
				handleIngredientsReset={handleIngredientsReset}
				handleIngredientCancel={handleIngredientCancel}
			/>
			<div className="flex flex-col">
				<IngredientsBar />
				<CatFoodData results={results} />
			</div>
		</div>
	);
}
