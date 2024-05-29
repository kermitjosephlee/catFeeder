import { useState } from "react";
import { LoginDialog } from "@components";
import { useGetUser, useLogout } from "@hooks";

export function TopNav() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const user = useGetUser();
	const searchCount = user?.searches?.length;
	const handleLogout = useLogout();

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

	const handleSearchClick = () => {
		console.log("Saved Searches clicked", { user });
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
					{searchCount && (
						<div className="indicator mr-6">
							<span className="indicator-item badge badge-primary">
								{searchCount}
							</span>
							<button className="btn btn-secondary" onClick={handleSearchClick}>
								Saved Searches
							</button>
						</div>
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
		</>
	);
}
