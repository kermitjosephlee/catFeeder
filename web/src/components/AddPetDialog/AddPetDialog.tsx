// import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetUser } from "@hooks";

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
}: {
	handlePetsDialogClose: () => void;
}) {
	const user = useGetUser();
	const userId = user?.id;

	const { register, handleSubmit, reset } = useForm<IFormInput>({
		resolver: yupResolver(petSchema),
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		// TODO: Implement add pet fetch post call
		//
		console.log({ data, userId });

		fetch(`${PETS_URL}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...data,
				userId,
			}),
		})
			.then((res) => res.json())
			.then((data) => console.log(data))
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
