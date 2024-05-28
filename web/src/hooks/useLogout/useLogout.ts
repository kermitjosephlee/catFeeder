import { useSetUser } from "@hooks";

export function useLogout() {
	const setUser = useSetUser();

	return () => {
		fetch("http://localhost:3000/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				if (res.status === 200 && res.ok) {
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
}
