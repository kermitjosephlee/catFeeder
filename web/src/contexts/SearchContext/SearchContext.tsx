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
	isSearchesDialogOpen: boolean;
	isDeleteMultipleModeOpen: boolean;
	setIsDeleteMultipleModeOpen: Dispatch<SetStateAction<boolean>>;
	setExcludedSearchTerms: Dispatch<SetStateAction<string[]>>;
	setIncludedSearchTerms: Dispatch<SetStateAction<string[]>>;
	setIsSaveSearchButtonDisabled: Dispatch<SetStateAction<boolean>>;
	setIsSearchesDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const SearchContext = createContext<ISearchContext>({
	excludedSearchTerms: [],
	includedSearchTerms: [],
	isSaveSearchButtonDisabled: false,
	isSearchesDialogOpen: false,
	isDeleteMultipleModeOpen: false,
	setIsDeleteMultipleModeOpen: () => {},
	setExcludedSearchTerms: () => {},
	setIncludedSearchTerms: () => {},
	setIsSaveSearchButtonDisabled: () => {},
	setIsSearchesDialogOpen: () => {},
});

export const SearchProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [includedSearchTerms, setIncludedSearchTerms] = useState<string[]>([]);
	const [excludedSearchTerms, setExcludedSearchTerms] = useState<string[]>([]);
	const [isSaveSearchButtonDisabled, setIsSaveSearchButtonDisabled] =
		useState<boolean>(false);
	const [isSearchesDialogOpen, setIsSearchesDialogOpen] =
		useState<boolean>(false);
	const [isDeleteMultipleModeOpen, setIsDeleteMultipleModeOpen] =
		useState<boolean>(false);

	return (
		<SearchContext.Provider
			value={{
				excludedSearchTerms,
				includedSearchTerms,
				isSaveSearchButtonDisabled,
				isSearchesDialogOpen,
				isDeleteMultipleModeOpen,
				setIsDeleteMultipleModeOpen,
				setExcludedSearchTerms,
				setIncludedSearchTerms,
				setIsSaveSearchButtonDisabled,
				setIsSearchesDialogOpen,
			}}>
			{children}
		</SearchContext.Provider>
	);
};

export const SearchConsumer = SearchContext.Consumer;
