import { useContext } from "react";
import { PetContext } from "@contexts";

export function usePets() {
	const {
		pets,
		selectedPet,
		selectedPetOptionOpenId,
		setPets,
		setSelectedPet,
		setSelectedPetOptionOpenId,
	} = useContext(PetContext);

	return {
		pets,
		selectedPet,
		selectedPetOptionOpenId,
		setPets,
		setSelectedPet,
		setSelectedPetOptionOpenId,
	};
}
