import { useContext } from "react";
import { UserContext } from "@contexts";

export function useGetUser() {
	const { user } = useContext(UserContext);

	return user;
}
