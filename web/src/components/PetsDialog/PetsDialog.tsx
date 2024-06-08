import { useState, useEffect } from "react";
import { useGetUser } from "@hooks";
import { AddPetDialog, PetsDialogList } from "@components";
import { PetType } from "@types";

export function PetsDialog({
	isPetsDialogOpen,
	handlePetsDialogClose,
}: {
	isPetsDialogOpen: boolean;
	handlePetsDialogClose: () => void;
}) {
	const [isAddPetDialogOpen, setIsAddPetDialogOpen] = useState(false);
	const [pets, setPets] = useState<PetType[]>([]);

	const user = useGetUser();
	const userId = user?.id;

	// fetches pets data on user change
	useEffect(() => {
		if (!userId) return;
		fetch(`http://localhost:3000/pets?userId=${userId}`)
			.then((res) => res.json())
			.then((data) => {
				const responsePets = data.pets.map(
					(each: { id: string; pet_name: string }) => {
						return {
							id: each.id,
							petName: each.pet_name,
						};
					}
				);
				setPets(responsePets);
			})
			.catch((error) => console.error("Error:", error));
	}, [userId, setPets]);

	const handleNewPet = (newPets: PetType[]) => {
		setPets(newPets);
	};

	const handleDeletePet = (petId: string) => {
		const updatedPets = pets.filter((pet) => pet.id !== petId);
		setPets(updatedPets);
	};

	const handleOnClick = () => {
		setIsAddPetDialogOpen((prev) => !prev);
	};

	return (
		<dialog className={isPetsDialogOpen ? "modal modal-open" : "modal"}>
			<div className="modal-box w-11/12 max-w-5xl h-1/2 max-h-1/2 flex flex-col justify-between">
				<div className="modal-header flex justify-between items-baseline mb-4">
					<h3 className="font-bold text-lg pt-2">
						{isAddPetDialogOpen ? "Add Pet" : "Pet List"}
					</h3>
					<div className="btn btn-primary" onClick={handleOnClick}>
						{isAddPetDialogOpen ? "Pet List" : "Add Pet"}
					</div>
				</div>

				{isAddPetDialogOpen ? (
					<AddPetDialog
						handlePetsDialogClose={handlePetsDialogClose}
						handleNewPet={handleNewPet}
					/>
				) : (
					<PetsDialogList
						pets={pets}
						handlePetsDialogClose={handlePetsDialogClose}
						handleDeletePet={handleDeletePet}
					/>
				)}
			</div>
		</dialog>
	);
}
