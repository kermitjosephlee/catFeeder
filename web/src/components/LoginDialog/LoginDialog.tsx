import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLogin, useRegister } from "@hooks";

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

export interface IFormInput {
	firstName?: string;
	lastName?: string;
	email: string;
	password: string;
}

interface IProps {
	isDialogOpen: boolean;
	handleDialogClose: () => void;
}

export function LoginDialog({ isDialogOpen, handleDialogClose }: IProps) {
	const [isUserRegistration, setIsUserRegistration] = useState(false);
	const login = useLogin();
	const registerUser = useRegister();

	const { register, handleSubmit, reset } = useForm<IFormInput>({
		resolver: yupResolver(
			isUserRegistration ? registrationSchema : loginSchema
		),
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		if (isUserRegistration) {
			await registerUser(data);
		} else {
			await login(data);
		}
		reset();
		handleDialogClose();
	};

	return (
		<dialog
			id="login-dialog"
			className={isDialogOpen ? "modal modal-open" : "modal"}>
			<div className="modal-box">
				<div className="flex justify-between items-center">
					<h3 className="font-bold text-2xl">
						{isUserRegistration ? "Registration" : "Login"}
					</h3>
					<div>
						<button
							className="btn btn-ghost border-gray-300"
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
									className="p-3 rounded w-3/4 border-gray-200 border-2 border-radius-2xl"
									type="text"
									{...register("firstName")}
									placeholder="First Name"
								/>
								<input
									className="p-3 rounded w-3/4 border-gray-200 border-2 border-radius-2xl"
									type="text"
									{...register("lastName")}
									placeholder="Last Name"
								/>
							</>
						)}
						<input
							className="p-3 rounded w-3/4 border-gray-200 border-2 border-radius-2xl"
							type="email"
							{...register("email")}
							placeholder="Email"
						/>
						<input
							className="p-3 rounded w-3/4 border-gray-200 border-2 border-radius-2xl"
							type="password"
							{...register("password")}
							placeholder="Password"
						/>

						<div className="flex justify-between gap-4 py-4">
							<input
								type="submit"
								className="btn btn-secondary"
								value="Submit"
							/>
							<button
								className="btn btn-ghost border-gray-300"
								onClick={handleDialogClose}>
								Close
							</button>
						</div>
					</form>
				</div>
			</div>
		</dialog>
	);
}
