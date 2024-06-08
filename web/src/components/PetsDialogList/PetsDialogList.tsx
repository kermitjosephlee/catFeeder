import { PetsDialogListItem } from "@components";
import { usePets } from "@hooks";

export function PetsDialogList({
	handlePetsDialogClose,
}: {
	handlePetsDialogClose: () => void;
}) {
	const { pets } = usePets();

	return (
		<>
			<div className="flex flex-col flex-start overflow-scroll max-h-96">
				{pets.map((pet) => (
					<PetsDialogListItem
						key={pet.id}
						pet={pet}
						handlePetsDialogClose={handlePetsDialogClose}
					/>
				))}
			</div>
			<div className="modal-action">
				<div className="btn btn-primary" onClick={handlePetsDialogClose}>
					Close
				</div>
			</div>
		</>
	);
}
