import { useContext, useEffect } from "react";
import { UserContext } from "@contexts";

export function useSetUser() {
	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		const sessionStorageUser = sessionStorage.getItem("user");
		const sessionStorageUserEmail = sessionStorageUser
			? JSON.parse(sessionStorageUser).email
			: null;

		// case 1: local storage user exists, context user exists, but not the same email, set local storage user to context user
		if (sessionStorageUser && user && sessionStorageUserEmail !== user.email) {
			sessionStorage.setItem("user", JSON.stringify(user));
		}

		// case 2: local storage user exists, context user does not exist, set user to local storage user
		if (sessionStorageUser && !user) {
			setUser(JSON.parse(sessionStorageUser));
		}

		// case 3: local storage user does not exist, context user exists, set local storage user to context user
		if (!sessionStorageUser && user) {
			sessionStorage.setItem("user", JSON.stringify(user));
		}
	}, [user, setUser]);

	return setUser;
}
