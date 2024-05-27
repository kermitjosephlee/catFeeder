import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSetUser, useGetUser } from "../../hooks";

const loginSchema = yup
	.object({
		email: yup.string().email().required(),
		password: yup.string().min(8).max(100).required(),
	})
	.required();

const registrationSchema = yup
	.object({
		firstName: yup.string().required(),
		lastName: yup.string().required(),
		email: yup.string().email().required(),
		password: yup.string().min(8).max(100).required(),
	})
	.required();

interface IFormInput {
	firstName?: string;
	lastName?: string;
	email: string;
	password: string;
}

interface IProps {
	isDialogOpen: boolean;
	// toggleDialogOpen: () => void;
	handleDialogClose: () => void;
}

export function LoginDialog({ isDialogOpen, handleDialogClose }: IProps) {
	const [isUserRegistration, setIsUserRegistration] = useState(false);
	const setUser = useSetUser();
	const user = useGetUser();

	const { register, handleSubmit, reset } = useForm<IFormInput>({
		resolver: yupResolver(
			isUserRegistration ? registrationSchema : loginSchema
		),
	});

	useEffect(() => {
		console.log("LoginDialog", { user });
	}, [user]);

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		const postURL = isUserRegistration
			? "http://localhost:3000/register"
			: "http://localhost:3000/login";
		try {
			const response = await fetch(postURL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const jsonResponse = await response.json();

			// converting keys from snake_case to camelCase
			const responseUser = {
				firstName: jsonResponse.user.first_name,
				lastName: jsonResponse.user.last_name,
				email: jsonResponse.user.email,
				id: jsonResponse.user.id,
			};

			setUser(responseUser);
			sessionStorage.setItem("user", JSON.stringify(responseUser));

			reset();
			handleDialogClose();
		} catch (error) {
			console.error(
				"There has been a problem with your fetch operation:",
				error
			);
		}
	};

	return (
		<dialog
			id="login-dialog"
			className={isDialogOpen ? "modal modal-open" : "modal"}>
			<div className="modal-box">
				<div className="flex justify-between items-center">
					<h3 className="font-bold text-lg">
						{isUserRegistration ? "Registration" : "Login"}
					</h3>
					<div>
						<button
							className="btn btn-ghost"
							onClick={() => setIsUserRegistration(!isUserRegistration)}>
							{isUserRegistration ? "Click to Login" : "Click to Register"}
						</button>
					</div>
				</div>
				<p className="py-4"></p>
				<div className="modal-action">
					<form
						className="flex flex-col justify-center items-center w-full gap-4"
						method="dialog"
						onSubmit={handleSubmit(onSubmit)}>
						{isUserRegistration && (
							<>
								<input
									type="text"
									{...register("firstName")}
									placeholder="First Name"
								/>
								<input
									type="text"
									{...register("lastName")}
									placeholder="Last Name"
								/>
							</>
						)}
						<input type="email" {...register("email")} placeholder="Email" />
						<input
							type="password"
							{...register("password")}
							placeholder="Password"
						/>

						<div className="flex justify-between gap-4">
							<input
								type="submit"
								className="btn btn-secondary"
								value="Submit"
							/>
							<button className="btn btn-ghost" onClick={handleDialogClose}>
								Close
							</button>
						</div>
					</form>
				</div>
			</div>
		</dialog>
	);
}
