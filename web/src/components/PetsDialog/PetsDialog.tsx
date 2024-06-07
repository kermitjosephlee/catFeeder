import { useState } from "react";

import { AddPetDialog, PetsDialogList } from "@components";

export function PetsDialog({
	isPetsDialogOpen,
	handlePetsDialogClose,
}: {
	isPetsDialogOpen: boolean;
	handlePetsDialogClose: () => void;
}) {
	const [isAddPetDialogOpen, setIsAddPetDialogOpen] = useState(true);

	const handleOnClick = () => {
		setIsAddPetDialogOpen((prev) => !prev);
	};

	return (
		<dialog className={isPetsDialogOpen ? "modal modal-open" : "modal"}>
			<div className="modal-box">
				<div className="modal-header flex justify-between items-baseline">
					<h3 className="font-bold text-lg pt-2">Pets</h3>
					<div className="btn btn-primary" onClick={() => handleOnClick()}>
						{isAddPetDialogOpen ? "Close" : "Add Pet"}
					</div>
				</div>

				{isAddPetDialogOpen ? (
					<AddPetDialog handlePetsDialogClose={handlePetsDialogClose} />
				) : (
					<PetsDialogList handlePetsDialogClose={handlePetsDialogClose} />
				)}
			</div>
		</dialog>
	);
}
