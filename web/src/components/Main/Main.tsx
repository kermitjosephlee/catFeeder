import { useEffect, useMemo, useState } from "react";
import { CatFoodData, IngredientsBar, SideBar } from "@components";
import { IResult } from "../../App";
import { queryBuilder } from "../../utils";

const BACKEND_URL = "http://localhost:3000/ingredients";

export function Main() {
	const [checked, setChecked] = useState<boolean>(true); //defaults to include ingredients
	const [includedIngredients, setIncludedIngredients] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
	const [isFirstLoading, setIsFirstLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState<IResult[]>([]);
	const query = useMemo(
		() => queryBuilder({ includedIngredients, excludedIngredients }),
		[includedIngredients, excludedIngredients]
	);
	const resultsLength = results.length;

	useEffect(() => {
		setIsLoading(true);
		fetch(`${BACKEND_URL}${query}`)
			.then((response) => response.json())
			.then((res) => {
				setResults(res);
			})
			.catch((error) => console.error(error))
			.finally(() => {
				if (isFirstLoading) setIsFirstLoading(false);
				setIsLoading(false);
			});
	}, [query, isFirstLoading]);

	const handleIngredients = (ingredient: string) => {
		if (checked && !includedIngredients.includes(ingredient)) {
			setIncludedIngredients([...includedIngredients, ingredient]);

			if (excludedIngredients.includes(ingredient)) {
				setExcludedIngredients(
					excludedIngredients.filter((excluded) => excluded !== ingredient)
				);
			}
		}

		if (!checked && !excludedIngredients.includes(ingredient)) {
			setExcludedIngredients([...excludedIngredients, ingredient]);

			if (includedIngredients.includes(ingredient)) {
				setIncludedIngredients(
					includedIngredients.filter((included) => included !== ingredient)
				);
			}
		}
	};

	const handleIngredientsReset = () => {
		setIncludedIngredients([]);
		setExcludedIngredients([]);
	};

	const handleIngredientCancel = (ingredient: string) => {
		if (includedIngredients.includes(ingredient)) {
			setIncludedIngredients(
				includedIngredients.filter((included) => included !== ingredient)
			);
		}

		if (excludedIngredients.includes(ingredient)) {
			setExcludedIngredients(
				excludedIngredients.filter((excluded) => excluded !== ingredient)
			);
		}
	};

	const handleToggle = () => {
		setChecked((prev) => !prev);
	};

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
				<IngredientsBar
					checked={checked}
					handleIngredients={handleIngredients}
					handleToggle={handleToggle}
				/>
				<CatFoodData results={results} isLoading={isLoading} />
			</div>
		</div>
	);
}
