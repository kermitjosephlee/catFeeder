import { IPets } from "@components";
import { useDeletePet } from "@hooks";

export function PetsDialogListItem({
	pet,
	handleDeletePet,
	handlePetsDialogClose,
}: {
	pet: IPets;
	handleDeletePet: (id: string) => void;
	handlePetsDialogClose: () => void;
}) {
	const deletePet = useDeletePet();
	const petId = pet.id;
	const petName = pet.petName;

	const handleOnClick = async () => {
		await deletePet({ petId, petName });
		await handleDeletePet(petId);
		handlePetsDialogClose();
	};

	return (
		<div className="flex flex-grow">
			<div className="cursor-pointer" onClick={handleOnClick}>
				{pet.petName}
			</div>
		</div>
	);
}
