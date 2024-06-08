// import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetUser } from "@hooks";
import { PostPetAction, PetType } from "@types";

const PETS_URL = "http://localhost:3000/pets";

const petSchema = yup
	.object({
		petName: yup.string().required(),
	})
	.required();

interface IFormInput {
	petName: string;
}

export function AddPetDialog({
	handlePetsDialogClose,
	handleNewPet,
}: {
	handlePetsDialogClose: () => void;
	handleNewPet: (newPets: PetType[]) => void;
}) {
	const user = useGetUser();
	const userId = user?.id;

	const { register, handleSubmit, reset } = useForm<IFormInput>({
		resolver: yupResolver(petSchema),
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		fetch(`${PETS_URL}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...data,
				userId,
				action: PostPetAction.ADD,
			}),
		})
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
				handleNewPet(responsePets);
			})
			.catch((error) => console.error("Error:", error));

		reset();
		handlePetsDialogClose();
	};

	return (
		<div>
			<form
				className="flex flex-col justify-center items-center w-full gap-4"
				method="dialog"
				onSubmit={handleSubmit(onSubmit)}>
				<input
					className="p-3 rounded w-3/4 border-gray-200 border-2 border-radius-2xl"
					type="text"
					{...register("petName")}
					placeholder="Pet Name"
				/>

				<div className="flex justify-between gap-4 py-4">
					<input type="submit" className="btn btn-secondary" value="Submit" />
					<button
						className="btn btn-ghost border-gray-300"
						onClick={() => console.log("on Click Cancel")}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
