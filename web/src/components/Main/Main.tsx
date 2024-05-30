import { useEffect, useMemo, useState } from "react";
import { CatFoodData, SearchBar, SideBar } from "@components";
import { IResult } from "@/App";
import { queryBuilder } from "@utils";
import { useSearch } from "@hooks";

const BACKEND_URL = "http://localhost:3000/ingredients";

export function Main() {
	const [checked, setChecked] = useState<boolean>(true); //defaults to include ingredients
	const [isFirstLoading, setIsFirstLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState<IResult[]>([]);

	const {
		includedSearchTerms,
		setIncludedSearchTerms,
		excludedSearchTerms,
		setExcludedSearchTerms,
		setIsSaveSearchButtonDisabled,
	} = useSearch();

	const query = useMemo(
		() =>
			queryBuilder({
				includedSearchTerms,
				excludedSearchTerms,
			}),
		[includedSearchTerms, excludedSearchTerms]
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
				/>
			</div>
		</div>
	);
}
