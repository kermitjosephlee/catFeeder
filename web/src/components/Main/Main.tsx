import { useEffect, useState, useCallback } from "react";
import { CatFoodData, SearchBar, SideBar } from "@components";
import { IResult } from "@/App";
import { queryBuilder } from "@utils";
import { useSearch } from "@hooks";

const PRODUCTS_URL = "http://localhost:3000/products";

const PRODUCT_COUNT_URL = "http://localhost:3000/product_count";

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

	// set product count
	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		const query = queryBuilder({
			includedSearchTerms,
			excludedSearchTerms,
			isProductCount: true,
		});

		fetch(`${PRODUCT_COUNT_URL}${query}`, { signal })
			.then((response) => response.json())
			.then((data) => {
				setProductCount(+data);
			})
			.then(() => {
				if (isFirstLoading) {
					setIsFirstLoading(false);
				}
			})
			.catch((err) => {
				console.log(signal, err);
			});

		return () => controller.abort();
	}, [includedSearchTerms, excludedSearchTerms, isFirstLoading]);

	// fetches data on search term change
	// used inside useEffect
	const handleSearchUpdateLoad = useCallback(async () => {
		setIsLoading(true);

		const query = queryBuilder({
			includedSearchTerms,
			excludedSearchTerms,
		});

		const controller = new AbortController();
		const signal = controller.signal;

		const response = await fetch(`${PRODUCTS_URL}${query}`, { signal });
		const res = await response.json().catch((err) => {
			console.log(signal.aborted, err);
		});

		await setResults(res);
		await setIsLoading(false);

		return () => controller.abort();
	}, [includedSearchTerms, excludedSearchTerms]);

	// checks for changes in search terms and fetches new data
	useEffect(() => {
		handleSearchUpdateLoad();
	}, [includedSearchTerms, excludedSearchTerms, handleSearchUpdateLoad]);

	// fetches more data on scroll
	const handleNextPageLoad = () => {
		if (isLoading) {
			return;
		}

		const query = queryBuilder({
			includedSearchTerms,
			excludedSearchTerms,
			page: currentPage,
		});

		const controller = new AbortController();
		const signal = controller.signal;

		setIsLoading(true);

		fetch(`${PRODUCTS_URL}${query}`, { signal })
			.then((response) => response.json())
			.then((res) => {
				const updatedResults = [...results, ...res];
				setResults(updatedResults);
				setCurrentPage(currentPage + 1);
			})
			.catch((error) => {
				console.log(signal.aborted, error);
			})
			.finally(() => {
				setIsLoading(false);
			});

		return () => controller.abort();
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
			setIncludedSearchTerms(
				includedSearchTerms.filter((included) => included !== searchTerm)
			);
		}

		if (excludedSearchTerms.includes(searchTerm)) {
			setExcludedSearchTerms(
				excludedSearchTerms.filter((excluded) => excluded !== searchTerm)
			);
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
			<div className="flex flex-col min-w-48 p-3 sticky top-0">
				<SideBar
					includedSearchTerms={includedSearchTerms}
					excludedSearchTerms={excludedSearchTerms}
					handleSearchTermsReset={handleSearchTermsReset}
					handleSearchTermCancel={handleSearchTermCancel}
				/>
			</div>
			<div className="flex flex-col flex-grow">
				<SearchBar
					checked={checked}
					resultsLength={resultsLength}
					productCount={productCount}
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
