import { useDeletePet, usePets, useGetUser } from "@hooks";
import { PetType } from "@types";
import { MoreVertical } from "./subcomponents";

export function PetsDialogListItem({
	pet,
	handlePetsDialogClose,
}: {
	pet: PetType;
	handlePetsDialogClose: () => void;
}) {
	const user = useGetUser();
	const searches = user?.searches || [];

	const deletePet = useDeletePet();
	const {
		selectedPet,
		setSelectedPet,
		pets,
		setPets,
		selectedPetOptionOpenId,
		setSelectedPetOptionOpenId,
	} = usePets();
	const petId = pet.id;
	const petName = pet.petName;

	const petSearches = searches.filter((search) => search.pet_id === pet.id);

	const petSearchesCount = petSearches.length;

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

	const handleOptionOpenOnClick = () => {
		if (selectedPetOptionOpenId === pet.id) {
			setSelectedPetOptionOpenId(null);
		} else {
			setSelectedPetOptionOpenId(pet.id);
		}
	};

	const styleStr = `flex justify-between items-center bg-gray-50 hover:bg-gray-100 text-gray-800 my-1 border-2 border-solid rounded-lg p-4 cursor-pointer`;
	const className =
		selectedPet?.id === pet.id
			? `${styleStr} bg-yellow-100 hover:bg-orange-100`
			: styleStr;

	return (
		<div className={className}>
			<div
				className="cursor-pointer flex-grow flex justify-between items-center"
				onClick={handleSelectOnClick}>
				<span>{pet.petName}</span>
				{petSearchesCount > 0 && (
					<span className="px-2 text-xs">
						{petSearchesCount}
						{petSearchesCount > 1 ? " searches" : " search"}
					</span>
				)}
			</div>

			<div className="relative px-2">
				<MoreVertical onClick={handleOptionOpenOnClick} />
				{selectedPetOptionOpenId === pet.id && (
					<ul className="p-2 shadow absolute right-6 top-0 menu z-[100] bg-base-100 rounded-box w-24">
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
				)}
			</div>
		</div>
	);
}
