import { useState } from "react";
import { useSearch, useDeleteSearch, useGetUser } from "@hooks";
import { SearchesDialogList } from "@components";

export function SearchesDialog({
	handleSearchesDialogClose,
}: {
	handleSearchesDialogClose: () => void;
}) {
	const [deleteSearchIds, setDeleteSearchIds] = useState<string[]>([]);

	const {
		isSearchesDialogOpen,
		isDeleteMultipleModeOpen,
		setIsDeleteMultipleModeOpen,
	} = useSearch();

	const user = useGetUser();
	const deleteSearch = useDeleteSearch();

	const handleDeleteMultipleModeToggle = () => {
		setDeleteSearchIds([]);
		setIsDeleteMultipleModeOpen((prev) => !prev);
	};

	const handleSelectDeleteSearchCheckbox = (id: string) => {
		if (deleteSearchIds.includes(id)) {
			setDeleteSearchIds((prev) => prev.filter((searchId) => searchId !== id));
		} else {
			setDeleteSearchIds((prev) => [...prev, id]);
		}
	};

	const handleDeleteSearches = () => {
		if (!user || deleteSearchIds.length === 0) {
			setIsDeleteMultipleModeOpen(false);
			return;
		} else {
			deleteSearch({ userId: user.id, searchIds: deleteSearchIds });
			setDeleteSearchIds([]);
			setIsDeleteMultipleModeOpen(false);
			handleSearchesDialogClose();
		}
	};

	const handleOnClose = () => {
		setIsDeleteMultipleModeOpen(false);
		handleSearchesDialogClose();
		setDeleteSearchIds([]);
	};

	const deleteSelectedClassName =
		isDeleteMultipleModeOpen && deleteSearchIds.length > 0
			? "btn btn-outline btn-error"
			: "btn btn-outline btn-error disabled";

	return (
		<dialog className={isSearchesDialogOpen ? "modal modal-open" : "modal"}>
			<div className="modal-box w-11/12 max-w-3xl">
				<div className="modal-header flex justify-between items-baseline">
					<h3 className="font-bold text-lg pt-2">Saved Searches</h3>
					<div
						className="cursor-pointer btn btn-outline btn-primary"
						onClick={handleDeleteMultipleModeToggle}>
						{isDeleteMultipleModeOpen ? "Cancel" : "Delete Multiple Searches"}
					</div>
				</div>
				<SearchesDialogList
					deleteSearchIds={deleteSearchIds}
					handleSelectDeleteSearchCheckbox={handleSelectDeleteSearchCheckbox}
				/>
				<div className="modal-action">
					<div onClick={handleDeleteSearches}>
						{isDeleteMultipleModeOpen ? (
							<div className={deleteSelectedClassName}>Delete Selected</div>
						) : null}
					</div>
					<div className="btn btn-primary" onClick={handleOnClose}>
						Close
					</div>
				</div>
			</div>
		</dialog>
	);
}
