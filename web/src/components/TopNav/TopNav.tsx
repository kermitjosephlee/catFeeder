import { useState } from "react";
import { LoginDialog, PetsDialog, SearchesDialog } from "@components";
import { useGetUser, useLogout, useSearch, usePets } from "@hooks";

export function TopNav() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isPetsDialogOpen, setIsPetsDialogOpen] = useState(false);
	const { setIsSearchesDialogOpen } = useSearch();
	const user = useGetUser();
	const { selectedPet } = usePets();
	const handleLogout = useLogout();
	const searchCount = user?.searches?.filter((search) => !!search.id).length;

	const toggleDialogOpen = () => {
		if (!user) {
			setIsDialogOpen(true);
		}

		if (user) {
			handleLogout();
		}
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
	};

	const handleSearchesDialogOpen = () => {
		setIsSearchesDialogOpen(true);
	};

	const handleSearchesDialogClose = () => {
		setIsSearchesDialogOpen(false);
	};

	const handlePetsDialogOpen = () => {
		setIsPetsDialogOpen(true);
	};

	const handlePetsDialogClose = () => {
		setIsPetsDialogOpen(false);
	};

	return (
		<>
			<div className="navbar bg-red-100 h-36 flex items-center justify-between">
				<div>
					<a className="text-xl flex items-center" href="/">
						<img className="h-16" src="/logo-brown.svg" alt="cat-feeder-logo" />
					</a>
				</div>
				<div>
					{user && (
						<button
							className="btn btn-secondary mr-6"
							onClick={handlePetsDialogOpen}>
							{selectedPet ? selectedPet.petName : "Pets"}
						</button>
					)}
					{searchCount && searchCount > 0 ? (
						<div className="indicator mr-6">
							<span className="indicator-item badge badge-primary">
								{searchCount}
							</span>
							<button
								className="btn btn-secondary"
								onClick={handleSearchesDialogOpen}>
								Saved Searches
							</button>
						</div>
					) : (
						<div></div>
					)}
					<div className="btn btn-secondary" onClick={toggleDialogOpen}>
						{user ? `Logout ${user.firstName}` : "Login"}
					</div>
				</div>
			</div>

			<LoginDialog
				isDialogOpen={isDialogOpen}
				handleDialogClose={handleDialogClose}
			/>
			<SearchesDialog handleSearchesDialogClose={handleSearchesDialogClose} />
			<PetsDialog
				isPetsDialogOpen={isPetsDialogOpen}
				handlePetsDialogClose={handlePetsDialogClose}
			/>
		</>
	);
}
