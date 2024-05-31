import { useEffect, useState } from "react";
import { CatFoodData, SearchBar, SideBar } from "@components";
import { IResult } from "@/App";
import { queryBuilder } from "@utils";
import { useSearch } from "@hooks";

const PRODUCTS_URL = "http://localhost:3000/products";

export function Main() {
	const [checked, setChecked] = useState<boolean>(true); //defaults to include ingredients
	const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [productCount, setProductCount] = useState<number>(0);
	const [results, setResults] = useState<IResult[]>([]);

	const {
		includedSearchTerms,
		setIncludedSearchTerms,
		excludedSearchTerms,
		setExcludedSearchTerms,
		setIsSaveSearchButtonDisabled,
	} = useSearch();

	const resultsLength = results.length;

	// set product count on first load
	useEffect(() => {
		setIsLoading(true);
		fetch(`http://localhost:3000/product_count`)
			.then((response) => response.json())
			.then((data) => {
				setProductCount(+data);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	// fetch products first time
	useEffect(() => {
		setIsLoading(true);
		const query = queryBuilder({
			includedSearchTerms,
			excludedSearchTerms,
			page: currentPage,
		});
		fetch(`${PRODUCTS_URL}${query}`)
			.then((response) => response.json())
			.then((res) => {
				setResults([...results, ...res]);
				setCurrentPage(currentPage + 1);
			})
			.catch((error) => console.error(error))
			.finally(() => {
				if (isFirstLoading) setIsFirstLoading(false);
				setIsLoading(false);
			});
	}, [isFirstLoading]);

	const handleSearchTerm = (searchTerm: string) => {
		if (checked && !includedSearchTerms.includes(searchTerm)) {
			setIncludedSearchTerms([...includedSearchTerms, searchTerm]);

			if (excludedSearchTerms.includes(searchTerm)) {
				setExcludedSearchTerms(
					excludedSearchTerms.filter((excluded) => excluded !== searchTerm)
				);
			}
		}

		if (!checked && !excludedSearchTerms.includes(searchTerm)) {
			setExcludedSearchTerms([...excludedSearchTerms, searchTerm]);

			if (includedSearchTerms.includes(searchTerm)) {
				setIncludedSearchTerms(
					includedSearchTerms.filter((included) => included !== searchTerm)
				);
			}
		}
	};

	const handleSearchTermsReset = () => {
		setIncludedSearchTerms([]);
		setExcludedSearchTerms([]);
		setIsSaveSearchButtonDisabled(false);
	};

	const handleSearchTermCancel = (searchTerm: string) => {
		if (includedSearchTerms.includes(searchTerm)) {
			setIncludedSearchTerms(
				includedSearchTerms.filter((included) => included !== searchTerm)
			);
		}

		if (excludedSearchTerms.includes(searchTerm)) {
			setExcludedSearchTerms(
				excludedSearchTerms.filter((excluded) => excluded !== searchTerm)
			);
		}
	};

	const handleToggle = () => {
		setChecked((prev) => !prev);
	};

	const handleNextPageLoad = () => {
		console.log("handleNextPageLoad");

		const query = queryBuilder({
			includedSearchTerms,
			excludedSearchTerms,
			page: currentPage,
		});

		if (isLoading) {
			setIsLoading(true);
		}

		console.log({ query });

		fetch(`${PRODUCTS_URL}${query}`)
			.then((response) => response.json())
			.then((res) => {
				console.log("Handle Next Page Load", { currentPage, res });
				setResults([...results, ...res]);
				setCurrentPage(currentPage + 1);
			})
			.catch((error) => console.error(error))
			.finally(() => {
				if (isFirstLoading) setIsFirstLoading(false);
				setIsLoading(false);
			});

		return;
	};

	return (
		<div className="flex w-full">
			<SideBar
				includedSearchTerms={includedSearchTerms}
				excludedSearchTerms={excludedSearchTerms}
				handleSearchTermsReset={handleSearchTermsReset}
				handleSearchTermCancel={handleSearchTermCancel}
			/>
			<div className="flex flex-col flex-grow">
				<SearchBar
					checked={checked}
					resultsLength={resultsLength}
					handleSearchTerm={handleSearchTerm}
					handleToggle={handleToggle}
				/>
				<CatFoodData
					results={results}
					isLoading={isLoading}
					isFirstLoading={isFirstLoading}
					handleNextPageLoad={handleNextPageLoad}
					productCount={productCount}
				/>
			</div>
		</div>
	);
}
