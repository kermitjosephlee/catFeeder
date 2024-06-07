export function PetsDialogList({
	handlePetsDialogClose,
}: {
	handlePetsDialogClose: () => void;
}) {
	return (
		<div>
			Pets List{" "}
			<div className="modal-action">
				<div className="btn btn-primary" onClick={handlePetsDialogClose}>
					Close
				</div>
			</div>
		</div>
	);
}
