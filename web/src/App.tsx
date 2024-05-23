import { Suspense, useEffect, useState } from "react";
import { Footer, TopNav, Main } from "@components";

function App() {
	const [checked, setChecked] = useState(false);
	const [includedIngredients, setIncludedIngredients] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState([]);

	useEffect(() => {
		setIsLoading(true);
		fetch("http://localhost:3000/ingredients")
			.then((response) => response.json())
			.then((res) => {
				setResults(res);
				setIsLoading(false);
			})
			.catch((error) => console.error(error));
	}, [includedIngredients, excludedIngredients, isLoading]);

	const handleToggle = () => {
		setChecked((prev) => !prev);
	};

	const handleIngredients = (ingredient: string) => {
		if (checked) {
			setIncludedIngredients([...includedIngredients, ingredient]);
		} else {
			setExcludedIngredients([...excludedIngredients, ingredient]);
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
				<Main results={results} />
				<Footer />
			</div>
		</Suspense>
	);
}

export default App;
