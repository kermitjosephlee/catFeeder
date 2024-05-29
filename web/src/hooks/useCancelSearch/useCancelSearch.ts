import { useSetUser } from "@hooks";

const CANCEL_SEARCH_URL = "http://localhost:3000/cancel_search";

export function useCancelSearch() {
	const setUser = useSetUser();

	return async ({ userId, searchId }: { searchId: string; userId: string }) => {
		try {
			const response = await fetch(CANCEL_SEARCH_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, searchId }),
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
