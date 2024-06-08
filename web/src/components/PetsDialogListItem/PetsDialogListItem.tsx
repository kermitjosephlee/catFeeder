import { useDeletePet, usePets } from "@hooks";
import { PetType } from "@types";

export function PetsDialogListItem({
	pet,
	handlePetsDialogClose,
}: {
	pet: PetType;
	handlePetsDialogClose: () => void;
}) {
	const deletePet = useDeletePet();
	const { selectedPet, setSelectedPet, pets, setPets } = usePets();
	const petId = pet.id;
	const petName = pet.petName;

	const handleSelectOnClick = () => {
		if (!!selectedPet && selectedPet.id === pet.id) {
			setSelectedPet(null);
		}

		if (!!selectedPet && selectedPet.id !== pet.id) {
			setSelectedPet(pet);
		}

		if (!selectedPet) {
			setSelectedPet(pet);
		}
	};

	const handleEditOnClick = () => {
		console.log("editPet", { pet });
	};

	const handleDeleteOnClick = async () => {
		// makes api call to delete pet
		await deletePet({ petId, petName });
		const updatedPets = pets.filter((pet) => pet.id !== petId);
		// updates state to remove pet from list
		await setPets(updatedPets);
		handlePetsDialogClose();
	};

	const styleStr = `flex justify-between items-center bg-gray-50 hover:bg-gray-100 text-gray-800 my-1 border-2 border-solid rounded-lg px-4 cursor-pointer`;
	const className =
		selectedPet?.id === pet.id
			? `${styleStr} bg-yellow-100 hover:bg-orange-100`
			: styleStr;

	return (
		<div className={className} onClick={handleSelectOnClick}>
			<div className="cursor-pointer">{pet.petName}</div>
			<details className="dropdown dropdown-left">
				<summary className="m-1 btn">options</summary>
				<ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-24">
					<li className="text-right">
						<div className="text-right" onClick={handleEditOnClick}>
							Edit
						</div>
					</li>
					<li className="text-right">
						<div className="text-right" onClick={handleDeleteOnClick}>
							Delete
						</div>
					</li>
				</ul>
			</details>
		</div>
	);
}
