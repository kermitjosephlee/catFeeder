import { Suspense, useEffect, useState } from "react";
import { TopNav, Main } from "@components";

export interface IResult {
	id: number;
	brand: string;
	name: string;
	image_url?: string;
	link_url: string;
	ingredients: string;
	created_at?: Date;
	updated_at?: Date;
}

const BACKEND_URL = "http://localhost:3000/ingredients";
const queryBuilder = (
	includedIngredients: string[],
	excludedIngredients: string[]
): string => {
	const hasQuery =
		includedIngredients.length > 0 || excludedIngredients.length > 0;
	const hasQueryStr = hasQuery ? "?" : "";
	const includeStr =
		includedIngredients.length > 0
			? `include=${includedIngredients.join(",")}`
			: "";
	const excludeStr =
		excludedIngredients.length > 0
			? `exclude=${excludedIngredients.join(",")}`
			: "";

	return `${hasQueryStr}${includeStr}${
		excludeStr.length > 0 ? "&" : ""
	}${excludeStr}`;
};

function App() {
	const [checked, setChecked] = useState(true); //defaults to include ingredients
	const [includedIngredients, setIncludedIngredients] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
	// const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState<IResult[]>([]);
	const query = queryBuilder(includedIngredients, excludedIngredients);

	useEffect(() => {
		// setIsLoading(true);
		fetch(`${BACKEND_URL}${query}`)
			.then((response) => response.json())
			.then((res) => {
				setResults(res);
				// setIsLoading(false);
			})
			.catch((error) => console.error(error));
	}, [includedIngredients, excludedIngredients, query]);

	const handleToggle = () => {
		setChecked((prev) => !prev);
	};

	console.log({ includedIngredients, excludedIngredients });

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

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="flex flex-col w-full text-red-800">
				<TopNav
					checked={checked}
					handleToggle={handleToggle}
					handleIngredients={handleIngredients}
				/>
				<Main
					results={results}
					includedIngredients={includedIngredients}
					excludedIngredients={excludedIngredients}
				/>
			</div>
		</Suspense>
	);
}

export default App;
