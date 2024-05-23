import { CatFoodData, SideBar } from "@components";
import { IResult } from "../../App";

interface IProps {
	results: IResult[];
	includedIngredients: string[];
	excludedIngredients: string[];
}

export function Main({
	results,
	includedIngredients,
	excludedIngredients,
}: IProps) {
	return (
		<div className="flex w-full">
			<SideBar
				includedIngredients={includedIngredients}
				excludedIngredients={excludedIngredients}
			/>
			<CatFoodData results={results} />
		</div>
	);
}
