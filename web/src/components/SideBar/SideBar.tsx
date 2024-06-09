// import { useState } from "react";
import { useGetUser, useSetUser, useSearch, usePets } from "@hooks";
import { SearchPill, SearchEnum } from "@components";

interface IProps {
	includedSearchTerms: string[];
	excludedSearchTerms: string[];
	handleSearchTermsReset: () => void;
	handleSearchTermCancel: (searchTerm: string) => void;
}

export function SideBar({
	includedSearchTerms,
	excludedSearchTerms,
	handleSearchTermsReset,
	handleSearchTermCancel,
}: IProps) {
	const user = useGetUser();
	const setUser = useSetUser();
	const { isSaveSearchButtonDisabled } = useSearch();
	const { selectedPet } = usePets();

	const hasSearchTerms =
		includedSearchTerms.length > 0 || excludedSearchTerms.length > 0;

	const showSaveSearchButton =
		user && hasSearchTerms && !isSaveSearchButtonDisabled;

	const handleSaveSearch = () => {
		if (!user) return;

		fetch("http://localhost:3000/search", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				include: includedSearchTerms,
				exclude: excludedSearchTerms,
				userId: user.id,
				petId: selectedPet?.id,
			}),
		})
			.then((response) => {
				if (response.ok) {
					const jsonResponse = response.json();
					return jsonResponse;
				} else {
					alert("Failed to save search");
				}
			})
			.then((jsonResponse) => {
				const responseUser = {
					firstName: jsonResponse.user.first_name,
					lastName: jsonResponse.user.last_name,
					email: jsonResponse.user.email,
					id: jsonResponse.user.id,
					isAdmin: jsonResponse.user.is_admin,
					searches: jsonResponse.user.searches,
				};
				setUser(responseUser);
				sessionStorage.setItem("user", JSON.stringify(responseUser));
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="flex flex-col pt-2 sticky top-0">
			{hasSearchTerms && (
				<button
					className="bg-yellow-800 text-white px-2 m-2 btn"
					onClick={handleSearchTermsReset}>
					Clear All
				</button>
			)}
			{includedSearchTerms.length > 0 && <p>Includes</p>}
			{includedSearchTerms.map((searchTerm) => (
				<SearchPill
					key={searchTerm}
					searchTerm={searchTerm}
					type={SearchEnum.INCLUDED}
					handleSearchTermCancel={handleSearchTermCancel}
				/>
			))}
			{excludedSearchTerms.length > 0 && <p>Excludes</p>}
			{excludedSearchTerms.map((searchTerm) => (
				<SearchPill
					key={searchTerm}
					searchTerm={searchTerm}
					type={SearchEnum.EXCLUDED}
					handleSearchTermCancel={handleSearchTermCancel}
				/>
			))}
			{showSaveSearchButton && !selectedPet && (
				<button
					className="p-2 m-2 mt-6 btn btn-primary overflow-hidden"
					onClick={handleSaveSearch}>
					Save Search
				</button>
			)}
			{showSaveSearchButton && selectedPet && (
				<button
					className="p-2 m-2 mt-6 btn btn-primary overflow-hidden"
					onClick={handleSaveSearch}>
					Save for {selectedPet.petName}
				</button>
			)}
		</div>
	);
}
