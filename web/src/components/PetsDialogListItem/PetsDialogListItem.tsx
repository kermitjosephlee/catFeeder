import { useDeletePet } from "@hooks";
import { PetType } from "@types";

export function PetsDialogListItem({
	pet,
	handleDeletePet,
	handlePetsDialogClose,
}: {
	pet: PetType;
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
