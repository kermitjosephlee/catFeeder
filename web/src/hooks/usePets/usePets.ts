import { useContext } from "react";
import { PetContext } from "@contexts";

export function usePets() {
	const { pets, selectedPet, setPets, setSelectedPet } = useContext(PetContext);

	return { pets, selectedPet, setPets, setSelectedPet };
}
