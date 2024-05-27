import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginDialog } from "@components";
import { useGetUser, useSetUser } from "../../hooks";

interface IProps {
	checked: boolean;
	handleToggle: () => void;
	handleIngredients: (ingredient: string) => void;
}

interface IFormInput {
	ingredient: string;
}

export function TopNav({ checked, handleToggle, handleIngredients }: IProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { register, handleSubmit, reset } = useForm<IFormInput>();
	const user = useGetUser();
	const setUser = useSetUser();
	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		if (data.ingredient !== "") {
			handleIngredients(data.ingredient);
		}
		reset();
	};

	useEffect(() => {
		console.log("Top NAV", { user });
	}, [user]);

	const handleLogout = () => {
		fetch("http://localhost:3000/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				console.log("logout", res);
				return res.json();
			})
			.then((res) => {
				if (res.ok && res.message === "User logged out") {
					setUser(null);
				} else {
					console.log("Error is logging out", res);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				sessionStorage.removeItem("user");
			});
	};

	const toggleDialogOpen = () => {
		if (!user) {
			setIsDialogOpen(true);
		}

		if (user) {
			handleLogout();
		}
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
	};

	return (
		<>
			<div className="navbar bg-red-100 h-36 flex items-center justify-between">
				<div>
					<a className="text-xl flex items-center" href="/">
						<img className="h-16" src="/logo-brown.svg" alt="cat-feeder-logo" />
					</a>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							className="toggle toggle-lg"
							checked={checked}
							onChange={handleToggle}
						/>
						<label className="input input-bordered flex items-center gap-2">
							<input
								type="text"
								className="grow"
								placeholder={checked ? "Include" : "Exclude"}
								{...register("ingredient")}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="w-4 h-4 opacity-70">
								<path
									fillRule="evenodd"
									d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
									clipRule="evenodd"
								/>
							</svg>
						</label>
						<input type="submit" className="btn btn-primary" />
					</div>
				</form>
				<div className="btn btn-secondary" onClick={toggleDialogOpen}>
					{user ? `Logout ${user.firstName}` : "Login"}
				</div>
			</div>
			<LoginDialog
				isDialogOpen={isDialogOpen}
				// toggleDialogOpen={toggleDialogOpen
				handleDialogClose={handleDialogClose}
			/>
		</>
	);
}
