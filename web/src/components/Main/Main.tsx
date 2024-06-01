import { useEffect, useState, useCallback } from "react";
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
		fetch(`http://localhost:3000/product_count`)
			.then((response) => response.json())
			.then((data) => {
				setProductCount(+data);
			})
			.catch((err) => {
				console.error(err);
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
				const updatedResults = [...results, ...res];
				setResults(updatedResults);
				setCurrentPage(currentPage + 1);
			})
			.catch((error) => console.error(error))
			.finally(() => {
				setIsLoading(false);
				setIsFirstLoading(false);
			});
	}, []);

	// fetches data on search term change
	// used inside useEffect
	const handleSearchUpdateLoad = useCallback(async () => {
		setIsLoading(true);

		const query = queryBuilder({
			includedSearchTerms,
			excludedSearchTerms,
		});

		const response = await fetch(`${PRODUCTS_URL}${query}`);
		const res = await response.json();
		await setResults(res);
		await setIsLoading(false);
	}, [includedSearchTerms, excludedSearchTerms]);

	// checks for changes in search terms and fetches new data
	useEffect(() => {
		handleSearchUpdateLoad();
	}, [includedSearchTerms, excludedSearchTerms, handleSearchUpdateLoad]);

	// fetches more data on scroll
	const handleNextPageLoad = () => {
		const query = queryBuilder({
			includedSearchTerms,
			excludedSearchTerms,
			page: currentPage,
		});

		setIsLoading(true);

		fetch(`${PRODUCTS_URL}${query}`)
			.then((response) => response.json())
			.then((res) => {
				console.log("Handle Next Page Load", { currentPage, res });
				const updatedResults = [...results, ...res];
				setResults(updatedResults);
				setCurrentPage(currentPage + 1);
			})
			.catch((error) => console.error(error))
			.finally(() => {
				setIsLoading(false);
			});

		return;
	};

	const handleSearchTerm = (searchTerm: string) => {
		if (checked && !includedSearchTerms.includes(searchTerm)) {
			const updatedIncludedSearchTerms = [...includedSearchTerms, searchTerm];
			setIncludedSearchTerms(updatedIncludedSearchTerms);

			if (excludedSearchTerms.includes(searchTerm)) {
				const updatedExcludedSearchTerms = excludedSearchTerms.filter(
					(excluded) => excluded !== searchTerm
				);
				setExcludedSearchTerms(updatedExcludedSearchTerms);
			}
		}

		if (!checked && !excludedSearchTerms.includes(searchTerm)) {
			const updatedExcludedSearchTerms = [...excludedSearchTerms, searchTerm];
			setExcludedSearchTerms(updatedExcludedSearchTerms);

			if (includedSearchTerms.includes(searchTerm)) {
				const updatedIncludedSearchTerms = includedSearchTerms.filter(
					(included) => included !== searchTerm
				);
				setIncludedSearchTerms(updatedIncludedSearchTerms);
			}
		}
	};

	const handleSearchTermCancel = (searchTerm: string) => {
		if (includedSearchTerms.includes(searchTerm)) {
			const updatedIncludedSearchTerms = includedSearchTerms.filter(
				(included) => included !== searchTerm
			);
			setIncludedSearchTerms(updatedIncludedSearchTerms);
		}

		if (excludedSearchTerms.includes(searchTerm)) {
			const updatedExcludedSearchTerms = excludedSearchTerms.filter(
				(excluded) => excluded !== searchTerm
			);
			setExcludedSearchTerms(updatedExcludedSearchTerms);
		}
		handleSearchUpdateLoad();
	};

	const handleSearchTermsReset = () => {
		setCurrentPage(0);
		setResults([]);

		setIncludedSearchTerms([]);
		setExcludedSearchTerms([]);
		setIsSaveSearchButtonDisabled(false);
		handleSearchUpdateLoad();
	};

	const handleToggle = () => {
		setChecked((prev) => !prev);
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
