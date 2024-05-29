import {
	createContext,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useState,
} from "react";

export interface ISearchContext {
	excludedSearchTerms: string[];
	includedSearchTerms: string[];
	isSaveSearchButtonDisabled: boolean;
	setExcludedSearchTerms: Dispatch<SetStateAction<string[]>>;
	setIncludedSearchTerms: Dispatch<SetStateAction<string[]>>;
	setIsSaveSearchButtonDisabled: Dispatch<SetStateAction<boolean>>;
}

export const SearchContext = createContext<ISearchContext>({
	excludedSearchTerms: [],
	includedSearchTerms: [],
	isSaveSearchButtonDisabled: false,
	setExcludedSearchTerms: () => {},
	setIncludedSearchTerms: () => {},
	setIsSaveSearchButtonDisabled: () => {},
});

export const SearchProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [includedSearchTerms, setIncludedSearchTerms] = useState<string[]>([]);
	const [excludedSearchTerms, setExcludedSearchTerms] = useState<string[]>([]);
	const [isSaveSearchButtonDisabled, setIsSaveSearchButtonDisabled] =
		useState<boolean>(false);

	return (
		<SearchContext.Provider
			value={{
				excludedSearchTerms,
				includedSearchTerms,
				isSaveSearchButtonDisabled,
				setExcludedSearchTerms,
				setIncludedSearchTerms,
				setIsSaveSearchButtonDisabled,
			}}>
			{children}
		</SearchContext.Provider>
	);
};

export const UserConsumer = SearchContext.Consumer;
