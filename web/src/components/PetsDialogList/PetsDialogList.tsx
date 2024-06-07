import { IPets, PetsDialogListItem } from "@components";

export function PetsDialogList({
	handlePetsDialogClose,
	handleDeletePet,
	pets,
}: {
	handlePetsDialogClose: () => void;
	handleDeletePet: (id: string) => void;
	pets: IPets[];
}) {
	return (
		<div>
			<div>
				{pets.map((pet) => (
					<PetsDialogListItem
						key={pet.id}
						pet={pet}
						handleDeletePet={handleDeletePet}
						handlePetsDialogClose={handlePetsDialogClose}
					/>
				))}
			</div>
			<div className="modal-action">
				<div className="btn btn-primary" onClick={handlePetsDialogClose}>
					Close
				</div>
			</div>
		</div>
	);
}
