import { useSetUser } from "@hooks";

const DELETE_SEARCH_URL = "http://localhost:3000/cancel_search";

export function useDeleteSearch() {
	const setUser = useSetUser();

	return async ({
		userId,
		searchIds,
	}: {
		userId: string;
		searchIds: string[];
	}) => {
		console.log({ userId, searchIds, DELETE_SEARCH_URL });
		try {
			const response = await fetch(DELETE_SEARCH_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, searchIds }),
			});

			console.log({ response });

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
			console.error("Error canceling search", error);
		}
	};
}
