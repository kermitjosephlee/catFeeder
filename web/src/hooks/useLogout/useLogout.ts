import { useSetUser } from "@hooks";

const LOGOUT_URL = "http://localhost:3000/logout";

export function useLogout() {
	const setUser = useSetUser();

	return async () => {
		try {
			const response = await fetch(LOGOUT_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok || response.status !== 200) {
				console.log("Network response was not ok");
				return;
			}
			setUser(null);
			sessionStorage.removeItem("user");
		} catch (error) {
			console.log("Error logging out", error);
		}
	};
}
