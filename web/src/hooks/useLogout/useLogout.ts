import { useSetUser, usePets } from "@hooks";

const LOGOUT_URL = "http://localhost:3000/logout";

export function useLogout() {
	const setUser = useSetUser();
	const { setPets, setSelectedPet } = usePets();

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
			await setUser(null);
			await setPets([]);
			await setSelectedPet(null);
			sessionStorage.removeItem("user");
		} catch (error) {
			console.log("Error logging out", error);
		}
	};
}
