import { SearchesDialogList } from "@components";

export function SearchesDialog({
	isSearchesDialogOpen,
	handleSearchesDialogClose,
}: {
	isSearchesDialogOpen: boolean;
	handleSearchesDialogClose: () => void;
}) {
	return (
		<dialog className={isSearchesDialogOpen ? "modal modal-open" : "modal"}>
			<div className="modal-box" onClick={handleSearchesDialogClose}>
				<div>
					<h3 className="font-bold text-lg pt-2">Saved Searches</h3>

					<SearchesDialogList />

					<div className="modal-action">
						<form method="dialog">
							<button className="btn">Close</button>
						</form>
					</div>
				</div>
			</div>
		</dialog>
	);
}
