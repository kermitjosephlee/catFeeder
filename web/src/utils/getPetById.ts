import { PetType } from "@/types";

export function getPetById(pets: PetType[], petId: string) {
	return pets.find((pet) => pet.id.toString() === petId);
}
