import { useState } from "react";
import { useGetUser } from "@hooks";
import { PetType } from "@types";

const GET_PETS_URL = `http://localhost:3000/pets`;

export function useGetPets() {
	const [pets, setPets] = useState<PetType[]>([]);
	const user = useGetUser();
	const userId = user?.id;
	const queryParams = userId ? `?userId=${userId}` : "";

	const fetchPets = async () => {
		if (!userId) return;
		try {
			const response = await fetch(`${GET_PETS_URL}${queryParams}`);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			const responsePets = data.pets.map(
				(each: { id: string; pet_name: string }) => {
					return {
						id: each.id,
						petName: each.pet_name,
					};
				}
			);
			setPets(responsePets);
		} catch (err) {
			console.log(err);
		}
	};

	return { pets, fetchPets };
}
