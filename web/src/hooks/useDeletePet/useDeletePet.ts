import { useGetUser } from "@hooks";
import { PostPetAction } from "@types";

const DELETE_PET_URL = "http://localhost:3000/pets";

export function useDeletePet() {
	const user = useGetUser();

	return async ({ petId, petName }: { petId: string; petName: string }) => {
		try {
			const response = await fetch(DELETE_PET_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: petId.toString(),
					petName,
					userId: user?.id.toString(),
					action: PostPetAction.DELETE,
				}),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const jsonResponse = await response.json();

			return jsonResponse;
		} catch (error) {
			console.error("Error deleting pet", error);
		}
	};
}
