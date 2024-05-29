import { useSetUser } from "@hooks";
import { IFormInput as IRegisterInput } from "@components";

const REGISTER_URL = "http://localhost:3000/register";

export function useRegister() {
	const setUser = useSetUser();

	return async (data: IRegisterInput) => {
		try {
			const response = await fetch(REGISTER_URL, {
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

			console.log({ jsonResponse });

			// converting keys from snake_case to camelCase
			const responseUser = {
				firstName: jsonResponse.user.first_name,
				lastName: jsonResponse.user.last_name,
				email: jsonResponse.user.email,
				id: jsonResponse.user.id,
				isAdmin: jsonResponse.user.is_admin,
				searches: jsonResponse.user.searches,
			};
			setUser(responseUser);
			sessionStorage.setItem("user", JSON.stringify(responseUser));
		} catch (error) {
			console.error("Error registering", error);
		}
	};
}
