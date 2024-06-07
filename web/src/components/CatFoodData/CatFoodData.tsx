import { CatFoodCards, CatFoodNoResults } from "@components";
import { IResult as ICatFood } from "../../App";

interface IProps {
	results: (ICatFood | undefined)[];
	isLoading: boolean;
	isFirstLoading: boolean;
	productCount: number;
	handleNextPageLoad: () => void;
}

export function CatFoodData({
	results,
	isLoading,
	isFirstLoading,
	productCount,
	handleNextPageLoad,
}: IProps) {
	const noResults = results.length === 0;
	const showResults = results.length > 0;
	const showNoResults = !isLoading && !isFirstLoading && noResults;

	return (
		<div className="p-4">
			{showResults && (
				<CatFoodCards
					results={results}
					productCount={productCount}
					handleNextPageLoad={handleNextPageLoad}
				/>
			)}
			{showNoResults && <CatFoodNoResults />}
		</div>
	);
}
