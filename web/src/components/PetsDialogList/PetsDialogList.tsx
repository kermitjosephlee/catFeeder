import { PetsDialogListItem } from "@components";
import { PetType } from "@types";

export function PetsDialogList({
	handlePetsDialogClose,
	handleDeletePet,
	pets,
}: {
	handlePetsDialogClose: () => void;
	handleDeletePet: (id: string) => void;
	pets: PetType[];
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
