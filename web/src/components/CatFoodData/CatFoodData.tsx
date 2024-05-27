import { CatFoodCard, CatFoodSkeletons, CatFoodNoResults } from "@components";
import { IResult as ICatFood } from "../../App";

interface IProps {
	results: ICatFood[];
	isLoading: boolean;
}

function CatFoodMap({ results }: { results: ICatFood[] }) {
	return results.map((catFood: ICatFood) => {
		return <CatFoodCard key={catFood.id} {...catFood} />;
	});
}

export function CatFoodData({ results, isLoading }: IProps) {
	const noResults = results.length === 0;

	const showSkeletons = isLoading && noResults;
	const showResults = results.length > 0;
	const showNoResults = !isLoading && noResults;

	return (
		<div className="columns-sm p-4 gap-4">
			{showResults && <CatFoodMap results={results} />}
			{showSkeletons && <CatFoodSkeletons />}
			{showNoResults && <CatFoodNoResults />}
		</div>
	);
}
